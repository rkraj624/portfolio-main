export const PORTFOLIO_DATA = {
  "personal": {
    "name": "Ravi Raja",
    "title": "Senior Backend Engineer",
    "tagline": "Building high-throughput microservices & distributed Java systems at scale.",
    "location": "India",
    "email": "iamravikishanraj@gmail.com",
    "phone": "+91 6302028752",
    "linkedin": "https://linkedin.com/in/ravi-kishan-raj",
    "github": "https://github.com/rkraj624",
    "leetcode": "https://leetcode.com/rkraj624",
    "avatarUrl": "/avatar.jpg",
    "resumeUrl": "/Ravi_Raja_Resume_2026.pdf",
    "stats": [
      {
        "label": "Years Experience",
        "value": "3.7+"
      },
      {
        "label": "Latency Reduction",
        "value": "65%"
      },
      {
        "label": "Failure Reduction",
        "value": "60%"
      }
    ]
  },
  "summary": "Senior Backend Engineer with 3.7+ years building high-throughput Java systems at scale. Specialised in microservices, distributed systems, and performance engineering. Experienced in end-to-end architecture ownership, technical decision-making, and mentoring. Seeking SSE roles where scalability and reliability are core.",
  "skills": [
    {
      "category": "Languages",
      "items": [
        "Java",
        "JavaScript",
        "SQL"
      ]
    },
    {
      "category": "Frameworks & Security",
      "items": [
        "Spring Boot",
        "Spring MVC",
        "Spring Security",
        "REST APIs",
        "JPA",
        "Hibernate",
        "JWT",
        "OAuth"
      ]
    },
    {
      "category": "Cloud & DevOps",
      "items": [
        "AWS (IAM, VPC)",
        "Kubernetes",
        "Docker",
        "Jenkins"
      ]
    },
    {
      "category": "Messaging & Caching",
      "items": [
        "Apache Kafka",
        "Kafka Streams",
        "Redis"
      ]
    },
    {
      "category": "Databases",
      "items": [
        "MySQL",
        "PostgreSQL",
        "DynamoDB",
        "Amazon Redshift"
      ]
    },
    {
      "category": "Architecture & CS",
      "items": [
        "Microservices",
        "Saga Pattern",
        "Event-Driven Architecture",
        "Distributed Locking",
        "Low-Level Design (LLD)",
        "High-Level Design (HLD)",
        "DSA (750+ Solved)"
      ]
    }
  ],
  "experience": [
    {
      "company": "Salescode.AI",
      "role": "Senior Software Engineer",
      "period": "Jan 2023 – Jul 2026",
      "techStack": [
        "Java",
        "Spring Boot",
        "Kafka",
        "MySQL",
        "Redis"
      ],
      "highlights": [
        "Led end-to-end backend engineering across 3+ production services for large-scale enterprise clients (Bepensa / Coca-Cola Mexico, Mars Sampling), owning architecture, core development, and production deployments.",
        "Defined API contracts and service boundaries for new microservices, collaborating with product and frontend teams to align technical design with business requirements.",
        "Maintained 100% production stability across payment, order, and rewards domains under concurrent high-traffic conditions."
      ]
    }
  ],
  "keyProjects": [
    {
      "title": "Bepensa — Credit Management & Orders",
      "client": "Coca-Cola Mexico",
      "description": "Enterprise backend architecture for credit management and order processing under high concurrency.",
      "tags": [
        "Java",
        "Spring Boot",
        "Saga Pattern",
        "Async REST",
        "Microservices"
      ],
      "metrics": [
        "Architected Credit Management using the Saga pattern for distributed transaction handling, reducing operational failures by 60% with graceful recovery.",
        "Designed async non-blocking RESTful APIs over synchronous calls, cutting average response time by 20% and preventing cascading failures."
      ]
    },
    {
      "title": "Reward Service Engine",
      "client": "Salescode.AI Core Platform",
      "description": "Modular microservices-based reward platform designed from scratch for high throughput and fault isolation.",
      "tags": [
        "Microservices",
        "Redis Caching",
        "Real-Time Alerting",
        "Slack API",
        "Java"
      ],
      "metrics": [
        "Handled 40,000+ requests/day with high availability and complete fault isolation.",
        "Architected a Redis caching strategy (TTL + eviction policies), reducing processing latency by 65% under peak traffic.",
        "Built real-time anomaly detection and Slack alerting, reducing incident response time by 40%."
      ]
    },
    {
      "title": "Mars Sampling — Payments & Redemptions",
      "client": "Mars Sampling",
      "description": "Distributed payment integration & redemption system solving concurrency and multi-node race conditions.",
      "tags": [
        "PAYTM API",
        "Qwikcilver",
        "Redis Distributed Locks",
        "Idempotence"
      ],
      "metrics": [
        "Integrated PAYTM and Qwikcilver behind a unified abstraction layer, enabling seamless future provider additions.",
        "Resolved payment race conditions across a multi-node environment via distributed locking with Redis, guaranteeing idempotent transaction execution for 10,000+ active users."
      ]
    }
  ],
  "personalProjects": [
    {
      "name": "SpringShield",
      "tagline": "Production-Grade JWT Authentication & Authorization System",
      "tech": [
        "Spring Boot",
        "Spring Security",
        "JPA",
        "MySQL",
        "Maven"
      ],
      "github": "https://github.com/rkraj-portfolio/SpringShield",
      "features": [
        "Implemented RBAC and method-level security protecting 10+ REST endpoints.",
        "Full refresh token lifecycle (issuance, rotation, revocation), reducing repeated login requests by 30%.",
        "Engineered concurrent session handling with consistent token validation across simultaneous user sessions."
      ]
    },
    {
      "name": "New Personal Project",
      "tagline": "Open source system / tool description",
      "github": "https://github.com/rkraj-portfolio",
      "tech": [
        "Java",
        "Spring Boot",
        "React"
      ],
      "features": [
        "Feature 1: Scalable authentication and session lifecycle."
      ]
    }
  ],
  "achievements": [
    {
      "title": "Lead Performer Award",
      "issuer": "Salescode.AI",
      "date": "July 2023",
      "description": "Recognised for consistently delivering high-impact backend features and driving project execution excellence."
    },
    {
      "title": "Best International Project of the Year",
      "issuer": "Salescode.AI / Enterprise Client",
      "date": "2024",
      "description": "Awarded for outstanding engineering quality and on-time delivery of the Bepensa (Coca-Cola Mexico) enterprise project."
    }
  ],
  "education": {
    "institution": "DR BC ROY Engineering College",
    "degree": "B.Tech in Computer Science & Engineering",
    "period": "Jun 2018 – Jul 2022",
    "location": "Durgapur, West Bengal",
    "gpa": "8.8 / 10"
  },
  "customSections": []
};
