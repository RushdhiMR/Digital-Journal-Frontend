import CategoryPageLayout from '@/components/CategoryPageLayout';

export default function InnovationPage() {
  const featured = {
    category: "STARTUPS & VENTURE • TECH & BUSINESS FUTURE",
    title: "Startup funds AI — and a better future",
    description: "Venture capital funding and corporate investments continue to flow into automated pipelines, backing developers and system architects.",
    image: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=1200&h=800&fit=crop",
    author: "Sarah Mitchell",
    date: "3 hours ago"
  };

  const secondaryArticles = [
    {
      title: "Quantum encryption labs test satellite-to-ground key distribution",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop",
      date: "July 16, 2026"
    },
    {
      title: "Bio-inspired neural chips cut robotic computing power requirements by 80%",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=150&h=150&fit=crop",
      date: "July 15, 2026"
    },
    {
      title: "Next-gen solid state batteries enter pilot production for electric aviation",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=150&h=150&fit=crop",
      date: "July 14, 2026"
    },
    {
      title: "Open-source foundation releases unified framework for edge AI models",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=150&h=150&fit=crop",
      date: "July 14, 2026"
    }
  ];

  const guides = [
    {
      title: "Your complete guide to sparking innovation in a digital age",
      description: "Remember when setting up custom modules was the norm? Today, developers rely on unified frameworks...",
      author: "By Jennifer Abbott • July 15, 2026"
    },
    {
      title: "The urgent manual to successful innovation: standard setup or hybrid custom",
      description: "Successful innovation is not a one-size-fits-all. Organizations must choose between standardized modules...",
      author: "By Jane Smith • July 15, 2026"
    },
    {
      title: "Want to keep customers at the heart of your innovation project?",
      description: "How do you build a product that is not only functional but also loved by users? Focus on the feedback...",
      author: "By Sarah Miller • July 15, 2026"
    },
    {
      title: "You can't execute successfully without the right company culture and mindset",
      description: "Testing and building frameworks is easy compared to alignment. Mindset determines which projects scale...",
      author: "By Jennifer Abbott • July 15, 2026"
    }
  ];

  const newsArticles = [
    {
      title: "Op-Ed: Rethinking humanity as automation rewrites human realities",
      description: "Automation is not just about replacing jobs; it's about redefining what it means to be human and finding focus areas that leverage empathy and critical oversight.",
      date: "By Sarah Miller • 8 hours ago",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=220&h=150&fit=crop"
    },
    {
      title: "'Indispensable' Xiaohongshu app fuels a Chinese tourism boom",
      description: "The social and e-commerce app has become the go-to guide for Chinese tourists planning overseas trips and discovering local hubs.",
      date: "By David Chen • 12 hours ago",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=220&h=150&fit=crop"
    },
    {
      title: "Growing list of countries move to ban social media for children",
      description: "The UK is considering joining a growing list of nations enacting strict bans on social media usage for minors due to mental health concerns.",
      date: "By Sarah Mitchell • 14 hours ago",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=220&h=150&fit=crop"
    },
    {
      title: "Op-Ed: Canada rewrites the rules on AI privacy with Bill C-27, and this is just the start",
      description: "With commitment to protecting digital rights, Bill C-27 may well become a benchmark for AI regulations and compliance audits globally.",
      date: "By Pramod Asu • 18 hours ago",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=220&h=150&fit=crop"
    }
  ];

  return (
    <CategoryPageLayout
      categoryName="Innovation"
      categoryColor="bg-[#BEEDF7]"
      infoBoxText={`We've lived standard logic today, that new ideas should play out custom to context of the financial and environments. Today, this technology integration, adoption, processes being redesigned across business domains continue to capture the logic of doing business.\n\nWhat state leaders will do to capture database notes, transactions, structures, and compile organizations' histories to data when compiling such systems.`}
      featured={featured}
      secondaryArticles={secondaryArticles}
      guidesTitle="Innovation Guides"
      guidesDescription="Background context and practical insights on challenging topics and what to do about it."
      guides={guides}
      newsTitle="Innovation News"
      newsDescription="Everything happening now that you need to know to find new ideas."
      newsArticles={newsArticles}
    />
  );
}
