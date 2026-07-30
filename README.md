<div style="text-align: center;">

<img src="public/images/coreverse-engine-emblem.svg" width=" 250" alt ="Logo" >

# Coreverse Website

**The official website for the Coreverse ecosystem.**

A modern, multilingual, open-source website built with **Next.js**, **React**, **TypeScript**, and **Tailwind CSS**.

Designed for speed, accessibility, scalability, and an exceptional developer experience.

<p>

<img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js"/>
<img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React"/>
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript"/>
<img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwindcss" alt="Tailwind CSS"/>
<img src="https://img.shields.io/badge/Open_Source-❤-brightgreen" alt="Open Source"/>
<img src="https://img.shields.io/github/license/KING-MASTER2012/Coreverse-Website" alt="GitHub License"/>

</p>

</div>

---

# ✨ Overview

Coreverse Website is the official web platform of the **Coreverse** ecosystem.

It serves as the central hub for:

- 🚀 Engine announcements
- 📥 Downloads
- 🌍 Documentation
- 👥 Community
- 🔐 Authentication
- 📢 News & Updates
- 💙 Open-source collaboration

The project is built with a strong focus on:

- Performance
- Scalability
- Accessibility
- Security
- Maintainability
- Responsive Design

---

# 🚀 Features

- 🌍 Internationalization (i18n)
- ⚡ Next.js App Router
- 🎨 Modern UI
- 📱 Fully Responsive
- 🌙 Dark Theme
- 🔒 Authentication System
- ☁️ Supabase Integration
- 🎬 Interactive Videos
- 🧩 Modular Components
- 🔥 Optimized Performance
- ♿ Accessibility-first
- 🌐 SEO-friendly

---

# 🌍 Supported Languages

| Language                 | Status  |
|:-------------------------|:--------|
| 🇺🇸 English             | ✅       |
| 🇹🇷 Turkish             | ✅       |
| 🇫🇷 French              | ✅       |
| 🇩🇪 German              | ✅       |
| 🇪🇸 Spanish             | ✅       |
| 🇵🇹 Portuguese          | ✅       |
| 🇷🇺 Russian             | ✅       |
| 🇨🇳 Simplified Chinese  | ✅       |
| 🇯🇵 Japanese            | ✅       |
| 🇰🇷 Korean              | ✅       |
| 🇵🇱 Polish              | ✅       |
| 🇮🇳 Hindi               | ✅       |
| 🇸🇦 Arabic              | ✅       |

---

# 🛠️ Technology Stack

| Technology     | Purpose                  |
|:---------------|:-------------------------|
| Next.js        | React Framework          |
| React          | UI Library               |
| TypeScript     | Type Safety              |
| Tailwind CSS   | Styling                  |
| next-intl      | Localization             |
| Supabase       | Backend & Authentication |
| GitHub Actions | CI/CD                    |
| ESLint         | Code Quality             |

---

# 📂 Project Structure

```text
coreverse-website
├── .github
│   ├── ISSUE_TEMPLATE
│   ├── workflows
│   ├── CODE_OF_CONDUCT.md
│   ├── CONTRIBUTING.md
│   ├── SECURITY.md
│   ├── FUNDING.yml
│   └── ...
│
├── public
│   ├── fonts
│   ├── images
│   └── videos
│
├── src
│   ├── app
│   ├── components
│   ├── features
│   ├── hooks
│   ├── i18n
│   ├── lib
│   ├── services
│   ├── supabase
│   └── utils
│
├── AGENTS.md
├── CLAUDE.md
├── PROGRESS.md
├── package.json
└── README.md
```

---

# 🏗️ Architecture

```text
Browser
    │
    ▼
Next.js App Router
    │
    ├───────────────┐
    ▼               ▼
UI Components   API Routes
    │               │
    ▼               ▼
Feature Layer   Authentication
    │               │
    └───────┬───────┘
            ▼
       Supabase Backend
```

---

# 🎬 Included Media

The repository includes:

- 🎥 Intro Videos
- 🎮 Engine Showcase
- 🎨 Renderer Preview
- ⚙️ Physics Demo

Located inside:

```text
public/videos/
```

---

# 📦 Installation

Clone the repository:

```bash
git clone [https://github.com/KING-MASTER2012/Coreverse-Website.git](https://github.com/KING-MASTER2012/Coreverse-Website.git)
```

Move into the project:

```bash
cd coreverse-website
```

Install dependencies:

```bash
npm install
```

Create:

```text
.env.local
next-env.d.ts
```

Example:

```env
# Supabase (Client)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
# Supabase (Server)
SUPABASE_PASSWORD=
SUPABASE_SECRET_KEY=
DATABASE_URL=
# Brevo
BREVO_API_KEY=
BREVO_SMTP_KEY=
BREVO_SMTP_LOGIN=
BREVO_SENDER_EMAIL=
BREVO_SENDER_NAME=
# App
NEXT_APP_URL=

```

Start Development:

```bash
npm run dev
```
or Start Host Development:
```bash
npm run dev:host
```
Open:

```
http://localhost:3000
```
or
```
http://192.168.1.130:3000
```

---

# 📜 Available Scripts

| Command                 | Description               |
|:------------------------|:--------------------------|
| npm run dev             | Development server        |
| npm run dev:host        | Host development server   |
| npm run build           | Production build          |
| npm run start           | Production server         |
| npm run lint            | Run ESLint                |
| npm run typecheck       | Testing if the code works |

---

# 🤝 Contributing

We welcome contributions from everyone!

Before contributing, please read:

- 📖 CONTRIBUTING.md
- 🛡️ CODE_OF_CONDUCT.md
- 🔒 SECURITY.md

Please:

- ⭐ Star the repository
- 🍴 Fork it
- 🌿 Create a feature branch
- 💬 Open a Pull Request

---

# 🐛 Issue Templates

GitHub Issue Forms are included for:

- 🐞 Bug Reports
- ✨ Feature Requests

Please use them whenever possible.

---

# 🔀 Pull Requests

A Pull Request template is included to help contributors provide all necessary information.

Every PR is automatically checked using GitHub Actions.

---

# ⚙️ GitHub Automation

The repository includes:

- ✅ CI Workflow
- 🚀 Deploy Workflow
- 🔍 CodeQL Analysis
- 📦 Dependabot Updates
- 💰 GitHub Sponsors
- 📝 Issue Forms
- 🔀 Pull Request Template

Everything inside the `.github` directory is configured to provide a smooth open-source workflow.

---

# 🛣️ Roadmap

Current development focuses on:

- 🚀 Website Improvements
- 🌍 Additional Translations
- 🎨 UI Enhancements
- 📱 Better Mobile Experience
- ⚡ Performance Optimizations
- 🔒 Authentication Improvements
- 📚 Documentation Expansion

See **PROGRESS.md** for ongoing development.

---

# ❤️ Open Source

Coreverse Website is completely open source.

We appreciate every contribution, including:

- Code
- Documentation
- Bug Reports
- Feature Requests
- Translations
- Design Improvements

Every contribution helps improve the Coreverse ecosystem.

---

# 📄 License

Licensed under the GNU General Public License v3.0(GPL-3.0).

See **LICENSE** for more information.

---

<div style="text-align: center;">

## ⭐ Support the Project

If you enjoy Coreverse Website, please consider giving the repository a **star**.

It helps the project grow and reach more developers.

Thank you! 💙

</div>
