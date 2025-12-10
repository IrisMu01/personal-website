export interface CSProject {
  id: string;
  title: string;
  tags: string[];
  description: string[];
  videoUrl?: string;
}

export interface MusicProject {
  id: string;
  title: string;
  tags: string[];
  imageUrl: string;
  audioUrl: string;
}

export const csProjects: CSProject[] = [
  {
    id: "cs1",
    title: "Mock Interview Multi-Agent Chatbot",
    tags: ["React", "Redux", "FastAPI", "Google ADK", "Vertex AI", "Terraform", "GCP"],
    description: [
      "Built a multi-agent AI chatbot to practice LeetCode-style interviews using Google Agent Development Kit.",
      "Simulated the white-boarding technical interview process by building sub-agents to generate Python test harness based on user-submitted solution and test cases, execute test harness, and generate feedback in natural English.",
      "Built the front-end as a single-page React application and deployed to GCP with Terraform.",
    ],
    videoUrl: "https://pub-18848117928e4ff497abec0a1725d007.r2.dev/mock_interview_bot_demo.mp4",
  },
  {
    id: "cs2",
    title: "Personal Website",
    tags: ["Claude Code", "WebGL",  "React"],
    description: [
      "Developed an interactive static website featuring custom WebGL implementations including a Navier-Stokes fluid particle simulation and real-time spectrum audio visualizers.",
      "Leveraged Figma Make for initial design prototyping, then utilized Claude Code for rapid iteration and refinement across multiple design variations.",
    ],
  },
];

export const musicProjects: MusicProject[] = [
  {
    id: "music1",
    title: "Dimensional Odyssey",
    tags: ["Hybrid Orchestral", "Cinematic"],
    imageUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    audioUrl: "https://pub-18848117928e4ff497abec0a1725d007.r2.dev/piece_1.wav",
  },
  {
    id: "music2",
    title: "Void Motifs",
    tags: ["Atmospheric Dubstep"],
    imageUrl: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    audioUrl: "https://pub-18848117928e4ff497abec0a1725d007.r2.dev/piece_2.wav",
  },
  {
    id: "music3",
    title: "Orchestra Practice",
    tags: ["Classical"],
    imageUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    audioUrl: "https://pub-18848117928e4ff497abec0a1725d007.r2.dev/piece_3.wav",
  },
  {
    id: "music4",
    title: "Rebirth in Destruction Reharmonization",
    tags: ["Jazz", "Game Music"],
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    audioUrl: "https://pub-18848117928e4ff497abec0a1725d007.r2.dev/piece_4.wav",
  },
  {
    id: "music5",
    title: "Weightless Paradise R&B mix",
    tags: ["R&B", "Game Music"],
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    audioUrl: "https://pub-18848117928e4ff497abec0a1725d007.r2.dev/piece_5.wav",
  },
];
