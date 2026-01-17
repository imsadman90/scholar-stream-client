<!-- Repository: scholar-stream-client -->

# Copilot instructions for scholar-stream-client

Purpose: give AI coding agents the minimal, actionable knowledge to be productive in this React + Vite project.

- Project type: Vite + React (React 19) single-page app. Entry: `src/main.jsx`.
- Router: `react-router` v7 with route definitions in `src/routes/Routes.jsx` (uses `PrivateRoute`, `AdminRoutes`, `ModeratorRoute`).
- State & data fetching: `@tanstack/react-query` configured in `src/main.jsx` (note: `refetchOnWindowFocus: false`, `retry: 1`, `staleTime` / `cacheTime`). Follow existing Query patterns.
- Auth: Firebase Authentication is used in `src/contexts/AuthProvider.jsx` and `src/firebase/firebase.config.js`. Sign-in flows save users to the backend at `${import.meta.env.VITE_API_URL}/users` (see `saveUserToDatabase`). Important: `updateUserProfile` updates Firebase only — backend user record is NOT updated by that function.
- Environment: runtime config uses Vite env vars `import.meta.env.VITE_*` (e.g. `VITE_API_URL`, `VITE_apiKey`, etc.). When adding secrets locally, use a `.env` with `VITE_` prefixed names.
- Backend/API: client-side calls sometimes use `fetch` directly (see `AuthProvider.jsx`) and there is a `src/hooks/useAxiosSecure.jsx` for secure axios usage — prefer project patterns for API requests.
- UI & styling: Tailwind + DaisyUI are used (`tailwindcss` + `daisyui` plugin via Vite). See `vite.config.js` for plugin setup.
- Payments & integrations: Stripe libs included (`@stripe/react-stripe-js`, `@stripe/stripe-js`) and payment pages/components are in `src/components/Payment` and routes under `/dashboard/payment-page/:id`.

Conventions & patterns to follow

- Follow existing React component structure under `src/components/*` (Dashboard partitioned into `admin`, `moderator`, `student`, `Common`). Add new dashboard pages under the appropriate subfolder.
- Route protection: wrap components with `PrivateRoute`, and for role-restricted pages nest inside `AdminRoutes` or `ModeratorRoute` as shown in `src/routes/Routes.jsx`.
- Query usage: rely on the global QueryClient defaults in `src/main.jsx`. Keep queries idempotent and respect `staleTime` to avoid unnecessary refetches.
- Auth side effects: when authentication changes, `AuthProvider` writes users to `${VITE_API_URL}/users`. If you add new user fields, update both `saveUserToDatabase` and backend expectations.
- Error/notification pattern: project uses `react-hot-toast` with a global `Toaster` configured in `src/main.jsx`. Use `toast.success/error(...)` to follow UX patterns.

Developer workflows (commands)

- Start dev server: `npm run dev` (runs `vite`).
- Build: `npm run build`.
- Preview production build: `npm run preview`.
- Lint: `npm run lint`.

Quick facts for edits and debugging

- To inspect runtime env values, log `import.meta.env.VITE_API_URL` in a component or open browser devtools (Vite injects env vars at build time).
- If changing authentication flows, check both `src/contexts/AuthProvider.jsx` and `src/firebase/firebase.config.js` (Firebase config uses `VITE_` vars).
- React Router v7 differences: routes use `createBrowserRouter` and element-based nested routes — check `src/routes/Routes.jsx` before adding new routes.
- Query caching: tests or debug sessions may be affected by `staleTime` / `cacheTime` — reduce them temporarily if you need immediate refetch behavior.

Files to inspect first when working on features

- `src/main.jsx` — QueryClient and Toaster global setup
- `src/contexts/AuthProvider.jsx` — Firebase sign-in, saving users to backend
- `src/firebase/firebase.config.js` — Firebase env vars
- `src/routes/Routes.jsx` — routing and protection patterns
- `src/hooks/useAxiosSecure.jsx` — project axios wrapper for secure API calls

If you see missing tests or inconsistent behavior

- This repository currently does not expose test scripts. Prefer running the app (`npm run dev`) and exercising flows in the browser. Keep changes small and run `npm run lint` before PRs.

Notes about existing AI-agent docs search

- No existing `.github/copilot-instructions.md` or AGENT docs were found in the repo at the time this file was created; this file is the first repo-specific guidance for coding agents.

Please review and tell me if you want more detail in any area (routing, auth flows, backend contract, or query usage).
