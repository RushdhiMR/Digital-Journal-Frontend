import CategoryPageLayout from '@/components/CategoryPageLayout';

export default function EventsPage() {
  const featured = {
    category: "CONFERENCES & MEETUPS • NETWORK SCHEDULING",
    title: "Global developer summits announce main tracks",
    description: "Annual engineering forums set agendas for upcoming hybrid tracks, prioritizing artificial intelligence ethics and secure supply chains.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop",
    author: "Chris Hogg",
    date: "1 day ago"
  };

  const secondaryArticles = [
    {
      title: "Annual Global Tech Conference announces keynote speakers line-up",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=150&h=150&fit=crop",
      date: "July 18, 2026"
    },
    {
      title: "Developer summit sets new attendance record for virtual tracks",
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=150&h=150&fit=crop",
      date: "July 17, 2026"
    },
    {
      title: "Decentralized hackathon opens registrations for worldwide teams",
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=150&h=150&fit=crop",
      date: "July 16, 2026"
    },
    {
      title: "Clean Energy Forum releases final whitepaper from workshops",
      image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=150&h=150&fit=crop",
      date: "July 15, 2026"
    }
  ];

  const guides = [
    {
      title: "How to host engaging virtual conferences for global audiences",
      description: "Hosting virtual events requires the right stack. We compare low-latency video streaming, slides syncing, and chat moderation tools...",
      author: "By Jennifer Abbott • July 15, 2026"
    },
    {
      title: "The ultimate guide to running successful community hackathons",
      description: "Hackathons are great for team building. Learn how to structure challenges, gather sponsors, select judges, and award prizes...",
      author: "By Jane Smith • July 15, 2026"
    },
    {
      title: "Best tools for managing multi-track schedules and speaker bureaus",
      description: "Managing speakers and timetables can get messy. Discover schedule automation tools that keep speaker bios and tracks up to date...",
      author: "By Sarah Miller • July 15, 2026"
    },
    {
      title: "How to design interactive workshops that maximize participant engagement",
      description: "Passive webinars are fading. Discover gamification techniques, breakout room splits, and live polling widgets that keep participants active...",
      author: "By Jennifer Abbott • July 15, 2026"
    }
  ];

  const newsArticles = [
    {
      title: "AI Ethics Panel brings together global industry policy leaders",
      description: "Major software giants align keynotes on quantum computing architectures and secure automated pipelines.",
      date: "By Chris Hogg • 1 day ago",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=220&h=150&fit=crop"
    },
    {
      title: "Open Source Summit highlights security in containerized builds",
      description: "Over 50,000 developers register online to follow deep learning model pruning and continuous deployment tracks.",
      date: "By Agil Riaz • 2 days ago",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=220&h=150&fit=crop"
    },
    {
      title: "Quantum Computing Symposium sets date for international keynotes",
      description: "Teams compete for $100k in prizes building open-source database scaling models and secure developer telemetry.",
      date: "By Jessica Lee • 3 days ago",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=220&h=150&fit=crop"
    },
    {
      title: "Industrial automation roundtable scheduled for next quarter",
      description: "Manufacturing leaders prepare panels on edge telemetry and smart energy grid logistics.",
      date: "By Pramod Asu • 4 days ago",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=220&h=150&fit=crop"
    }
  ];

  return (
    <CategoryPageLayout
      categoryName="Events"
      categoryColor="bg-[#C6F7E9]"
      infoBoxText={`Events tracks developer summits, international forums, online webinars, and community tech meetups that shape the technology space.\n\nWe cover scheduling details, speaker line-ups, ticket registrations, and recap keynotes from around the world to keep you connected.`}
      featured={featured}
      secondaryArticles={secondaryArticles}
      guidesTitle="Events Guides"
      guidesDescription="Background context and practical insights on challenging topics and what to do about it."
      guides={guides}
      newsTitle="Events News"
      newsDescription="Everything happening now that you need to know to find new ideas."
      newsArticles={newsArticles}
    />
  );
}
