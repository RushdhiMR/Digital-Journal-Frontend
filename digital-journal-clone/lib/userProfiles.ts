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
    
    profilesDb[emailKey] = {
      ...profilesDb[emailKey],
      ...user,
      email: emailKey
    };

    localStorage.setItem("dj_user_profiles_db", JSON.stringify(profilesDb));

    // 2. Update active sessions
    localStorage.setItem("dj_user", JSON.stringify(profilesDb[emailKey]));
    if (user.role === "Writer") {
      localStorage.setItem("dj_writer_user", JSON.stringify(profilesDb[emailKey]));
    }
    if (user.role === "Admin" || user.role === "Co-Admin") {
      localStorage.setItem("dj_admin_user", JSON.stringify(profilesDb[emailKey]));
    }

    // 3. Update registered users list if present
    const regStr = localStorage.getItem("dj_registered_users");
    if (regStr) {
      const regList: any[] = JSON.parse(regStr);
      const idx = regList.findIndex((u) => u.email && u.email.toLowerCase().trim() === emailKey);
      if (idx !== -1) {
        regList[idx] = { ...regList[idx], ...user };
      } else {
        regList.push(profilesDb[emailKey]);
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
  } catch (err) {
    console.warn("Failed to persist user profile:", err);
  }
}

/**
 * Retrieves the saved custom profile (name, avatar image, bio, role) for an email address.
 */
export function getUserProfile(email?: string | null): UserProfileData | null {
  if (!email) return null;
  const emailKey = email.toLowerCase().trim();

  try {
    // Check central profiles db
    const existingDbStr = localStorage.getItem("dj_user_profiles_db");
    if (existingDbStr) {
      const profilesDb: Record<string, UserProfileData> = JSON.parse(existingDbStr);
      if (profilesDb[emailKey]) {
        return profilesDb[emailKey];
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
