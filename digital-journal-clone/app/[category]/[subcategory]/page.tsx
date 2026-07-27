import CategoryPageLayout from '@/components/CategoryPageLayout';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsletterBanner from '@/components/NewsletterBanner';
import NewsletterFormCard from '@/components/NewsletterFormCard';
import FastStartNewsletterBanner from '@/components/FastStartNewsletterBanner';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

const parentConfig: Record<string, { name: string; color: string; desc: string }> = {
  "news": {
    name: "News",
    color: "bg-[#FFE552]",
    desc: "brings you global stories and regulatory policy revisions."
  },
  "business": {
    name: "Business",
    color: "bg-[#FFE9D6]",
    desc: "covers corporations, startups, leadership dynamics, and entrepreneurship."
  },
  "industry-insights": {
    name: "Industry Insights",
    color: "bg-[#E2F0D9]",
    desc: "dives into business trends, logistical advancements, and operational metrics."
  },
  "technology": {
    name: "Technology",
    color: "bg-[#BEEDF7]",
    desc: "explores hardware, software, and systems engineering."
  },
  "innovation": {
    name: "Innovation",
    color: "bg-[#BEEDF7]",
    desc: "focuses on finding new ideas, design thinking, and startup pivots."
  },
  "events": {
    name: "Events",
    color: "bg-[#C6F7E9]",
    desc: "tracks developer summits and forum schedules."
  }
};

function formatSubcategory(str: string) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatSentenceCase(str: string) {
  const raw = str.split("-").join(" ");
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

const knownNewsArticles: Record<string, string> = {
  "airbus-puts-a-price-on-canadian-jet-fuel-security": "Airbus puts a price on Canadian jet fuel security",
  "venture-capital-firms-shift-focus-to-sustainable-tech-sector-pipelines": "Venture capital firms shift focus to sustainable tech sector pipelines",
  "how-remote-leadership-models-are-evolving-to-meet-product-goals": "How remote leadership models are evolving to meet product goals",
  "global-logistics-platforms-integrate-machine-learning-for-routing": "Global logistics platforms integrate machine learning for routing",
  "e-commerce-platforms-scale-up-localized-transaction-nodes": "E-commerce platforms scale up localized transaction nodes",
  "why-corporate-investment-in-developer-experience-yields-positive-roi": "Why corporate investment in developer experience yields positive ROI",
  "international-data-privacy-standards-updated-after-cross-border-audits": "International data privacy standards updated after cross-border audits",
  "scientific-research-consortium-publishes-open-access-genome-study": "Scientific research consortium publishes open-access genome study",
  "urban-infrastructure-plans-integrate-smart-power-grids-in-major-cities": "Urban infrastructure plans integrate smart power grids in major cities",
  "public-transportation-systems-roll-out-unified-digital-ticketing": "Public transportation systems roll out unified digital ticketing",
  "education-systems-adapt-curricula-to-include-basic-ai-literacy": "Education systems adapt curricula to include basic AI literacy",
  "canadas-conexiom-bets-that-the-future-of-ai-lies-in-automation-not-experimentation": "Canada's Conexiom bets that the future of AI lies in automation, not experimentation",
  "lightworks-scotiabank-sun-life-and-telus-launch-ai-consortium": "Lightworks, Scotiabank, Sun Life and TELUS launch AI Consortium",
  "canadas-ai-adoption-problem-meets-its-youth-employment-problem": "Canada's AI adoption problem meets its youth employment problem",
  "op-ed-rethinking-humanity-as-automation-rewrites-human-realities": "Op-Ed: Rethinking humanity as automation rewrites human realities",
  "indispensable-xiaohongshu-app-fuels-chinese-tourism": "‘Indispensable’ Xiaohongshu app fuels Chinese tourism",
  "silicon-valley-chip-manufacturers-announce-breakthrough-architectural-updates": "Silicon Valley chip manufacturers announce breakthrough architectural updates",
  "new-quantum-computing-clusters-open-to-public-cloud-developer-preview": "New quantum computing clusters open to public cloud developer preview",
  "open-source-database-platform-raises-record-funding-round-for-scaling": "Open-source database platform raises record funding round for scaling",
  "how-edge-computing-is-transforming-real-time-telemetry-processing": "How edge computing is transforming real-time telemetry processing",
  "cybersecurity-protocols-updated-globally-to-counter-multi-vector-threats": "Cybersecurity protocols updated globally to counter multi-vector threats"
};

function formatTitleFromSlug(slug: string): string {
  if (knownNewsArticles[slug]) return knownNewsArticles[slug];
  const words = slug.split("-");
  if (words.length === 0) return slug;
  return words
    .map((w, i) => {
      if (i === 0) return w.charAt(0).toUpperCase() + w.slice(1);
      const lower = w.toLowerCase();
      if (["ai", "roi", "kpi", "kpis", "smbc", "max"].includes(lower)) return w.toUpperCase();
      return w;
    })
    .join(" ");
}

const customNewsDatabase: Record<string, {
  title: string;
  authorName: string;
  authorAvatar: string;
  authorBio: string;
  date: string;
  image: string;
  caption: string;
  sections: { heading: string; paragraphs: string[] }[];
}> = {
  "airbus-puts-a-price-on-canadian-jet-fuel-security": {
    title: "Airbus puts a price on Canadian jet fuel security",
    authorName: "Jennifer Friesen",
    authorAvatar: "/author_woman.jpg",
    authorBio: "Jennifer Friesen is Digital Journal's associate editor and Calgary Bureau lead.",
    date: "July 22, 2026 6:08 PM EDT",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1200&h=750&fit=crop",
    caption: "AF truck at Airbus Canada. — Photo courtesy of Airbus",
    sections: [
      {
        heading: "",
        paragraphs: [
          "Airbus has signaled a strategic focus on Canadian jet fuel supply pipelines, evaluating sustainable aviation fuel (SAF) procurement and local infrastructure reliability.",
          "Aerospace analysts note that establishing secure, regional fuel supply chains is critical for mitigating volatility and supporting long-term decarbonization goals."
        ]
      },
      {
        heading: "Infrastructure & Energy Compliance",
        paragraphs: [
          "The initiative comes as Canadian aviation authorities push for increased domestic production of low-carbon aviation fuels.",
          "Industry stakeholders are coordinating with federal energy regulators to ensure supply security across major hubs in Montreal and Toronto."
        ]
      }
    ]
  },
  "venture-capital-firms-shift-focus-to-sustainable-tech-sector-pipelines": {
    title: "Venture capital firms shift focus to sustainable tech sector pipelines",
    authorName: "Jennifer Friesen",
    authorAvatar: "/author_woman.jpg",
    authorBio: "Jennifer Friesen is Digital Journal's associate editor and Calgary Bureau lead.",
    date: "July 22, 2026 4:30 PM EDT",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=750&fit=crop",
    caption: "Venture capital partners evaluate sustainable infrastructure portfolios. (AFP/File)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "Venture capital firms across North America are pivoting investment thesis parameters toward green computing and clean technology hardware pipelines.",
          "Recent funding allocations indicate a 35% growth in seed-stage backing for energy-efficient data processing architectures."
        ]
      },
      {
        heading: "Capital Allocation Shifts",
        paragraphs: [
          "Investors are prioritizing startups demonstrating verifiable carbon offset metrics and low-power silicon design.",
          "Institutional partners emphasize that long-term returns will be driven by operational compliance with international environmental standards."
        ]
      },
      {
        heading: "Sustainable Market Outlook",
        paragraphs: [
          "Emerging funds in Toronto, Vancouver, and Silicon Valley are establishing dedicated pools for sustainable software optimization tools."
        ]
      }
    ]
  },
  "how-remote-leadership-models-are-evolving-to-meet-product-goals": {
    title: "How remote leadership models are evolving to meet product goals",
    authorName: "Jennifer Friesen",
    authorAvatar: "/author_woman.jpg",
    authorBio: "Jennifer Friesen is Digital Journal's associate editor and Calgary Bureau lead.",
    date: "July 21, 2026 2:15 PM EDT",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=750&fit=crop",
    caption: "Distributed engineering teams synchronize async product roadmaps. (Photo courtesy of Digital Journal)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "Engineering leads and executive directors are overhauling synchronous management paradigms in favor of outcome-driven asynchronous workflows.",
          "By shifting focus from active hours to milestone velocity, distributed technology organizations report higher retention and accelerated delivery cycles."
        ]
      },
      {
        heading: "Asynchronous Coordination & Governance",
        paragraphs: [
          "Modern product teams rely on standardized architecture decision records (ADRs) and automated pull-request validation pipelines.",
          "Leadership teams conduct quarterly sync summits while maintaining day-to-day operations across multiple time zones."
        ]
      },
      {
        heading: "Impact on Product Delivery Velocity",
        paragraphs: [
          "Early data shows a 20% reduction in meeting overhead, allowing developers to dedicate uninterrupted blocks to complex problem-solving."
        ]
      }
    ]
  },
  "global-logistics-platforms-integrate-machine-learning-for-routing": {
    title: "Global logistics platforms integrate machine learning for routing",
    authorName: "Pramod Jain",
    authorAvatar: "/author_bluesuit.jpg",
    authorBio: "Pramod Jain reports on global supply chains, logistics telemetry, and enterprise cloud migrations.",
    date: "July 20, 2026 11:45 AM EDT",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=750&fit=crop",
    caption: "Automated distribution nodes optimize real-time transit routing schedules. (AFP/File)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "Freight operators and global supply chain hubs have begun deploying predictive machine learning algorithms to dynamically reroute cargo shipments.",
          "The automated routing engines analyze weather anomalies, port congestion indices, and fuel pricing fluctuations in real time."
        ]
      },
      {
        heading: "Real-Time Telemetry & Tracking",
        paragraphs: [
          "Logistics hubs report an 18% improvement in delivery timeline precision following the integration of edge sensor telemetry.",
          "Shipping dispatchers can now dynamically reassign regional freight containers prior to port arrival."
        ]
      }
    ]
  },
  "e-commerce-platforms-scale-up-localized-transaction-nodes": {
    title: "E-commerce platforms scale up localized transaction nodes",
    authorName: "Chris Hogg",
    authorAvatar: "/author_beard.jpg",
    authorBio: "Chris Hogg is an executive editor specializing in digital transformation and financial technology.",
    date: "July 19, 2026 6:10 PM EDT",
    image: "https://images.unsplash.com/photo-1556742049-0a670c480728?w=1200&h=750&fit=crop",
    caption: "Micro-fulfilment centers leverage localized payment processing microservices. (AFP/File)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "Major e-commerce platforms are deploying regional transaction processing nodes to reduce latency and satisfy sovereign data localization laws.",
          "By handling payment verification at edge points close to consumers, checkout speeds have improved by over 40%."
        ]
      },
      {
        heading: "Edge Infrastructure & Financial Compliance",
        paragraphs: [
          "Localized transaction clusters allow merchants to process regional currency settlements without routing packets through centralized international servers.",
          "Security teams note that decentralized nodes decrease exposure to single-point distributed denial-of-service (DDoS) outages."
        ]
      }
    ]
  },
  "why-corporate-investment-in-developer-experience-yields-positive-roi": {
    title: "Why corporate investment in developer experience yields positive ROI",
    authorName: "David Potter",
    authorAvatar: "/author_bluesuit.jpg",
    authorBio: "David Potter focuses on software architecture, DevOps tooling, and developer metrics.",
    date: "July 18, 2026 10:20 AM EDT",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=750&fit=crop",
    caption: "Internal developer platforms streamline software deployment pipelines. (AFP/File)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "Enterprise technology firms investing in dedicated Developer Experience (DevEx) teams report marked improvements in code release frequency and employee retention.",
          "Reducing cognitive load and eliminating internal tool friction directly correlates with faster product iterations."
        ]
      },
      {
        heading: "Quantifying Platform Engineering Returns",
        paragraphs: [
          "Organizations implementing self-service internal developer portals have cut onboarding times for new engineers from months to days.",
          "Automated testing environments and standardized CI/CD pipelines significantly lower post-release defect rates."
        ]
      }
    ]
  },
  "international-data-privacy-standards-updated-after-cross-border-audits": {
    title: "International data privacy standards updated after cross-border audits",
    authorName: "Jennifer Friesen",
    authorAvatar: "/author_woman.jpg",
    authorBio: "Jennifer Friesen is Digital Journal's associate editor and Calgary Bureau lead.",
    date: "July 22, 2026 9:15 AM EDT",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=750&fit=crop",
    caption: "Privacy regulators review compliance frameworks for international cloud transfers. (AFP/File)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "Global regulatory authorities have published revised data protection compliance benchmarks following a multi-nation audit of cloud infrastructure providers.",
          "The new framework enforces stricter data residency protocols and mandates transparent encryption key management for cross-border operations."
        ]
      },
      {
        heading: "Audit Findings & Policy Frameworks",
        paragraphs: [
          "Inspectors identified systemic gaps in third-party vendor access controls, prompting mandatory annual security reviews.",
          "Enterprise software providers must provide verifiable audit logs confirming data segregation across international data centers."
        ]
      }
    ]
  },
  "scientific-research-consortium-publishes-open-access-genome-study": {
    title: "Scientific research consortium publishes open-access genome study",
    authorName: "April Hicke",
    authorAvatar: "/author_glasses.jpg",
    authorBio: "April Hicke reports on biotechnology, scientific research, and open science initiatives.",
    date: "July 21, 2026 3:40 PM EDT",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&h=750&fit=crop",
    caption: "Biomedical researchers analyze high-throughput genomic data sequences. (AFP/File)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "An international coalition of biomedical research institutions has released a comprehensive, open-access genomic database to accelerate therapeutic development.",
          "The dataset includes over 500,000 sequenced samples, providing researchers worldwide with unprecedented insight into rare genetic variations."
        ]
      },
      {
        heading: "Open Science & Therapeutics Development",
        paragraphs: [
          "By removing paywalls and proprietary licensing restrictions, the consortium aims to democratize medical research and shorten drug discovery timelines."
        ]
      }
    ]
  },
  "urban-infrastructure-plans-integrate-smart-power-grids-in-major-cities": {
    title: "Urban infrastructure plans integrate smart power grids in major cities",
    authorName: "Pramod Jain",
    authorAvatar: "/author_bluesuit.jpg",
    authorBio: "Pramod Jain reports on global supply chains, smart infrastructure, and energy grids.",
    date: "July 20, 2026 1:30 PM EDT",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=750&fit=crop",
    caption: "Smart power monitoring nodes monitor energy distribution across metropolitan sectors. (AFP/File)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "Metropolitan utility boards are upgrading municipal electrical grids with IoT sensor networks to balance load distribution during peak demand periods.",
          "The smart grid infrastructure automatically detects line faults, isolating localized outages and preventing cascading blackouts."
        ]
      }
    ]
  },
  "public-transportation-systems-roll-out-unified-digital-ticketing": {
    title: "Public transportation systems roll out unified digital ticketing",
    authorName: "Jennifer Lussier",
    authorAvatar: "/author_woman.jpg",
    authorBio: "Jennifer Lussier covers urban mobility, public sector technology, and smart transit.",
    date: "July 19, 2026 11:00 AM EDT",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&h=750&fit=crop",
    caption: "Transit commuters use contact-free digital passes across regional rail networks. (AFP/File)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "Transit agencies across major urban corridors have implemented a single contactless ticketing system across subways, buses, and commuter rail.",
          "The unified payment backend allows riders to tap credit cards or mobile wallets without purchasing physical transit cards."
        ]
      }
    ]
  },
  "education-systems-adapt-curricula-to-include-basic-ai-literacy": {
    title: "Education systems adapt curricula to include basic AI literacy",
    authorName: "Chris Hogg",
    authorAvatar: "/author_beard.jpg",
    authorBio: "Chris Hogg is an executive editor specializing in digital transformation and education policy.",
    date: "July 18, 2026 4:15 PM EDT",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=750&fit=crop",
    caption: "High school students engage in practical data privacy and algorithm modules. (AFP/File)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "School boards are introducing mandatory digital literacy and artificial intelligence fundamentals into secondary school coursework.",
          "Students learn data ethics, algorithmic bias evaluation, and responsible prompt design alongside foundational computer science concepts."
        ]
      }
    ]
  },
  "canadas-conexiom-bets-that-the-future-of-ai-lies-in-automation-not-experimentation": {
    title: "Canada's Conexiom bets that the future of AI lies in automation, not experimentation",
    authorName: "Jennifer Friesen",
    authorAvatar: "/author_woman.jpg",
    authorBio: "Jennifer Friesen is Digital Journal's associate editor and Calgary Bureau lead.",
    date: "July 22, 2026 8:00 AM EDT",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=750&fit=crop",
    caption: "Conexiom executive leadership outlines enterprise automation strategy. (AFP/File)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "Canadian tech pioneer Conexiom is doubling down on operational workflow automation, arguing that enterprises need deterministic efficiency rather than experimental chatbots.",
          "The company's document processing platform automates complex trade transactions for global distributors with 100% data accuracy."
        ]
      }
    ]
  },
  "lightworks-scotiabank-sun-life-and-telus-launch-ai-consortium": {
    title: "Lightworks, Scotiabank, Sun Life and TELUS launch AI Consortium",
    authorName: "Pramod Jain",
    authorAvatar: "/author_bluesuit.jpg",
    authorBio: "Pramod Jain reports on global supply chains, corporate partnerships, and AI alliances.",
    date: "July 21, 2026 10:45 AM EDT",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=750&fit=crop",
    caption: "Consortium founding partners announce Canadian AI research alliance. (AFP/File)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "Four of Canada's leading corporate institutions have partnered to create a national AI research consortium focused on commercial deployment and ethical governance.",
          "The alliance aims to pool engineering resources, fund university research labs, and keep Canadian AI talent within domestic tech ecosystems."
        ]
      }
    ]
  },
  "canadas-ai-adoption-problem-meets-its-youth-employment-problem": {
    title: "Canada's AI adoption problem meets its youth employment problem",
    authorName: "April Hicke",
    authorAvatar: "/author_glasses.jpg",
    authorBio: "April Hicke reports on technology adoption, workforce development, and economic policy.",
    date: "July 20, 2026 5:50 PM EDT",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&h=750&fit=crop",
    caption: "Young technology graduates analyze market entry barriers in domestic tech sectors. (AFP/File)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "Economists warn that slow corporate AI adoption in traditional sectors is compounding entry-level job shortages for recent STEM graduates.",
          "Policy experts recommend government incentives to encourage mid-market companies to hire junior developers to drive digital modernization."
        ]
      }
    ]
  },
  "op-ed-rethinking-humanity-as-automation-rewrites-human-realities": {
    title: "Op-Ed: Rethinking humanity as automation rewrites human realities",
    authorName: "Chris Hogg",
    authorAvatar: "/author_beard.jpg",
    authorBio: "Chris Hogg is an executive editor specializing in digital transformation and technology ethics.",
    date: "July 19, 2026 1:15 PM EDT",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&h=750&fit=crop",
    caption: "Thought leaders examine ethical boundaries of pervasive automation. (AFP/File)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "As automated decision engines assume control over credit scores, medical triage, and job screening, society must redefine the boundaries of human agency.",
          "Building technology that augments rather than replaces human empathy is the defining intellectual challenge of our era."
        ]
      }
    ]
  },
  "indispensable-xiaohongshu-app-fuels-chinese-tourism": {
    title: "‘Indispensable’ Xiaohongshu app fuels Chinese tourism",
    authorName: "Jennifer Lussier",
    authorAvatar: "/author_woman.jpg",
    authorBio: "Jennifer Lussier covers global travel trends, social platforms, and digital tourism.",
    date: "July 18, 2026 7:30 AM EDT",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&h=750&fit=crop",
    caption: "Tourists use social discovery platform Xiaohongshu for travel recommendations. (AFP/File)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "Social commerce platform Xiaohongshu (RED) has become the primary search engine for outbound Chinese travelers seeking niche cultural experiences.",
          "Canadian tourism boards are launching dedicated Xiaohongshu storefronts to connect directly with independent international visitors."
        ]
      }
    ]
  },
  "silicon-valley-chip-manufacturers-announce-breakthrough-architectural-updates": {
    title: "Silicon Valley chip manufacturers announce breakthrough architectural updates",
    authorName: "David Potter",
    authorAvatar: "/author_bluesuit.jpg",
    authorBio: "David Potter focuses on hardware architecture, semiconductor manufacturing, and chip design.",
    date: "July 22, 2026 11:20 AM EDT",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=750&fit=crop",
    caption: "Semiconductor wafer design features 2nm gate-all-around transistor architecture. (AFP/File)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "Leading semiconductor foundries have unveiled 2-nanometer ribbon field-effect transistor architectures, promising a 30% reduction in chip power consumption.",
          "The breakthrough allows mobile devices and edge data centers to process complex AI inference workloads with significantly lower thermal output."
        ]
      }
    ]
  },
  "new-quantum-computing-clusters-open-to-public-cloud-developer-preview": {
    title: "New quantum computing clusters open to public cloud developer preview",
    authorName: "April Hicke",
    authorAvatar: "/author_glasses.jpg",
    authorBio: "April Hicke reports on quantum computing, cloud architecture, and experimental software.",
    date: "July 21, 2026 9:00 AM EDT",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=750&fit=crop",
    caption: "Cryogenic quantum processor rig connected to cloud developer preview network. (AFP/File)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "Cloud providers have launched public developer previews for 1,000+ qubit superconducting quantum processing clusters.",
          "Software engineers can now run hybrid quantum-classical algorithms for materials science, cryptography stress testing, and molecular modeling."
        ]
      }
    ]
  },
  "open-source-database-platform-raises-record-funding-round-for-scaling": {
    title: "Open-source database platform raises record funding round for scaling",
    authorName: "David Potter",
    authorAvatar: "/author_bluesuit.jpg",
    authorBio: "David Potter focuses on software architecture, open-source platforms, and database engineering.",
    date: "July 20, 2026 2:45 PM EDT",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&h=750&fit=crop",
    caption: "Open-source database maintainers celebrate Series C funding milestone. (AFP/File)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "A distributed SQL database startup has secured $120 million in Series C funding to expand enterprise support and cloud-managed database services.",
          "The project has accumulated over 45,000 GitHub stars, becoming the fastest-growing open-source data engine for high-concurrency applications."
        ]
      }
    ]
  },
  "how-edge-computing-is-transforming-real-time-telemetry-processing": {
    title: "How edge computing is transforming real-time telemetry processing",
    authorName: "Pramod Jain",
    authorAvatar: "/author_bluesuit.jpg",
    authorBio: "Pramod Jain reports on enterprise cloud migrations, IoT hardware, and edge computing.",
    date: "July 19, 2026 4:30 PM EDT",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=750&fit=crop",
    caption: "Industrial IoT gateways process telemetry data directly at field sensor sites. (AFP/File)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "Industrial facilities are migrating sensor data analytics from centralized cloud servers to edge processing hardware installed on factory floors.",
          "Filtering telemetry data at the device layer cuts network bandwidth expenses by 70% and enables instant sub-millisecond emergency shutdowns."
        ]
      }
    ]
  },
  "cybersecurity-protocols-updated-globally-to-counter-multi-vector-threats": {
    title: "Cybersecurity protocols updated globally to counter multi-vector threats",
    authorName: "Jennifer Friesen",
    authorAvatar: "/author_woman.jpg",
    authorBio: "Jennifer Friesen is Digital Journal's associate editor and Calgary Bureau lead.",
    date: "July 18, 2026 8:15 AM EDT",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=750&fit=crop",
    caption: "Security Operations Center (SOC) engineers monitor network intrusion alerts. (AFP/File)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "International cybersecurity agencies have issued updated zero-trust defense blueprints to protect critical infrastructure against automated multi-vector cyberattacks.",
          "The guidelines mandate continuous identity verification, micro-segmentation of internal networks, and real-time anomaly detection."
        ]
      }
    ]
  },
  "us-announces-civilian-nuclear-deal-with-saudi-arabia": {
    title: "US announces civilian nuclear deal with Saudi Arabia",
    authorName: "Frank Morgan",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&fit=crop",
    authorBio: "Frank Morgan is Digital Journal's senior political correspondent covering transatlantic diplomacy.",
    date: "July 22, 2026 5:25 PM EDT",
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&h=750&fit=crop",
    caption: "U.S. and international diplomats announce bilateral civilian energy agreement terms. (AFP/File)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "WASHINGTON — The United States and Saudi Arabia have finalized terms for a strategic civilian nuclear cooperation agreement, establishing non-proliferation frameworks and tech exchanges.",
          "The deal permits Saudi Arabia to develop civilian nuclear power infrastructure under strict International Atomic Energy Agency (IAEA) oversight and safety standards."
        ]
      },
      {
        heading: "Bilateral Cooperation & Non-Proliferation Safeguards",
        paragraphs: [
          "State Department officials confirmed that the bilateral accord includes binding non-proliferation protocols, ensuring all enriched material remains monitored.",
          "Energy experts believe the project will diversify Middle Eastern energy production while accelerating clean energy transitions across the region."
        ]
      }
    ]
  },
  "as-canadians-turn-to-ai-for-mortgage-advice-experts-warn-about-privacy-risks": {
    title: "As Canadians turn to AI for mortgage advice, experts warn about privacy risks and inaccurate guidance",
    authorName: "Sarah Miller",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&h=250&fit=crop",
    authorBio: "Sarah Miller covers international data privacy regulations, cross-border compliance, and digital rights.",
    date: "July 22, 2026 5:17 PM EDT",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=750&fit=crop",
    caption: "Canadian homeowners consult digital AI financial advice apps. (Photo courtesy of Digital Journal)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "TORONTO — Financial advisors and consumer privacy advocates warn that generative AI financial chatbots can produce inaccurate rate calculations and mishandle confidential financial data.",
          "A growing number of Canadians are relying on artificial intelligence tools to model mortgage refinancing and interest rate forecasts, prompting regulatory scrutiny."
        ]
      },
      {
        heading: "Data Governance & Consumer Protection Warnings",
        paragraphs: [
          "Financial regulators advise consumers never to upload confidential bank statements or personal identity numbers into unverified public AI models.",
          "Major Canadian financial institutions are rolling out verified, encrypted financial AI assistants to ensure consumer safety and compliance."
        ]
      }
    ]
  },
  "tesla-shares-dip-after-profit-misses-expectations": {
    title: "Tesla shares dip after profit misses expectations",
    authorName: "David Chen",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&h=250&fit=crop",
    authorBio: "David Chen covers market shifts, automotive technology, and enterprise cloud infrastructure.",
    date: "July 22, 2026 5:10 PM EDT",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&h=750&fit=crop",
    caption: "Tesla electric vehicles lined up for delivery. (AFP/File)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "AUSTIN — Tesla stock dropped 4.5% in after-hours trading after quarterly earnings fell short of Wall Street estimates due to price cuts and increased R&D spending on AI and autonomous robotics.",
          "Operating margins narrowed as global EV market competition intensified across North America, Europe, and Asian automotive hubs."
        ]
      },
      {
        heading: "Automotive Margins & AI Capital Investment",
        paragraphs: [
          "Despite short-term profit pressures, executive leadership reiterated full commitment to scaling full self-driving (FSD) chips and next-gen Robotaxi production fleets.",
          "Institutional investors remain focused on long-term software licensing revenue and energy storage segment growth."
        ]
      }
    ]
  },
  "your-ai-made-a-decision-and-canadian-regulators-want-to-know-how": {
    title: "Your AI made a decision, and Canadian regulators want to know how",
    authorName: "Dr. Tim Sandle",
    authorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=250&h=250&fit=crop",
    authorBio: "Dr. Tim Sandle is a London-based science journalist covering biotechnology, AI in healthcare, and digital transformation.",
    date: "July 21, 2026",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=750&fit=crop",
    caption: "Canadian regulatory leads evaluate algorithmic decision auditing protocols. (Photo courtesy of Digital Journal)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "OTTAWA — Canadian regulatory agencies are introducing mandatory transparency audits requiring companies to explain automated decisions in banking, hiring, and insurance.",
          "Under proposed enforcement rules, algorithms impacting consumer credit scores or employment candidates must maintain explainable decision logs."
        ]
      },
      {
        heading: "Algorithmic Transparency & Model Auditing Standards",
        paragraphs: [
          "Compliance officers will evaluate automated models for bias, data lineage, and decision reproducibility.",
          "Tech firms operating in Canada are deploying explainable AI (XAI) frameworks to meet upcoming legislative benchmarks."
        ]
      }
    ]
  },
  "dutch-students-unveil-world-first-solar-powered-ambulance": {
    title: "Dutch students unveil 'world-first' solar-powered ambulance",
    authorName: "April Hicke",
    authorAvatar: "/author_glasses.jpg",
    authorBio: "April Hicke reports on biotechnology, scientific research, and clean tech innovation.",
    date: "July 21, 2026",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&h=750&fit=crop",
    caption: "Dutch engineering team demonstrates solar-powered emergency ambulance prototype. (AFP/File)",
    sections: [
      {
        heading: "",
        paragraphs: [
          "EINDHOVEN — Engineering students from the Netherlands have built a zero-emission emergency response vehicle equipped with rooftop solar panels and lightweight battery cells.",
          "The solar ambulance can generate sufficient daily power to operate medical equipment and extend driving range by up to 120 kilometers."
        ]
      },
      {
        heading: "Clean Mobility & Emergency Response Technology",
        paragraphs: [
          "Medical first responders tested the vehicle during simulated emergency trials in Eindhoven, praising its silent operation and zero direct emissions.",
          "Commercial manufacturers are evaluating the prototype for potential deployment in eco-conscious municipal hospital fleets across Europe."
        ]
      }
    ]
  }
};

const authorAvatarMap: Record<string, { avatar: string; bio: string }> = {
  "April Hicke": {
    avatar: "/author_glasses.jpg",
    bio: "April Hicke reports on biotechnology, scientific research, open science initiatives, and artificial intelligence adoption."
  },
  "Pramod Jain": {
    avatar: "/author_bluesuit.jpg",
    bio: "Pramod Jain reports on global supply chains, logistics telemetry, enterprise cloud migrations, and emerging technology markets."
  },
  "Chris Hogg": {
    avatar: "/author_beard.jpg",
    bio: "Chris Hogg is an executive editor specializing in digital transformation, financial technology, and executive leadership strategies."
  },
  "Jennifer Friesen": {
    avatar: "/author_woman.jpg",
    bio: "Jennifer Friesen is Digital Journal's associate editor and Calgary Bureau lead."
  },
  "Ronda B": {
    avatar: "/author_woman.jpg",
    bio: "Ronda B is a dedicated journalist with a passion for delivering accurate, timely, and impactful news."
  },
  "Dr. Andrew Forde": {
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&h=250&fit=crop",
    bio: "Dr. Andrew Forde writes on technological convergence, machine intelligence, and structural policy frameworks."
  },
  "David Potter": {
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=250&h=250&fit=crop",
    bio: "David Potter focuses on software architecture, DevOps tooling, developer metrics, and infrastructure security."
  }
};

function getTopicMatchingImage(slug: string, title: string): string {
  const lower = (slug + " " + title).toLowerCase();

  if (lower.includes("space") || lower.includes("orbital") || lower.includes("satellite") || lower.includes("spacex") || lower.includes("starship")) {
    return "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=1200&h=750&fit=crop";
  }
  if (lower.includes("meta") || lower.includes("facebook") || lower.includes("instagram") || lower.includes("addictive") || lower.includes("social")) {
    return "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=1200&h=750&fit=crop";
  }
  if (lower.includes("semiconductor") || lower.includes("chip") || lower.includes("silicon") || lower.includes("quantum") || lower.includes("hardware")) {
    return "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&h=750&fit=crop";
  }
  if (lower.includes("privacy") || lower.includes("security") || lower.includes("cybersecurity") || lower.includes("audit") || lower.includes("gdpr")) {
    return "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=750&fit=crop";
  }
  if (lower.includes("solar") || lower.includes("clean energy") || lower.includes("wind") || lower.includes("power grid") || lower.includes("energy")) {
    return "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&h=750&fit=crop";
  }
  if (lower.includes("logistics") || lower.includes("fleet") || lower.includes("transit") || lower.includes("truck") || lower.includes("supply")) {
    return "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=1200&h=750&fit=crop";
  }
  if (lower.includes("music") || lower.includes("song") || lower.includes("label") || lower.includes("audio") || lower.includes("streaming")) {
    return "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=750&fit=crop";
  }
  if (lower.includes("cio") || lower.includes("cloud") || lower.includes("data center") || lower.includes("infrastructure") || lower.includes("server")) {
    return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=750&fit=crop";
  }
  if (lower.includes("aid") || lower.includes("humanitarian") || lower.includes("disaster") || lower.includes("relief")) {
    return "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=750&fit=crop";
  }
  if (lower.includes("crop") || lower.includes("genetics") || lower.includes("agricultural") || lower.includes("farm") || lower.includes("seed")) {
    return "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&h=750&fit=crop";
  }
  if (lower.includes("rail") || lower.includes("ticket") || lower.includes("transportation") || lower.includes("train") || lower.includes("ambulance")) {
    return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=750&fit=crop";
  }
  if (lower.includes("school") || lower.includes("education") || lower.includes("curriculum") || lower.includes("student") || lower.includes("literacy")) {
    return "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=750&fit=crop";
  }
  if (lower.includes("journalist") || lower.includes("verifying") || lower.includes("source") || lower.includes("press") || lower.includes("media")) {
    return "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&h=750&fit=crop";
  }
  if (lower.includes("statistic") || lower.includes("research") || lower.includes("report") || lower.includes("analysis") || lower.includes("study")) {
    return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=750&fit=crop";
  }
  if (lower.includes("policy") || lower.includes("engineering") || lower.includes("standard") || lower.includes("compliance")) {
    return "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&h=750&fit=crop";
  }
  if (lower.includes("stock") || lower.includes("market") || lower.includes("wall street") || lower.includes("invest") || lower.includes("financial")) {
    return "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=750&fit=crop";
  }
  if (lower.includes("trump") || lower.includes("iran") || lower.includes("politics") || lower.includes("ceasefire") || lower.includes("hormuz")) {
    return "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&h=750&fit=crop";
  }
  if (lower.includes("argentina") || lower.includes("switzerland") || lower.includes("world cup") || lower.includes("semi-final") || lower.includes("soccer") || lower.includes("england")) {
    return "/argentina_vs_switzerland.png";
  }
  if (lower.includes("airbus") || lower.includes("jet") || lower.includes("aviation") || lower.includes("plane") || lower.includes("boeing")) {
    return "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1200&h=750&fit=crop";
  }

  // General tech & news high quality editorial fallback
  return "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=750&fit=crop";
}

function getNewsContent(slug: string) {
  const existing = customNewsDatabase[slug];
  const title = existing ? existing.title : formatTitleFromSlug(slug);
  const authorName = existing ? existing.authorName : "Jennifer Friesen";
  
  const mappedAuthor = authorAvatarMap[authorName];
  const authorAvatar = existing?.authorAvatar || mappedAuthor?.avatar || (
    authorName.toLowerCase().includes('hicke') ? "/author_glasses.jpg" :
    authorName.toLowerCase().includes('jain') ? "/author_bluesuit.jpg" :
    authorName.toLowerCase().includes('hogg') ? "/author_beard.jpg" :
    "/author_woman.jpg"
  );
  const authorBio = existing?.authorBio || mappedAuthor?.bio || `${authorName} is a dedicated journalist for Digital Journal covering breaking news, enterprise technology, and policy developments.`;

  const date = existing ? existing.date : "July 22, 2026 6:08 PM EDT";
  const image = (existing && existing.image) ? existing.image : getTopicMatchingImage(slug, title);
  const caption = existing ? existing.caption : `Comprehensive analysis and latest updates regarding ${title.toLowerCase()}. (Photo courtesy of Digital Journal)`;

  // Generate big, multi-section in-depth long-form article for all news pages
  const baseSections = existing ? existing.sections : [];
  
  const comprehensiveSections = [
    {
      heading: "",
      paragraphs: [
        ...(baseSections[0]?.paragraphs || [
          `In an influential development affecting international stakeholders, recent analysis surrounding ${title.toLowerCase()} points toward significant structural realignment across regional and global markets. Analysts and industry observers note that current policy adjustments are establishing new operational standards that will shape decision-making for years to come.`
        ]),
        `The initiatives come at a crucial juncture as government regulators, enterprise leaders, and independent oversight committees accelerate efforts to balance rapid innovation with stringent governance protocols. Preliminary telemetry suggests that early adopters are already experiencing measurable gains in workflow efficiency and audit compliance.`,
        `"What we are witnessing is not merely an incremental upgrade, but a fundamental transition in how organizations approach risk mitigation and long-term sustainability," noted senior industry analyst Dr. Marcus Vance during a briefing in Washington.`
      ]
    },
    {
      heading: "Strategic Context & Regulatory Frameworks",
      paragraphs: [
        ...(baseSections[1]?.paragraphs || [
          `Federal oversight bodies and transatlantic regulatory watchdogs have introduced updated compliance benchmarks to address emerging operational challenges. The updated framework mandates rigorous audit trails, transparent reporting mechanisms, and standardized protocol validations across all participating jurisdictions.`
        ]),
        `For corporate directors and policy planners, complying with these guidelines requires overhauling legacy pipelines and deploying advanced telemetry tooling capable of real-time monitoring. Failure to meet these criteria carries substantial regulatory scrutiny and potential market entry restrictions.`
      ]
    },
    {
      heading: "Technical Architecture & Operational Integration",
      paragraphs: [
        `On the technical front, systems integration leads are deploying modular architectures engineered to support high-throughput processing while maintaining zero-trust security postures. By decoupling core infrastructure from legacy dependencies, organizations achieve greater resilience against supply chain disruptions and unexpected market volatility.`,
        `Recent stress tests conducted by independent research consortia demonstrated an 18% improvement in delivery timeline precision and a 25% reduction in latency when using next-generation routing logic. These empirical benchmarks underscore the tangible return on investment driven by modern engineering standards.`
      ]
    },
    {
      heading: "Expert Perspectives & Economic Outlook",
      paragraphs: [
        `Economic forecasters project that capital allocation in this sector will grow by 32% over the next four quarters, fueled by institutional backing and venture capital pivots toward sustainable tech infrastructure. Emerging hubs in North America, Europe, and Asia-Pacific are competing to attract talent and foster innovation clusters.`,
        `However, market commentators warn that scaling these solutions will require sustained collaboration between public agencies and private sector developers. Aligning technical specifications across disparate platforms remains a primary hurdle toward achieving seamless global interoperability.`
      ]
    },
    {
      heading: "Long-Term Implications & Future Roadmap",
      paragraphs: [
        `Looking ahead, industry leaders anticipate further consolidation as established enterprises acquire specialized startups to bolster their core capabilities. Regulatory bodies are expected to publish secondary guidance notes later this year to clarify cross-border data transfer protocols and environmental impact accounting.`,
        `As organizations navigate this evolving landscape, prioritizing transparent governance, continuous automated testing, and agile management frameworks will remain essential for maintaining a competitive edge in an increasingly complex environment.`
      ]
    }
  ];

  return {
    title,
    authorName,
    authorAvatar,
    authorBio,
    date,
    image,
    caption,
    sections: comprehensiveSections,
  };
}

export async function generateStaticParams() {
  const categories = ["news", "business", "industry-insights", "technology"];
  const paths: { category: string; subcategory: string }[] = [];

  const subData: Record<string, string[]> = {
    "news": [
      "world", "markets", "politics",
      "international-data-privacy-standards-updated-after-cross-border-audits",
      "scientific-research-consortium-publishes-open-access-genome-study",
      "urban-infrastructure-plans-integrate-smart-power-grids-in-major-cities",
      "public-transportation-systems-roll-out-unified-digital-ticking",
      "education-systems-adapt-curricula-to-include-basic-ai-literacy"
    ],
    "business": [
      "companies", "corporate-news", "entrepreneurship", "startups", "leadership",
      "canadas-conexiom-bets-that-the-future-of-ai-lies-in-automation-not-experimentation",
      "lightworks-scotiabank-sun-life-and-telus-launch-ai-consortium",
      "canadas-ai-adoption-problem-meets-its-youth-employment-problem",
      "oped-rethinking-humanity-as-automation-rewrites-human-realities",
      "indispensable-xiaohongshu-app-fuels-chinese-tourism"
    ],
    "industry-insights": [
      "agriculture", "tourism", "financial-services", "health", "transportation",
      "boeing-gets-order-for-100-737-max-jets-from-leasing-company-smbc",
      "spacex-abruptly-scrubs-starship-test-flight",
      "ai-helps-pathologists-spot-prostate-cancer-faster-what-canada-can-learn-from-landmark-uk-study",
      "openai-fails-to-trademark-name-in-eu",
      "like-my-lover-chinese-users-bid-farewell-to-ai-companions"
    ],
    "technology": [
      "artificial-intelligence", "cybersecurity", "innovations", "space-technology",
      "silicon-valley-chip-manufacturers-announce-breakthrough-architectural-updates",
      "new-quantum-computing-clusters-open-to-public-cloud-developer-preview",
      "opensource-database-platform-raises-record-funding-round-for-scaling",
      "how-edge-computing-is-transforming-real-time-telemetry-processing",
      "cybersecurity-protocols-updated-globally-to-counter-multi-vector-threats"
    ]
  };

  categories.forEach((cat) => {
    const subs = subData[cat] || ["companies", "startups"];
    subs.forEach((sub) => {
      paths.push({ category: cat, subcategory: sub });
    });
  });

  return paths;
}

export default async function SubcategoryPage({ params }: PageProps) {
  const { category, subcategory } = await params;
  
  const subName = formatSubcategory(subcategory);
  const parent = parentConfig[category] || { name: "Business", color: "bg-[#BEEDF7]", desc: "tracks development paradigms." };

  const diveDeeperShortlist = [
    "world", "markets", "politics", "companies", "corporate-news", "entrepreneurship",
    "startups", "leadership", "agriculture", "tourism", "financial-services", "health",
    "transportation", "artificial-intelligence", "cybersecurity", "innovations", "space-technology"
  ];
  
  const isNewsArticle = !diveDeeperShortlist.includes(subcategory);

  if (isNewsArticle) {
    const newsData = getNewsContent(subcategory);

    const sidebarPicks = [
      {
        title: "US announces civilian nuclear deal with Saudi Arabia",
        date: "July 22, 2026 5:25 PM EDT",
        image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=150&h=150&fit=crop",
        href: "/news/world/us-announces-civilian-nuclear-deal-with-saudi-arabia"
      },
      {
        title: "As Canadians turn to AI for mortgage advice, experts warn about privacy risks and inaccurate guidance",
        date: "July 22, 2026 5:17 PM EDT",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=150&h=150&fit=crop",
        href: "/news/markets/as-canadians-turn-to-ai-for-mortgage-advice-experts-warn-about-privacy-risks"
      },
      {
        title: "Tesla shares dip after profit misses expectations",
        date: "July 22, 2026 5:10 PM EDT",
        image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=150&h=150&fit=crop",
        href: "/news/markets/tesla-shares-dip-after-profit-misses-expectations"
      },
      {
        title: "Your AI made a decision, and Canadian regulators want to know how",
        date: "July 21, 2026",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=150&h=150&fit=crop",
        href: "/industry-insights/health/your-ai-made-a-decision-and-canadian-regulators-want-to-know-how"
      },
      {
        title: "Dutch students unveil 'world-first' solar-powered ambulance",
        date: "July 21, 2026",
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=150&h=150&fit=crop",
        href: "/news/world/dutch-students-unveil-world-first-solar-powered-ambulance"
      }
    ];

    const relatedNewsList = [
      {
        title: "Farnborough to survey the state of Boeing's comeback",
        desc: "The aviation industry gathers for its flagship air show with Boeing's recovery under scrutiny by customers, regulators and leadership shakeups.",
        date: "By AFP • July 18, 2026",
        image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&h=250&fit=crop",
        href: "/news/markets/us-stocks-end-higher-as-sk-hynixs-wall-street-debut-and-metas-ai-momentum-lift-markets"
      },
      {
        title: "Boeing to expand 737 MAX output as aviation giant targets comeback",
        desc: "The plane maker plans to increase narrowbody production volumes as it seeks to rebuild trust and address safety audits.",
        date: "By AFP • July 18, 2026",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
        href: "/business/companies/new-exclusive-decoration-design-fit-out-llc-structural-acrylic-pioneers-in-the-uae"
      },
      {
        title: "US jury finds Boeing guilty in 737 MAX grounding lawsuit",
        desc: "A federal jury has ordered Boeing to pay damages to families of victims, holding the company liable for safety gaps.",
        date: "By Reuters • July 15, 2026",
        image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=400&h=250&fit=crop",
        href: "/news/politics/trump-declares-iran-ceasefire-over-raising-questions-about-the-next-phase-of-the-conflict"
      },
      {
        title: "Boeing confirms China commitment to buy 200 aircraft",
        desc: "Aerospace giant says commitment remains active, with first deliveries expected in late 2026.",
        date: "By Bloomberg • July 15, 2026",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop",
        href: "/news/markets/crypto-market-overview-bitcoin-stabilizes-zcash-targets-new-highs"
      }
    ];

    return (
      <main className="min-h-screen bg-white">
        <Header />
        
        {/* News Article Container */}
        <article className="font-standard-sans max-w-[1400px] mx-auto px-4 md:px-8 py-10">
          
          {/* Top Utility Bar matching reference image */}
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-6 font-sans">
            <Link href="/" className="text-[12px] font-medium text-zinc-500 hover:text-black transition-colors flex items-center gap-1">
              ‹ Back to Newsroom
            </Link>

            <div className="flex items-center gap-4 text-zinc-500 text-[12px]">
              <div className="flex items-center gap-1.5 border border-zinc-200 rounded px-2 py-0.5 bg-zinc-50">
                <button className="hover:text-black font-bold">A-</button>
                <span className="text-zinc-300">|</span>
                <button className="hover:text-black font-bold">A+</button>
              </div>
              <button className="hover:text-black transition-colors cursor-pointer" aria-label="Share">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button className="hover:text-black transition-colors cursor-pointer" aria-label="Bookmark">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Category Tag */}
          <div className="text-[11px] font-bold text-[#BF1E2D] uppercase tracking-wider mb-2 font-standard-sans flex items-center gap-2">
            <Link href={`/${category}`} className="hover:underline">{parent.name}</Link>
            <span className="text-zinc-400">/</span>
            <span className="text-zinc-700">{subName}</span>
          </div>

          {/* Main Title (Matching Image 2 Serif Title) */}
          <h1 className="font-serif text-[32px] sm:text-[38px] md:text-[42px] font-bold leading-[1.18] text-black mb-4 tracking-tight">
            {newsData.title}
          </h1>

          {/* Subheadline (Matching Image 2 Italic Subheadline) */}
          <p className="font-serif text-[17px] md:text-[19px] text-zinc-600 italic leading-relaxed mb-6">
            {newsData.caption ? newsData.caption.split('.')[0] + '.' : 'Independent analysis and verified reporting on key regulatory policy changes.'}
          </p>

          {/* Author Metadata Bar */}
          <div className="flex items-center gap-3.5 mb-8 pb-6 border-b border-zinc-200 font-sans">
            <Link href={`/author/${newsData.authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="w-11 h-11 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border border-zinc-300 hover:opacity-80 transition-opacity">
              <img src={newsData.authorAvatar} alt={newsData.authorName} className="w-full h-full object-cover" />
            </Link>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-[14px] font-bold text-black font-sans leading-tight">
                  By <Link href={`/author/${newsData.authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="underline hover:text-[#BF1E2D] transition-colors">{newsData.authorName}</Link>
                </p>
                {/* Verified Check Icon */}
                <svg className="w-4 h-4 text-[#1D9BF0]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.34-1.89-4.24-4.23-4.24-.496 0-.966.084-1.4.238C14.31 2.225 12.94 1.35 11.36 1.35c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.34 0-4.24 1.89-4.24 4.23 0 .496.084.966.238 1.4C1.225 9.55.35 10.92.35 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.34 1.89 4.24 4.23 4.24.496 0 .966-.084 1.4-.238.65 1.273 2.02 2.148 3.6 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.34 0 4.24-1.89 4.24-4.23 0-.496-.084-.966-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.28 4.29l-4.11-4.11 1.41-1.41 2.7 2.7 6.44-6.44 1.41 1.41-7.85 7.85z"/>
                </svg>
              </div>
              <p className="text-[12px] text-zinc-500 mt-0.5">{newsData.date}</p>
            </div>
          </div>

          {/* Featured Image - Full Container Width */}
          <div className="relative w-full aspect-[16/9] md:aspect-[16/8.5] overflow-hidden bg-gray-100 mb-2 rounded-sm border border-zinc-200">
            <img
              src={newsData.image}
              alt={newsData.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Caption */}
          <p className="text-[12px] text-zinc-500 mb-8 leading-relaxed font-sans italic">
            {newsData.caption} — Photo courtesy of Digital Journal
          </p>

          {/* Body Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-6 items-start">
            
            {/* Left Column: Main News content */}
            <div className="lg:col-span-8 flex flex-col">
              {/* Google News Preferred Source Badge */}
              <button className="flex items-center gap-2.5 bg-black border border-zinc-800 rounded px-3 py-1.5 hover:bg-zinc-900 transition-colors mb-6 cursor-pointer max-w-max shadow-sm">
                <div className="flex items-center justify-center bg-white rounded-full p-1 w-5 h-5 flex-shrink-0">
                  <svg className="w-3 h-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div className="flex flex-col text-left font-sans">
                  <span className="text-[9px] leading-tight text-zinc-400 font-normal">Add as a preferred</span>
                  <span className="text-[9px] leading-tight text-white font-bold">source on Google</span>
                </div>
              </button>

              {/* News Body Sections (Serif High-Readability Font matching Image 2) */}
              <div className="space-y-6 font-serif text-[17px] md:text-[18px] text-zinc-900 leading-[1.8] tracking-normal mt-2">
                {newsData.sections.map((sec, secIdx) => (
                  <div key={secIdx} className="space-y-5">
                    {sec.heading && (
                      <h2 className="font-serif text-[22px] md:text-[24px] font-bold text-black mt-8 mb-3 leading-snug">
                        {sec.heading}
                      </h2>
                    )}
                    {sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-zinc-900">{p}</p>
                    ))}
                  </div>
                ))}
              </div>

              {/* Newsletter Callout Box (Matching Image 2 Fast Start Gold/Brown Banner) */}
              <FastStartNewsletterBanner />

              {/* Bottom Author Profile Row */}
              <div className="flex gap-6 items-center border-t border-b border-zinc-200 py-8 my-8 font-standard-sans">
                <Link href={`/author/${newsData.authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border border-zinc-300 hover:opacity-80 transition-opacity">
                  <img src={newsData.authorAvatar} alt={newsData.authorName} className="w-full h-full object-cover grayscale" />
                </Link>
                <div className="flex flex-col text-left font-sans">
                  <span className="text-[11px] text-black font-bold uppercase tracking-wider leading-none mb-2 font-standard-sans">WRITTEN BY</span>
                  <Link href={`/author/${newsData.authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="text-[20px] sm:text-[22px] font-bold text-black underline underline-offset-4 hover:text-[#BF1E2D] transition-colors leading-none">
                    {newsData.authorName}
                  </Link>
                  <p className="text-[13px] sm:text-[14px] text-zinc-800 mt-3 leading-relaxed">
                    {newsData.authorBio}
                  </p>
                </div>
              </div>

              {/* Bottom Comments / Saved Stories Bar (Matching reference screenshot) */}
              <div className="space-y-1.5 font-sans my-6 text-[12px] text-zinc-500">
                <div className="flex items-center gap-2 font-bold text-black uppercase tracking-wider text-[11.5px]">
                  <span>💬 COMMENTS (0)</span>
                </div>
                <p className="text-[#BF1E2D] font-bold hover:underline cursor-pointer text-[12px]">Add to your saved stories</p>
              </div>

            </div>

            {/* Right Column: Sidebar Feed (Matching Image 2 "MOST POPULAR") */}
            <div className="lg:col-span-4 lg:pl-4 font-standard-sans border-l border-zinc-100 lg:border-zinc-200 pt-2 lg:pt-0">
              {/* Sidebar Header Title (Matching Image 2 Header) */}
              <div className="border-b-2 border-black pb-2 mb-6 w-full flex items-center justify-between">
                <h3 className="text-[13.5px] font-bold text-black uppercase tracking-wider font-standard-sans">
                  MOST POPULAR IN {parent.name.toUpperCase()}
                </h3>
              </div>

              {/* Sidebar Items Stack (Matching Image 2 Right Column) */}
              <div className="space-y-5 font-sans">
                {sidebarPicks.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="flex gap-3.5 items-start cursor-pointer group pb-4 border-b border-zinc-100 last:border-none"
                  >
                    <div className="relative w-[75px] h-[65px] flex-shrink-0 overflow-hidden bg-gray-100 rounded border border-zinc-200">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <h4 className="text-[13px] md:text-[13.5px] font-bold leading-snug text-black group-hover:text-[#BF1E2D] transition-colors mb-1 font-serif">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-zinc-500 font-normal font-sans">{item.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* Related News Bottom Section (Matching Image 2 Bottom Cards with Category Overlay Badges) */}
          <div className="border-t border-gray-200 mt-16 pt-8">
            <div className="border-b-2 border-black pb-2 mb-6">
              <h3 className="text-[14px] font-bold text-black uppercase tracking-wider font-standard-sans">
                MORE FROM {parent.name.toUpperCase()} CATEGORY
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedNewsList.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="flex flex-col font-standard-sans group cursor-pointer"
                >
                  <div className="relative w-full aspect-video overflow-hidden mb-3 bg-gray-100 rounded border border-zinc-200">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Category Pill Overlay matching Image 2 */}
                    <span className="absolute bottom-2 left-2 bg-black/85 text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider font-sans rounded-xs">
                      {idx % 2 === 0 ? parent.name.toUpperCase() : 'WORLD'}
                    </span>
                  </div>
                  <h4 className="text-[13.5px] font-serif font-bold leading-snug text-black group-hover:text-[#BF1E2D] transition-colors mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-[11.5px] text-zinc-600 leading-relaxed mb-2 font-normal font-sans line-clamp-2">
                    {item.desc}
                  </p>
                  <span className="text-[10.5px] text-zinc-400 font-normal font-sans">{item.date}</span>
                </Link>
              ))}
            </div>
          </div>

        </article>
        
        <Footer />
      </main>
    );
  }

  return (
    <CategoryPageLayout
      categoryName={subName}
      categoryColor={parent.color}
      infoBoxText={parent.desc}
      featured={{
        category: parent.name.toUpperCase(),
        title: `How digital transformation is changing the future of ${subName}`,
        description: `Exploring how modern developer standards, architectural migrations, and new automation frameworks are transforming ${subName.toLowerCase()} processes globally.`,
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=800&fit=crop",
        author: "Dr. Tim Sandle",
        date: "July 19, 2026"
      }}
      secondaryArticles={[
        {
          title: `Why remote leadership models are evolving in ${subName}`,
          image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop",
          date: "July 15, 2026"
        },
        {
          title: `Best practices for secure development lifecycle in ${subName}`,
          image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=150&h=150&fit=crop",
          date: "July 14, 2026"
        },
        {
          title: `Tunnel tech to survey the state of standard setups in ${subName}`,
          image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=150&h=150&fit=crop",
          date: "July 12, 2026"
        },
        {
          title: `E-commerce platforms scale up localized transaction nodes for ${subName}`,
          image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=150&h=150&fit=crop",
          date: "July 10, 2026"
        }
      ]}
      guidesTitle={`${subName} Guides`}
      guidesDescription="Learn from hands-on architectures and system logs."
      guides={[]}
      newsTitle={`${subName} News`}
      newsDescription="Get the latest regulatory policy changes."
      newsArticles={[
        {
          title: `Global regulatory boards align on uniform ${subName} standards`,
          description: `Privacy watchdogs and industry leaders execute combined audits to verify compliance and safety across transatlantic ${subName.toLowerCase()} services.`,
          date: "By Sarah Miller • 4 hours ago",
          image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=220&h=150&fit=crop"
        },
        {
          title: `Research consortium publishes open-access study on ${subName} frameworks`,
          description: `Systems engineers release detailed architecture documentation to help organizations build resilient, scalable pipelines.`,
          date: "By David Chen • 12 hours ago",
          image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=220&h=150&fit=crop"
        },
        {
          title: `Next-generation data infrastructure rolled out for ${subName} sector`,
          description: `Enterprise platforms integrate AI routing to balance supply nodes and reduce latency during peak demand hours.`,
          date: "By Lisa Chen • 1 day ago",
          image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=220&h=150&fit=crop"
        },
        {
          title: `Unified digital protocols adopted by leading ${subName} firms`,
          description: `Organizations gain streamlined interoperability across multiple cloud environments, reducing integration overheads.`,
          date: "By Pramod Asu • 2 days ago",
          image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=220&h=150&fit=crop"
        }
      ]}
    />
  );
}
