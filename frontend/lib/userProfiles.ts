export interface UserProfileData {
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role?: string;
  linkedin?: string;
  [key: string]: any;
}

/**
 * Persists updated user profile information (name, avatar, bio, role) permanently
 * across sign-outs and sign-ins keyed by email address.
 */
export function saveUserProfile(user: UserProfileData) {
  if (!user || !user.email) return;
  const emailKey = user.email.toLowerCase().trim();

  try {
    // 1. Save to central dj_user_profiles_db
    const existingDbStr = localStorage.getItem("dj_user_profiles_db");
    const profilesDb: Record<string, UserProfileData> = existingDbStr ? JSON.parse(existingDbStr) : {};
    
    const updatedProfile = {
      ...profilesDb[emailKey],
      ...user,
      email: emailKey
    };

    profilesDb[emailKey] = updatedProfile;
    localStorage.setItem("dj_user_profiles_db", JSON.stringify(profilesDb));

    // 2. Also save to dj_user_profile for active profile lookup
    localStorage.setItem("dj_user_profile", JSON.stringify(updatedProfile));

    // 3. Update registered users list if present
    const regStr = localStorage.getItem("dj_registered_users");
    if (regStr) {
      const regList: any[] = JSON.parse(regStr);
      const idx = regList.findIndex((u) => u.email && u.email.toLowerCase().trim() === emailKey);
      if (idx !== -1) {
        regList[idx] = { ...regList[idx], ...updatedProfile };
      } else {
        regList.push(updatedProfile);
      }
      localStorage.setItem("dj_registered_users", JSON.stringify(regList));
    }

    // 4. Update device google accounts
    const deviceStr = localStorage.getItem("dj_device_google_accounts");
    if (deviceStr) {
      const deviceList: any[] = JSON.parse(deviceStr);
      const idx = deviceList.findIndex((a) => a.email && a.email.toLowerCase().trim() === emailKey);
      if (idx !== -1) {
        deviceList[idx].name = user.name || deviceList[idx].name;
        if (user.avatar) {
          deviceList[idx].avatar = user.avatar;
        }
      }
      localStorage.setItem("dj_device_google_accounts", JSON.stringify(deviceList));
    }

    // 5. Update active user session object if email matches
    ["dj_user", "dj_writer_user"].forEach((key) => {
      const activeStr = localStorage.getItem(key);
      if (activeStr) {
        try {
          const activeObj = JSON.parse(activeStr);
          if (activeObj?.email && activeObj.email.toLowerCase().trim() === emailKey) {
            if (user.name) activeObj.name = user.name;
            if (user.avatar) activeObj.avatar = user.avatar;
            if (user.bio) activeObj.bio = user.bio;
            localStorage.setItem(key, JSON.stringify(activeObj));
          }
        } catch (e) {}
      }
    });

    // 6. Update all submitted articles by this author so their authorAvatar matches
    if (user.avatar) {
      const articlesStr = localStorage.getItem("dj_writer_submitted_articles");
      if (articlesStr) {
        try {
          const articlesList: any[] = JSON.parse(articlesStr);
          let updated = false;
          articlesList.forEach((art) => {
            const matchesEmail = art.authorEmail && art.authorEmail.toLowerCase().trim() === emailKey;
            const matchesName = user.name && art.authorName && art.authorName.toLowerCase().trim() === user.name.toLowerCase().trim();
            const matchesRushdhi = emailKey.includes("rushdhi") && (art.authorName || "").toLowerCase().includes("rushdhi");

            if (matchesEmail || matchesName || matchesRushdhi) {
              art.authorAvatar = user.avatar;
              if (user.name) art.authorName = user.name;
              updated = true;
            }
          });
          if (updated) {
            localStorage.setItem("dj_writer_submitted_articles", JSON.stringify(articlesList));
            window.dispatchEvent(new Event("dj_articles_updated"));
          }
        } catch (e) {}
      }
    }

    // 7. Dispatch custom profile update event for instant component re-rendering
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("dj_profile_updated", { detail: updatedProfile }));
    }
  } catch (err) {
    console.warn("Failed to persist user profile:", err);
  }
}

/**
 * Retrieves the saved custom profile (name, avatar image, bio, role) for an email address.
 */
export function getUserProfile(email?: string | null): UserProfileData | null {
  if (!email || typeof window === "undefined") return null;
  const emailKey = email.toLowerCase().trim();

  try {
    const existingDbStr = localStorage.getItem("dj_user_profiles_db");
    if (existingDbStr) {
      const profilesDb: Record<string, UserProfileData> = JSON.parse(existingDbStr);
      if (profilesDb[emailKey]) {
        return profilesDb[emailKey];
      }
      
      // Fallback cross-alias lookup for Rushdhi MR
      if (emailKey.includes("rushdhi") || emailKey.includes("writer@digitaljournal.com")) {
        const aliases = ["writer@digitaljournal.com", "rushdhiriyaj2005@gmail.com", "rushdhi", "rushdhi-mr"];
        for (const alias of aliases) {
          if (profilesDb[alias]) return profilesDb[alias];
        }
      }
    }

    // Check registered users list
    const regStr = localStorage.getItem("dj_registered_users");
    if (regStr) {
      const regList: any[] = JSON.parse(regStr);
      const found = regList.find((u) => u.email && u.email.toLowerCase().trim() === emailKey);
      if (found) {
        return found;
      }
    }
  } catch (err) {
    console.warn("Failed to retrieve user profile:", err);
  }

  return null;
}

/**
 * Resolves the real profile avatar image for an author by name or email across all profile stores.
 */
export function getAuthorAvatarByNameOrEmail(name?: string, email?: string): string | null {
  if (typeof window === "undefined") return null;

  const cleanName = (name || "").toLowerCase().trim();
  const cleanEmail = (email || "").toLowerCase().trim();

  try {
    // 1. Check central profiles DB
    const existingDbStr = localStorage.getItem("dj_user_profiles_db");
    if (existingDbStr) {
      const profilesDb: Record<string, UserProfileData> = JSON.parse(existingDbStr);
      // Check direct email key
      if (cleanEmail && profilesDb[cleanEmail]?.avatar && profilesDb[cleanEmail].avatar!.length > 5 && !profilesDb[cleanEmail].avatar!.includes("cart")) {
        return profilesDb[cleanEmail].avatar!;
      }
      // Check all profile entries by name or email
      for (const p of Object.values(profilesDb)) {
        if (!p || !p.avatar || p.avatar.length <= 5 || p.avatar.includes("cart")) continue;
        const pName = (p.name || "").toLowerCase().trim();
        const pEmail = (p.email || "").toLowerCase().trim();
        if (cleanEmail && pEmail === cleanEmail) return p.avatar;
        if (cleanName && (pName === cleanName || pName.includes(cleanName) || cleanName.includes(pName))) return p.avatar;
        if (cleanName.includes("rushdhi") && (pName.includes("rushdhi") || pEmail.includes("rushdhi"))) return p.avatar;
      }
    }

    // 2. Check active user profile
    const activeProfStr = localStorage.getItem("dj_user_profile");
    if (activeProfStr) {
      const activeProf: UserProfileData = JSON.parse(activeProfStr);
      if (activeProf.avatar && activeProf.avatar.length > 5 && !activeProf.avatar.includes("cart")) {
        const pName = (activeProf.name || "").toLowerCase().trim();
        const pEmail = (activeProf.email || "").toLowerCase().trim();
        if ((cleanEmail && pEmail === cleanEmail) || (cleanName && (pName === cleanName || pName.includes(cleanName) || cleanName.includes(pName)))) {
          return activeProf.avatar;
        }
        if (cleanName.includes("rushdhi") && (pName.includes("rushdhi") || pEmail.includes("rushdhi"))) {
          return activeProf.avatar;
        }
      }
    }

    // 3. Check active session user objects
    for (const key of ["dj_user", "dj_writer_user"]) {
      const userStr = localStorage.getItem(key);
      if (userStr) {
        const userObj = JSON.parse(userStr);
        if (userObj.avatar && userObj.avatar.length > 5 && !userObj.avatar.includes("cart")) {
          const uName = (userObj.name || "").toLowerCase().trim();
          const uEmail = (userObj.email || "").toLowerCase().trim();
          if ((cleanEmail && uEmail === cleanEmail) || (cleanName && (uName === cleanName || uName.includes(cleanName) || cleanName.includes(uName)))) {
            return userObj.avatar;
          }
          if (cleanName.includes("rushdhi") && (uName.includes("rushdhi") || uEmail.includes("rushdhi"))) {
            return userObj.avatar;
          }
        }
      }
    }

    // 4. Check registered users list
    const regStr = localStorage.getItem("dj_registered_users");
    if (regStr) {
      const regList: any[] = JSON.parse(regStr);
      for (const u of regList) {
        if (!u || !u.avatar || u.avatar.length <= 5) continue;
        const uName = (u.name || "").toLowerCase().trim();
        const uEmail = (u.email || "").toLowerCase().trim();
        if (cleanEmail && uEmail === cleanEmail) return u.avatar;
        if (cleanName && (uName === cleanName || uName.includes(cleanName) || cleanName.includes(uName))) return u.avatar;
        if (cleanName.includes("rushdhi") && (uName.includes("rushdhi") || uEmail.includes("rushdhi"))) return u.avatar;
      }
    }
  } catch (err) {
    console.warn("Failed to get author avatar by name/email:", err);
  }

  return null;
}

/**
 * Checks whether an email address is already registered to ensure strict 1 user per email.
 */
export function isEmailAlreadyRegistered(email?: string | null): { exists: boolean; role?: string; user?: any } {
  if (!email) return { exists: false };
  const target = email.toLowerCase().trim();

  try {
    // 1. Check central profiles DB
    const existingDbStr = typeof window !== "undefined" ? localStorage.getItem("dj_user_profiles_db") : null;
    if (existingDbStr) {
      const profilesDb: Record<string, UserProfileData> = JSON.parse(existingDbStr);
      if (profilesDb[target]) {
        return { exists: true, role: profilesDb[target].role, user: profilesDb[target] };
      }
    }

    // 2. Check registered users list
    const regStr = typeof window !== "undefined" ? localStorage.getItem("dj_registered_users") : null;
    if (regStr) {
      const regList: any[] = JSON.parse(regStr);
      const found = regList.find((u) => u.email && u.email.toLowerCase().trim() === target);
      if (found) {
        return { exists: true, role: found.role, user: found };
      }
    }

    // 3. Check writers list
    const writerStr = typeof window !== "undefined" ? localStorage.getItem("dj_writers_list") : null;
    if (writerStr) {
      const writerList: any[] = JSON.parse(writerStr);
      const found = writerList.find((w) => w.email && w.email.toLowerCase().trim() === target);
      if (found) {
        return { exists: true, role: "Writer", user: found };
      }
    }

    // 4. Check co-admins list
    const coStr = typeof window !== "undefined" ? localStorage.getItem("dj_co_admins_list") : null;
    if (coStr) {
      const coList: any[] = JSON.parse(coStr);
      const found = coList.find((c) => c.email && c.email.toLowerCase().trim() === target);
      if (found) {
        return { exists: true, role: "Co-Admin", user: found };
      }
    }
  } catch (err) {
    console.warn("Failed to check duplicate email:", err);
  }

  return { exists: false };
}
