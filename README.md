# 🏆 Nexus26 — Smart Stadiums & Tournament Operations

**Nexus26** is a GenAI-enabled Smart Stadium assistant built for the FIFA World Cup 2026. It enhances the stadium experience by providing multilingual fan assistance, accessible navigation, and real-time operational intelligence for venue staff.

## 🔗 Live Application
- **Vercel Deployment**: [Insert Vercel URL Here]

## 🎯 Chosen Vertical & Problem Statement
We target the **Smart Stadiums & Tournament Operations (Challenge 4)** vertical. 
Our approach centers on dual-persona empowerment:
1. **Fan Portal**: A mobile-first interface offering AI-driven assistance for finding seats, accessibility routes, and transport updates.
2. **Staff Command**: A real-time operations dashboard utilizing AI to process incident reports and predict crowd bottlenecks.

## 🤔 Assumptions
- Stadiums will provide live telemetry data (attendance, wait times) via REST APIs, simulated in this prototype.
- High-density connectivity (e.g., 5G/Wi-Fi 6) is available inside the venue to support real-time LLM inference.
- The AI proxy (AI Pipe) handles LLM routing and load balancing effectively.

## 🛠️ Technical Stack

| Category | Technology |
|:---------|:-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Vanilla CSS (CSS Custom Properties) |
| **AI Integration**| OpenAI models via AI Pipe Proxy |
| **Testing** | Playwright (E2E), Jest + RTL (Unit) |
| **Deployment** | Vercel |

## 📁 Project Structure

```text
nexus26/
├── .github/workflows/ci.yml # Automated linting & testing
├── app/
│   ├── api/chat/route.ts    # Secure server-side AI proxy
│   ├── globals.css          # Design system & utility classes
│   ├── layout.tsx           # Global ErrorBoundary wrapper
│   └── page.tsx             # Landing page with persona routing
├── components/
│   ├── __tests__/           # Co-located component unit tests
│   ├── ChatInterface.tsx    # Accessible AI chat component
│   ├── ErrorBoundary.tsx    # React error recovery
│   ├── FanDashboard.tsx     # Fan-facing UI
│   └── StaffDashboard.tsx   # Staff-facing UI
├── e2e/                     # Playwright E2E tests
├── hooks/                   # Custom React hooks (e.g., useLocalStorage)
├── lib/                     # Utilities (Rate Limiter, Sanitization)
└── [Config Files]           # ESLint, TypeScript, Jest, Playwright configs
```

## 🔒 Security Features
- **Server-side AI Proxy**: API keys are never exposed to the client; all LLM calls route through `app/api/chat`.
- **Defense in Depth Sanitization**: All user inputs AND AI outputs are sanitized using custom regex filters (stripping HTML, `javascript:`, event handlers).
- **Rate Limiting**: A strict Token Bucket algorithm implemented in `lib/rateLimiter.ts` prevents API abuse.
- **Strict Secrets Management**: `.env` is explicitly ignored, and `.env.example` is committed as a template.

## ♿ Accessibility Features
- **Semantic HTML**: Extensive use of `<main>`, `<nav>`, `<section>`, `<aside>`, and `<header>`.
- **ARIA Roles**: Full implementation of `role="log"`, `aria-live="polite"`, `aria-pressed`, and `aria-labelledby`.
- **Keyboard Navigation**: A `.skip-link` is provided for screen readers, and all interactive elements are focusable.

## ⚡ Performance Optimizations
- **Zero JS Styling**: Used vanilla CSS instead of heavy runtime CSS-in-JS libraries.
- **Strict React Renders**: Isolated state within specific dashboard components to prevent unnecessary app-wide re-renders.

## 🧪 Testing

| Suite | Framework | Description |
|:------|:----------|:------------|
| **Unit Tests** | Jest + React Testing Library | Co-located tests verifying component logic and DOM rendering. |
| **E2E Tests** | Playwright | Full browser automation verifying the entire user journey. |

## 🚀 Running Locally

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Set up your environment variables by copying the example file:
   ```bash
   cp .env.example .env
   ```
   Add your `AI_PIPE_KEY` to `.env`.
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Run tests:
   ```bash
   npm test
   npm run test:e2e
   ```

## 🌐 Deploying to Vercel

The easiest way to deploy this Next.js application is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to a GitHub repository.
2. Import your repository into Vercel.
3. In the environment variables configuration during deployment, ensure you add:
   - `AI_PIPE_URL`
   - `AI_PIPE_KEY`
   - `AI_MODEL`
4. Click **Deploy**. Vercel will automatically detect the Next.js framework and handle the build output seamlessly.
