export interface CategoryArticle {
  title: string;
  image: string;
  date: string;
  description?: string;
  author?: string;
  category?: string;
}

export interface CategoryGuide {
  title: string;
  description: string;
  author: string;
}

export interface CategoryData {
  categoryName: string;
  categoryColor: string;
  infoBoxText: string;
  featured: {
    category: string;
    title: string;
    description: string;
    image: string;
    author: string;
    date: string;
  };
  secondaryArticles: CategoryArticle[];
  guidesTitle: string;
  guidesDescription: string;
  guides: CategoryGuide[];
  newsTitle: string;
  newsDescription: string;
  newsArticles: CategoryArticle[];
}

export function getCategoryData(slug: string): CategoryData {
  const norm = slug.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (norm.includes("lifestyle")) {
    return {
      categoryName: "Lifestyle & Culture",
      categoryColor: "bg-rose-50",
      infoBoxText: `Digital Journal's Lifestyle & Culture coverage explores modern living, wellness, architecture, personal finance, and workplace dynamics.\nFrom sustainable design trends to remote-work burnout solutions, our team delivers thoughtful features on how society lives, works, and thrives in an evolving digital age.`,
      featured: {
        category: "LIFESTYLE • WELLNESS & MODERN LIVING",
        title: "The rise of slow living and minimalist design in urban architecture",
        description: "Architects and urban planners are reimagining city apartments with natural light, indoor gardens, and sustainable wood finishes to counter metropolitan stress.",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&h=800&fit=crop",
        author: "Emma Watson",
        date: "July 16, 2026"
      },
      secondaryArticles: [
        {
          title: "How wearable health sensors are reshaping personal daily nutrition",
          image: "https://images.unsplash.com/photo-1510519138161-58446232811f?w=150&h=150&fit=crop",
          date: "July 16, 2026"
        },
        {
          title: "Work-life balance in the age of 24/7 hyper-connected remote teams",
          image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=150&h=150&fit=crop",
          date: "July 15, 2026"
        },
        {
          title: "Eco-conscious travel: Boutique hotels leading zero-waste hospitality",
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&h=150&fit=crop",
          date: "July 15, 2026"
        },
        {
          title: "Mindful technology use: Strategies for reclaiming digital focus",
          image: "https://images.unsplash.com/photo-1499209974431-9dac3ada00d7?w=150&h=150&fit=crop",
          date: "July 14, 2026"
        }
      ],
      guidesTitle: "LIFESTYLE & WELLNESS GUIDES",
      guidesDescription: "Practical advice and deep dives into personal growth, sustainable living, and modern wellness.",
      guides: [
        {
          title: "Designing a calm, productive home workspace for deep creative focus",
          description: "Ergonomic furniture, biophilic design elements, and lighting setups that boost cognitive energy...",
          author: "By Maya Lin • July 15, 2026"
        },
        {
          title: "The beginner's guide to mindful digital detoxing without dropping off the grid",
          description: "How to audit notifications, curate social feeds, and establish evening screen-free rituals...",
          author: "By Julian Vance • July 14, 2026"
        },
        {
          title: "Sustainable fashion 101: Building a durable, timeless capsule wardrobe",
          description: "Prioritizing organic textiles, ethical supply chains, and garment longevity over fast fashion trends...",
          author: "By Clara Hughes • July 14, 2026"
        },
        {
          title: "Financial wellness: Managing personal savings during shifting interest rates",
          description: "Budgeting frameworks, high-yield savings strategies, and smart debt consolidation tactics...",
          author: "By Marcus Vance • July 13, 2026"
        }
      ],
      newsTitle: "LIFESTYLE & CULTURE DISPATCHES",
      newsDescription: "The latest stories, trends, and features shaping modern living across the globe.",
      newsArticles: [
        {
          title: "Coffee culture evolution: Specialty roasters innovate with cold-brewed botanical infusions",
          image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop",
          description: "Artisanal coffee labs blend adaptogenic herbs and micro-lot single-origin beans for enhanced morning clarity.",
          date: "July 16, 2026"
        },
        {
          title: "Micro-adventures gaining popularity among busy urban professionals",
          image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=300&h=200&fit=crop",
          description: "Weekend bikepacking trips and overnight wilderness camping provide rapid mental resets near major cities.",
          date: "July 15, 2026"
        },
        {
          title: "Biophilic interior design approved for modern hospital recovery wards",
          image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=300&h=200&fit=crop",
          description: "Integrating living plant walls and natural acoustics accelerates patient healing times by 20 percent.",
          date: "July 15, 2026"
        },
        {
          title: "The resurgence of independent bookstores as community cultural hubs",
          image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=200&fit=crop",
          description: "Local bookshops thrive by pairing author readings with craft coffee bars and analog vinyl listening lounges.",
          date: "July 14, 2026"
        }
      ]
    };
  }

  if (norm.includes("sport")) {
    return {
      categoryName: "Sports & Athletics",
      categoryColor: "bg-blue-50",
      infoBoxText: `Digital Journal's Sports & Athletics coverage delivers breaking news, performance analytics, sports technology, and athlete features.\nFrom Olympic preparation to high-tech biometric analytics in professional leagues, our sports journalists track the games, teams, and innovations transforming global sport.`,
      featured: {
        category: "SPORTS • PERFORMANCE & BIOMETRICS",
        title: "Next-gen sports telemetry: How AI wearables are revolutionizing elite athlete training",
        description: "Professional football and basketball franchises deploy real-time muscle oxygenation and hydration sensors to prevent soft-tissue injuries and peak performance.",
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=800&fit=crop",
        author: "Marcus Vance",
        date: "July 16, 2026"
      },
      secondaryArticles: [
        {
          title: "Global football leagues adopt high-speed AI offside tracking cameras",
          image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&h=150&fit=crop",
          date: "July 16, 2026"
        },
        {
          title: "Endurance athletes break records using personalized gut microbiome fueling",
          image: "https://images.unsplash.com/photo-1517649763962-0c623266010b?w=150&h=150&fit=crop",
          date: "July 15, 2026"
        },
        {
          title: "Sustainable stadiums: Solar-powered venues leading sports green transition",
          image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=150&h=150&fit=crop",
          date: "July 15, 2026"
        },
        {
          title: "The expansion of esports into collegiate scholarship programs nationwide",
          image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&h=150&fit=crop",
          date: "July 14, 2026"
        }
      ],
      guidesTitle: "SPORTS TECHNOLOGY & TRAINING GUIDES",
      guidesDescription: "In-depth guides on athletic conditioning, sports science, and performance tech.",
      guides: [
        {
          title: "Understanding recovery science: Sleep, cryotherapy, and active restoration",
          description: "How elite athletic programs structure 24-hour recovery protocols to minimize soft-tissue fatigue...",
          author: "By Dr. David Sterling • July 15, 2026"
        },
        {
          title: "The marathon runner's guide to negative splits and race-day pacing strategy",
          description: "Scientific pacing charts, heart rate zone management, and mental stamina conditioning for 42km races...",
          author: "By Sarah Jenkins • July 14, 2026"
        },
        {
          title: "High-altitude athletic conditioning: Physiological adaptations and benefits",
          description: "How oxygen-thin environments trigger red blood cell generation for endurance events...",
          author: "By Alex Rivers • July 14, 2026"
        },
        {
          title: "Sports nutrition: Carbohydrate loading vs dual-fuel fat adaptation strategies",
          description: "Evaluating energy substrate utilization during high-intensity vs steady-state athletic competition...",
          author: "By Dr. Rachel Green • July 13, 2026"
        }
      ],
      newsTitle: "SPORTS & ATHLETICS DISPATCHES",
      newsDescription: "Breaking reports, championship coverage, and athletic technology updates.",
      newsArticles: [
        {
          title: "World Athletics approves lightweight carbon-fiber composite competition footwear",
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop",
          description: "New biomechanical shoe regulations establish energy return thresholds for track & field events.",
          date: "July 16, 2026"
        },
        {
          title: "Formula 1 shifts to 100% sustainable synthetic fuels for upcoming championship season",
          image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=300&h=200&fit=crop",
          description: "Motorsport engine manufacturers demonstrate zero net-carbon combustion at high RPM test benches.",
          date: "July 15, 2026"
        },
        {
          title: "Women's professional tennis sees record broadcast viewership and stadium attendance",
          image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=300&h=200&fit=crop",
          description: "Global media rights agreements reflect surging international fan engagement for grand slam tournaments.",
          date: "July 15, 2026"
        },
        {
          title: "Youth sports leagues integrate shock-absorption helmets for concussion safety",
          image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&h=200&fit=crop",
          description: "Fluid-filled helmet liners reduce rotational acceleration by 40% during high-impact plays.",
          date: "July 14, 2026"
        }
      ]
    };
  }

  if (norm.includes("entertainment")) {
    return {
      categoryName: "Entertainment & Arts",
      categoryColor: "bg-purple-50",
      infoBoxText: `Digital Journal's Entertainment & Arts coverage brings you the latest from film, streaming, music, digital media, and pop culture.\nWe track industry shifts, box office analytics, independent cinema breakthroughs, and how virtual production technologies are reshaping storytelling worldwide.`,
      featured: {
        category: "ENTERTAINMENT • VIRTUAL PRODUCTION & FILM",
        title: "How LED volume stages are changing Hollywood film production forever",
        description: "Real-time Unreal Engine background rendering replaces traditional green screens, allowing directors to shoot desert sunsets and sci-fi vistas in soundstages.",
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=800&fit=crop",
        author: "Julian Vance",
        date: "July 16, 2026"
      },
      secondaryArticles: [
        {
          title: "Streaming services shift focus from subscriber growth to profitability & ad tiers",
          image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=150&h=150&fit=crop",
          date: "July 16, 2026"
        },
        {
          title: "Independent film festival highlights groundbreaking female directors",
          image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=150&h=150&fit=crop",
          date: "July 15, 2026"
        },
        {
          title: "Vinyl record sales top physical music charts for 5th consecutive year",
          image: "https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=150&h=150&fit=crop",
          date: "July 15, 2026"
        },
        {
          title: "Spatial audio mixing transforms live concert stadium experiences",
          image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&h=150&fit=crop",
          date: "July 14, 2026"
        }
      ],
      guidesTitle: "FILM & DIGITAL MEDIA GUIDES",
      guidesDescription: "Analysis of storytelling techniques, screenwriting, and media industry dynamics.",
      guides: [
        {
          title: "The complete guide to virtual camera tracking in modern filmmaking",
          description: "Understanding lens calibration, parallax rendering, and motion-capture sync on live stages...",
          author: "By David Miller • July 15, 2026"
        },
        {
          title: "How spatial sound design immerses audiences in headphones and cinemas",
          description: "Dolby Atmos object-based mixing, binaural panning, and acoustic frequency isolation for mixers...",
          author: "By Chloe Vance • July 14, 2026"
        },
        {
          title: "Screenwriting structure: Balancing character arcs with non-linear timelines",
          description: "Dissecting successful psychological thrillers and ensemble dramas that break traditional 3-act beats...",
          author: "By Marcus Reed • July 14, 2026"
        },
        {
          title: "The economics of indie film distribution: Self-releasing vs festival sales",
          description: "Evaluating VOD royalty splits, theatrical blowouts, and regional streaming licenses for filmmakers...",
          author: "By Sarah Jenkins • July 13, 2026"
        }
      ],
      newsTitle: "ENTERTAINMENT & ARTS DISPATCHES",
      newsDescription: "The latest news from cinema, television, music, and digital performance.",
      newsArticles: [
        {
          title: "Global box office revenues surge powered by original sci-fi blockbusters",
          image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=200&fit=crop",
          description: "Audiences favor immersive IMAX laser presentations and original storytelling over sequel franchises.",
          date: "July 16, 2026"
        },
        {
          title: "AI music tools Sparks debate among songwriters regarding copyright royalties",
          image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=200&fit=crop",
          description: "Music publisher unions propose mandatory watermarking for AI-generated vocal stems and melodies.",
          date: "July 15, 2026"
        },
        {
          title: "Interactive video game narratives win prestige literary awards",
          image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=200&fit=crop",
          description: "Complex branching storylines and dialogue trees earn recognition alongside traditional novels.",
          date: "July 15, 2026"
        },
        {
          title: "Broadway productions adopt robotic stage rigging for seamless scene transitions",
          image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=300&h=200&fit=crop",
          description: "Automated counterweight systems allow rapid set transformations in under five seconds.",
          date: "July 14, 2026"
        }
      ]
    };
  }

  if (norm.includes("health")) {
    return {
      categoryName: "Health & Medicine",
      categoryColor: "bg-emerald-50",
      infoBoxText: `Digital Journal's Health & Medicine coverage provides trusted reporting on medical research, public health policy, biotechnology breakthroughs, and clinical innovations.\nFrom mRNA cancer vaccine trials to AI-assisted diagnostics, our medical writers break down complex science into actionable news for global readers.`,
      featured: {
        category: "HEALTH • GENOMIC MEDICINE & IMMUNOLOGY",
        title: "CRISPR gene editing trial demonstrates landmark reversal of hereditary blood disorders",
        description: "Clinical research teams report sustained 36-month remission in patients treated with targeted base-editing cell therapy, opening new frontiers in precision medicine.",
        image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&h=800&fit=crop",
        author: "Dr. Sarah Mitchell",
        date: "July 16, 2026"
      },
      secondaryArticles: [
        {
          title: "AI diagnostic algorithm identifies early-stage pancreatic cancer from routine scans",
          image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=150&h=150&fit=crop",
          date: "July 16, 2026"
        },
        {
          title: "Global health organization approves novel single-dose malaria vaccine",
          image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=150&h=150&fit=crop",
          date: "July 15, 2026"
        },
        {
          title: "Sleep architecture research reveals neural memory consolidation mechanisms",
          image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=150&h=150&fit=crop",
          date: "July 15, 2026"
        },
        {
          title: "Telehealth expansion improves rural medical access across developing nations",
          image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&h=150&fit=crop",
          date: "July 14, 2026"
        }
      ],
      guidesTitle: "MEDICAL SCIENCE & PUBLIC HEALTH GUIDES",
      guidesDescription: "In-depth research summaries, preventative health frameworks, and bioethics.",
      guides: [
        {
          title: "Understanding mRNA therapeutic platforms beyond infectious disease vaccines",
          description: "How customized mRNA strands instruct muscle cells to synthesize targeted cancer antigens...",
          author: "By Dr. Michael Chang • July 15, 2026"
        },
        {
          title: "The science of longevity: Biomarkers, cellular senescence, and NAD+ precursors",
          description: "Evaluating ongoing human trials measuring telomere length and mitochondrial function...",
          author: "By Dr. Rachel Vance • July 14, 2026"
        },
        {
          title: "Gut-brain axis: Microflora composition and neuro-inflammatory pathways",
          description: "How dietary fiber degradation by gut bacteria modulates serotonin and dopamine receptors...",
          author: "By Dr. Alan Ross • July 14, 2026"
        },
        {
          title: "Preventative cardiology: Advanced lipid panel markers vs traditional cholesterol metrics",
          description: "Analyzing ApoB, Lp(a), and coronary artery calcium scoring for early cardiovascular risk management...",
          author: "By Dr. Sarah Mitchell • July 13, 2026"
        }
      ],
      newsTitle: "HEALTH & MEDICINE DISPATCHES",
      newsDescription: "The latest clinical reports, biotech breakthroughs, and wellness news.",
      newsArticles: [
        {
          title: "Non-invasive continuous glucose monitors gain regulatory approval for general public",
          image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=300&h=200&fit=crop",
          description: "Optical spectroscopy sensors track blood sugar via smartwatch optical light sensors without blood pricks.",
          date: "July 16, 2026"
        },
        {
          title: "New class of targeted antibiotics combats resistant bacterial strains in hospital trials",
          image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop",
          description: "Synthetic peptides disrupt outer bacterial membranes while leaving healthy gut biomes intact.",
          date: "July 15, 2026"
        },
        {
          title: "Neurotech brain-computer interface restores speech for paralyzed stroke survivor",
          image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=300&h=200&fit=crop",
          description: "Implanted cortical arrays decode motor cortex intent into real-time synthesized voice output.",
          date: "July 15, 2026"
        },
        {
          title: "Mindfulness and cognitive behavioral therapy show equal efficacy to first-line anxiety medications",
          image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop",
          description: "A 12-week randomized trial confirms structured mindfulness reduces cortisol and stress markers.",
          date: "July 14, 2026"
        }
      ]
    };
  }

  if (norm.includes("research") || norm.includes("insight")) {
    return {
      categoryName: "Research & Industry Insights",
      categoryColor: "bg-amber-50",
      infoBoxText: `Digital Journal's Research & Industry Insights desk publishes data-driven analyses, whitepapers, economic forecasts, and market intelligence.\nOur analysts evaluate macroeconomic shifts, supply chain resilience, emerging technologies, and corporate governance for executive decision-makers worldwide.`,
      featured: {
        category: "RESEARCH • GLOBAL MACROECONOMICS & AI IMPACT",
        title: "Global AI economic forecast: $15.7 Trillion value creation projected by 2030",
        description: "Comprehensive econometric modeling reveals labor productivity gains in logistics, healthcare, and financial services will drive 40% of global GDP expansion over the next decade.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=800&fit=crop",
        author: "David Potter",
        date: "July 16, 2026"
      },
      secondaryArticles: [
        {
          title: "Supply chain resilience index: Nearshoring trends accelerate across North America",
          image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&h=150&fit=crop",
          date: "July 16, 2026"
        },
        {
          title: "Corporate ESG reporting compliance shifts from voluntary to audit-mandatory",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&h=150&fit=crop",
          date: "July 15, 2026"
        },
        {
          title: "Venture capital dry powder deployment surges in quantum computing startups",
          image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop",
          date: "July 15, 2026"
        },
        {
          title: "Autonomous logistics drone market benchmark report 2026",
          image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=150&h=150&fit=crop",
          date: "July 14, 2026"
        }
      ],
      guidesTitle: "RESEARCH METHODOLOGY & INDUSTRY WHITEPAPERS",
      guidesDescription: "In-depth technical papers, statistical analysis, and strategic forecasting.",
      guides: [
        {
          title: "Measuring total cost of ownership (TCO) for enterprise cloud infrastructure migration",
          description: "Frameworks for evaluating egress fees, reserved instance pricing, and multi-cloud failover overhead...",
          author: "By Pramod Jain • July 15, 2026"
        },
        {
          title: "The executive manual to data privacy regulation compliance across global jurisdictions",
          description: "Navigating EU AI Act requirements, California privacy laws, and cross-border data transfer pacts...",
          author: "By Jennifer Lussier • July 14, 2026"
        },
        {
          title: "Semiconductor supply chain risk assessment: Wafer fabrication and rare earth material dependencies",
          description: "Analyzing single-source bottlenecks in extreme ultraviolet lithography and noble gas reserves...",
          author: "By Chris Hogg • July 14, 2026"
        },
        {
          title: "Commercial real estate repricing: Converting vacant office towers into high-density residential hubs",
          description: "Engineering feasibility studies, zoning variances, and tax credit incentives for adaptive reuse...",
          author: "By David Potter • July 13, 2026"
        }
      ],
      newsTitle: "RESEARCH & INDUSTRY DISPATCHES",
      newsDescription: "Executive summaries, whitepaper releases, and market research studies.",
      newsArticles: [
        {
          title: "Global semiconductor equipment spending reaches record $130 Billion in Q2",
          image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop",
          description: "Fabrication plant construction in North America and Asia drives unprecedented demand for EUV lithography systems.",
          date: "July 16, 2026"
        },
        {
          title: "Clean energy transition report: Renewable grid storage capacity doubles year-over-year",
          image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=300&h=200&fit=crop",
          description: "Grid-scale sodium-ion and lithium-iron-phosphate battery installations stabilize peak grid demand.",
          date: "July 15, 2026"
        },
        {
          title: "Cybersecurity benchmark study reveals 45% reduction in breaches for zero-trust architectures",
          image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&h=200&fit=crop",
          description: "Organizations deploying micro-segmentation and continuous identity verification mitigate insider threat risks.",
          date: "July 15, 2026"
        },
        {
          title: "Global fintech report: Central bank digital currencies (CBDCs) enter pilot testing in 20 nations",
          image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&h=200&fit=crop",
          description: "Interoperable settlement rails reduce cross-border wire transaction times from days to milliseconds.",
          date: "July 14, 2026"
        }
      ]
    };
  }

  // DEFAULT FALLBACK CATEGORY GENERATOR (For Markets, Economy, Politics, World, etc.)
  const displayName = slug
    .replace(/[^a-zA-Z0-9]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim() || "News & Analysis";

  return {
    categoryName: displayName,
    categoryColor: "bg-[#EEEEEE]",
    infoBoxText: `Digital Journal's ${displayName} coverage brings you breaking reporting, objective analysis, and global field dispatches.\nOur newsroom verifies facts, tracks market movements, and reports independent stories with real impact.`,
    featured: {
      category: `${displayName.toUpperCase()} • VERIFIED REPORTING`,
      title: `Global policy & market dynamics shape the future of ${displayName}`,
      description: "Independent analysis and verified reporting on key regulatory, economic, and technological policy changes shaping global industry.",
      image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=1200&h=800&fit=crop",
      author: "Lisa Chen",
      date: "July 16, 2026"
    },
    secondaryArticles: [
      {
        title: `International consensus reached on key ${displayName.toLowerCase()} standards`,
        image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=150&h=150&fit=crop",
        date: "July 16, 2026"
      },
      {
        title: "Cross-border data and trade frameworks approved for multinational enterprises",
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=150&h=150&fit=crop",
        date: "July 15, 2026"
      },
      {
        title: "Infrastructure scale & clean energy investments increase across major markets",
        image: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=150&h=150&fit=crop",
        date: "July 15, 2026"
      },
      {
        title: "Autonomous tracking and logistics networks expand deployment globally",
        image: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=150&h=150&fit=crop",
        date: "July 14, 2026"
      }
    ],
    guidesTitle: `${displayName.toUpperCase()} GUIDES & DEEP DIVES`,
    guidesDescription: `Comprehensive guides and strategic analysis for ${displayName}.`,
    guides: [
      {
        title: `A journalist's guide to verifying digital ${displayName.toLowerCase()} reports`,
        description: "Verification techniques for digital media including metadata analysis, geographic cross-referencing...",
        author: "By Jane Smith • July 15, 2026"
      },
      {
        title: "How to read and interpret complex statistical research papers",
        description: "A methodology to evaluate researcher biases, sample size bounds, and correlation errors in public papers...",
        author: "By Sarah Miller • July 15, 2026"
      },
      {
        title: "Understanding public policy impact on engineering and financial standards",
        description: "How new laws regarding data residency, privacy, and carbon output modify industrial code templates...",
        author: "By David Chen • July 15, 2026"
      },
      {
        title: "Best practices for data collection and public interest reporting",
        description: "Guidelines for secure leaks databases, protecting sources, and verifying corporate document breaches...",
        author: "By Jennifer Abbott • July 15, 2026"
      }
    ],
    newsTitle: `${displayName.toUpperCase()} DISPATCHES`,
    newsDescription: `The latest stories, breaking updates, and features in ${displayName}.`,
    newsArticles: [
      {
        title: `Key breakthroughs reported across international ${displayName.toLowerCase()} sectors`,
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop",
        description: "Analysts highlight major performance benchmarks achieved in ongoing field trials.",
        date: "July 16, 2026"
      },
      {
        title: "Regulatory agencies publish updated guidelines for corporate governance",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop",
        description: "Compliance requirements take effect across North America and European trading hubs.",
        date: "July 15, 2026"
      },
      {
        title: "Venture capital funding surges into high-impact early-stage research ventures",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=200&fit=crop",
        description: "Investors back novel frameworks targeting industrial automation and clean energy infrastructure.",
        date: "July 15, 2026"
      },
      {
        title: "Global summit highlights sustainable infrastructure expansion targets",
        image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=300&h=200&fit=crop",
        description: "Government representatives commit to joint research initiatives and shared technology standards.",
        date: "July 14, 2026"
      }
    ]
  };
}
