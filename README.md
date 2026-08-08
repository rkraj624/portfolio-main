<div align="center">

# ⚡ Ravi Raja — Senior Backend Engineer Portfolio

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A modern, sleek, and fully customizable portfolio application designed specifically for **Senior Backend Engineers** with a built-in live admin dashboard and direct disk file persistence.

[Live Demo](#-getting-started) • [Features](#-key-features) • [Dashboard](#-admin-dashboard-route) • [Tech Stack](#-technology-stack) • [Quick Start](#-getting-started)

---

</div>

## 🌟 Key Features

- 🎨 **Modern Dark Aesthetic**: Deep navy glassmorphism backdrop (`#090d16`), vibrant color gradients, and glowing accents.
- ⚡ **High Performance & Responsive**: Powered by React 18 & Vite with zero layout cumulative shift and responsive typography.
- 🎭 **Scroll-Driven Animations**: Smooth scroll-triggered reveal animations powered by **Framer Motion**.
- 🛠️ **Visual Skill Icons**: Categorized technology matrix featuring custom icons (☕ Java, 🍃 Spring Boot, ☸️ Kubernetes, 🐳 Docker, 🚀 Kafka, ⚡ Redis, 🐬 MySQL).
- 📱 **Dynamic Projects Showcase**: Separate grids for enterprise client projects (*Coca-Cola Mexico Bepensa*, *Mars Sampling*) and open-source personal repositories (*SpringShield*, *Developer Portfolio & Live CMS*).
- 📥 **Interactive Actions**: One-click email copying, resume downloading with celebration confetti (`canvas-confetti`), and social links.

---

## ⚙️ Admin Dashboard (`/dashboard`)

The application features a hidden, full-blown admin dashboard accessible via `/dashboard` that allows live editing of all portfolio contents without opening an editor!

```
/dashboard  ──► Live Form Controls  ──► POST /api/save-data  ──► Disk Update (src/data.js)
```

### Dashboard Capability Matrix

| Section | Capabilities |
| :--- | :--- |
| **Personal Info & Stats** | Update Name, Title, Bio, Email, Phone, and Hero Metric Cards (`Latency Reduction`, `Failure Reduction`, `Req/Day`) |
| **Work Experience** | Dynamically **Add / Delete / Edit** company work experience entries, tech stacks, and achievement bullet points |
| **Company Projects** | Dynamically **Add / Delete / Edit** enterprise client projects, metrics, and tags |
| **Personal Projects** | Dynamically **Add / Delete / Edit** open-source GitHub project cards, taglines, and feature lists |
| **Skills Matrix** | Edit skills categories & items |
| **Custom Sections** | Build **brand-new sections** on the fly (e.g. *Certifications*, *Speaking*, *Publications*) with custom card items and icons |
| **Direct Disk Sync** | Clicking **Apply Changes** triggers a custom Vite server plugin (`server/savePlugin.js`) that directly overwrites `src/data.js` |

---

## 🚀 Technology Stack

- **Frontend Core**: React 18, Vite 5, JavaScript (ES6+)
- **Styling & Aesthetics**: Tailwind CSS, Custom CSS Variables, Glassmorphism, Google Fonts (`Plus Jakarta Sans` & `JetBrains Mono`)
- **Animations & Icons**: Framer Motion, Lucide React, Canvas Confetti
- **Backend & Middleware**: Node.js filesystem API middleware integrated into Vite configuration for disk updates (`/api/save-data`)

---

## 📂 Project Architecture

```bash
portfolio-main/
├── public/
│   ├── avatar.jpg              # Profile picture
│   └── Ravi_Raja_Resume.pdf    # Resume PDF file
├── server/
│   └── savePlugin.js           # Custom Vite server plugin for saving to src/data.js
├── src/
│   ├── admin/
│   │   └── AdminDashboard.jsx  # Interactive live admin dashboard
│   ├── components/
│   │   ├── Header.jsx          # Top navigation bar
│   │   ├── Hero.jsx            # Hero banner & metric cards
│   │   ├── Experience.jsx      # Work experience timeline
│   │   ├── Projects.jsx        # Company & Personal project cards
│   │   ├── Skills.jsx          # Visual skills matrix with icons
│   │   ├── CustomSections.jsx  # Dynamic section renderer
│   │   ├── Achievements.jsx    # Honors & Education card
│   │   └── Footer.jsx          # Footer section
│   ├── config/
│   │   └── constants.jsx       # Animation variants & icon mappings
│   ├── data.js                 # Central source of truth data configuration
│   ├── App.jsx                 # Main layout & path routing (/ and /dashboard)
│   ├── index.css               # Global design tokens & CSS rules
│   └── main.jsx                # Application entrypoint
├── index.html                  # HTML template with Google Fonts
├── vite.config.js              # Vite config registered with server plugin
└── package.json
```

---

## 💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rkraj-portfolio/portfolio-main.git
   cd portfolio-main
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npx vite --port 3000
   ```

4. **Open in Browser**:
   - **Public Portfolio**: `http://localhost:3000/`
   - **Admin Dashboard**: `http://localhost:3000/dashboard`

---

## 📦 Production Build

To bundle the application for production:

```bash
npm run build
```

The optimized static files will be compiled into the `dist/` directory, ready to be deployed to Vercel, Netlify, or GitHub Pages.

---

<div align="center">

Developed with ❤️ for **Ravi Raja** — Senior Backend Engineer

</div>
