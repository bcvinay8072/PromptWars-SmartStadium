# 🏆 Nexus26 — AI-Powered Smart Stadium Experience for FIFA World Cup 2026

**Nexus26** is a GenAI-enabled Smart Stadium assistant that enhances the FIFA World Cup 2026 experience by providing real-time AI-driven fan guidance, accessible navigation, and operational intelligence for venue staff.

---

## 🔗 Live Links

| Resource | URL |
|:---------|:----|
| **Live App** | [https://prompt-wars-smart-stadium-three.vercel.app/](https://prompt-wars-smart-stadium-three.vercel.app/) |
| **GitHub Repo** | [https://github.com/bcvinay8072/PromptWars-SmartStadium](https://github.com/bcvinay8072/PromptWars-SmartStadium) |

---

## 🎯 Chosen Vertical & Problem Statement

**Vertical:** Smart Stadiums & Tournament Operations (Challenge 4)

### Problem
FIFA World Cup stadiums host 80,000+ fans with diverse needs — navigation, accessibility, food discovery, transport coordination — while staff must manage crowd flow, incidents, and resources in real-time. Current solutions are fragmented and non-intelligent.

### Approach & Logic

Our solution follows a **3-pillar architecture**: Understand → Assist → Operate.

1. **Understand (AI Comprehension):** Every user query is sanitized, rate-limited, and routed through a secure server-side proxy (`/api/chat`) to an OpenAI-compatible LLM. The system prompt is dynamically tailored based on the user's role (fan or staff), ensuring contextually relevant responses.

2. **Assist (Fan Portal):** Fans interact with a mobile-first AI assistant that provides:
   - Real-time stadium navigation (restrooms, food courts, first aid, gates)
   - Accessibility-first routing (wheelchair paths, sensory rooms, service elevators)
   - Live transport integration (metro schedules, shuttle status, parking availability)
   - Multilingual support through LLM language detection

3. **Operate (Staff Command):** Venue staff access a real-time operational dashboard featuring:
   - Live telemetry metrics (attendance, gate wait times, active incidents)
   - AI-powered intelligence for crowd flow prediction and incident classification
   - Resource allocation recommendations (medical staff, equipment positioning)

**Data Flow:** `User Input → Client Sanitization → Rate Limiter → Server Proxy → Server Sanitization → AI Provider → Response Sanitization → Client Render`

When the AI API is unavailable, the system gracefully degrades to a comprehensive mock response engine that provides accurate stadium telemetry data (parking availability, gate wait times, facility locations), ensuring the app remains functional without external dependencies.

---

## 🤔 Assumptions

- Stadiums provide live telemetry data (attendance, wait times, gate status) via REST APIs — simulated in this prototype using realistic mock data in `lib/constants.ts`.
- High-density connectivity (5G/Wi-Fi 6) is available inside the venue to support real-time LLM inference with acceptable latency.
- The AI Pipe proxy handles LLM routing and load balancing, abstracting the underlying model provider.
- Users primarily interact via mobile devices; the UI is optimized for portrait viewports.
- Stadium staff have dedicated devices with persistent connectivity for operational dashboards.

---

## 🛠️ Technical Stack

| Category | Technology |
|:---------|:-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript (Strict Mode, zero `any`) |
| **Styling** | Vanilla CSS (Custom Properties, zero inline styles) |
| **AI Integration** | OpenAI-compatible models via AI Pipe Proxy |
| **Unit Testing** | Jest + React Testing Library |
| **E2E Testing** | Playwright (Chromium) |
| **CI/CD** | GitHub Actions (lint → typecheck → test → build) |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```text
nexus26/
├── .github/workflows/ci.yml    # CI pipeline: ESLint + TypeScript + Jest + Build
├── app/
│   ├── api/chat/route.ts        # Secure server-side AI proxy with rate limiting
│   ├── globals.css              # Complete design system (CSS custom properties)
│   ├── layout.tsx               # Root layout with ErrorBoundary + skip navigation
│   └── page.tsx                 # Landing page with dual-persona role selection
├── components/
│   ├── __tests__/               # Co-located component unit tests
│   ├── ChatInterface.tsx        # Accessible real-time AI chat (React.memo)
│   ├── ErrorBoundary.tsx        # React error recovery with retry functionality
│   ├── FanDashboard.tsx         # Fan portal: navigation, transport, AI assistant
│   └── StaffDashboard.tsx       # Staff portal: metrics, incidents, AI intelligence
├── e2e/
│   └── app.spec.ts              # Playwright E2E: full fan + staff user journeys
├── hooks/
│   ├── __tests__/               # Hook unit tests
│   └── useLocalStorage.ts       # Persistent state hook with SSR safety
├── lib/
│   ├── __tests__/               # Utility unit tests
│   ├── constants.ts             # Centralized constants, prompts, mock telemetry
│   ├── rateLimiter.ts           # Token bucket rate limiter (10 tokens, 2s refill)
│   └── utils.ts                 # Input sanitization (XSS prevention)
├── .eslintrc.json               # Strict ESLint: no-console, no-any, no-unused-vars
├── tsconfig.json                # TypeScript strict mode with all safety flags
├── jest.config.ts               # Jest + next/jest with v8 coverage
├── playwright.config.ts         # E2E config with dev server auto-start
└── README.md                    # This file
```

---

## 🔒 Security Features

- **Server-side AI Proxy** — API keys are stored exclusively in `.env` and never exposed to the client. All LLM calls route through the secure `app/api/chat/route.ts` endpoint.
- **Defense-in-Depth Input Sanitization** — All user inputs are sanitized on both the client (`lib/utils.ts`) and server (`route.ts`) using regex filters that strip HTML tags, `javascript:` protocols, `on*=` event handlers, and `data:` URIs.
- **Token Bucket Rate Limiting** — A configurable rate limiter (`lib/rateLimiter.ts`) prevents API abuse with a 10-token bucket that refills every 2 seconds.
- **Input Length Enforcement** — All inputs are truncated to 1,000 characters maximum.
- **Method Validation** — The server route only accepts POST requests; all other methods are rejected.
- **Secure Error Handling** — Internal errors and stack traces are never exposed to the client.
- **Strict Secrets Management** — `.env` is in `.gitignore` since before the first commit. `.env.example` is provided as a configuration template.

---

## ♿ Accessibility Features

- **Semantic HTML** — Full use of `<main>`, `<header>`, `<nav>`, `<section>`, `<footer>`, and `<aside>` elements.
- **ARIA Roles & Live Regions** — Chat log uses `role="log"` with `aria-live="polite"`. Status updates use `role="status"`. Toggle buttons implement `aria-pressed`.
- **Skip Navigation** — A `.skip-link` allows keyboard and screen reader users to bypass navigation directly to `#main-content`.
- **Keyboard Navigation** — All interactive elements are focusable with visible focus rings (`outline: 2px solid`) on `:focus-visible`.
- **Screen Reader Labels** — Every button, input, and section has explicit `aria-label` or `aria-labelledby` attributes.
- **Visually Hidden Headings** — Section headings are present for screen readers but visually hidden using the `.visually-hidden` utility.

---

## ⚡ Performance Optimizations

- **Code Splitting** — `React.lazy()` with `<Suspense>` dynamically loads `ChatInterface` only when the user navigates to the chat tab.
- **Memoization** — All leaf components (`ChatInterface`, `FanDashboard`, `StaffDashboard`) are wrapped with `React.memo()` to prevent unnecessary re-renders.
- **useCallback / useMemo** — Event handlers and computed values are memoized to maintain referential stability.
- **Zero Runtime CSS** — Vanilla CSS with custom properties eliminates the overhead of CSS-in-JS runtime parsing.
- **CSS Containment** — Glass panels use `contain: content` to isolate layout and paint calculations.
- **Optimized Animations** — All animations use `transform` and `opacity` (GPU-composited properties) for smooth 60fps performance.
- **Font Optimization** — Google Fonts loaded with `display=swap` to prevent FOIT.

---

## 🧪 Testing

| Suite | Framework | Tests | Description |
|:------|:----------|:-----:|:------------|
| Page Tests | Jest + RTL | 4 | Landing page rendering, role selection, portal navigation |
| Layout Tests | Jest + RTL | 3 | Root layout, ErrorBoundary wrapper, metadata |
| ChatInterface | Jest + RTL | 8 | Message rendering, form submission, loading states, error handling |
| ErrorBoundary | Jest + RTL | 5 | Error catching, fallback UI, retry functionality |
| FanDashboard | Jest + RTL | 10 | Tab navigation, navigation grid, transport data, occupancy |
| StaffDashboard | Jest + RTL | 8 | Metrics display, status indicators, tab switching, AI tab |
| API Route | Jest (Node) | 4 | Rate limiting, validation, mock responses, sanitization |
| useLocalStorage | Jest | 3 | Get/set values, SSR safety, JSON parsing |
| Utils | Jest | 9 | XSS prevention, edge cases, HTML stripping |
| Rate Limiter | Jest | 7 | Token consumption, refill, boundary conditions |
| Constants | Jest | 3 | Prompt integrity, mock data structure validation |
| **E2E** | **Playwright** | **2** | **Full fan + staff user journey (Chromium)** |
| **Total** | | **66** | **11 unit suites + 1 E2E suite, ~86% statement coverage** |

```bash
npm test                   # Run unit tests
npm run test:coverage      # Run with coverage report
npm run test:e2e           # Run Playwright E2E tests
```

---

## 🚀 Running Locally

1. **Clone and install:**
   ```bash
   git clone https://github.com/bcvinay8072/PromptWars-SmartStadium.git
   cd nexus26
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Add your `AI_PIPE_URL`, `AI_PIPE_KEY`, and `AI_MODEL` to `.env`.

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Run tests:**
   ```bash
   npm test                # Unit tests
   npm run test:e2e        # E2E tests (starts dev server automatically)
   npm run test:coverage   # Coverage report
   ```

5. **Production build:**
   ```bash
   npm run build
   npm start
   ```
