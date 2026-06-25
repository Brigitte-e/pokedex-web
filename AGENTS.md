<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, caching behavior, routing, and file structure may all differ from your training data.

Before writing or changing any Next.js code:
- Check the installed Next.js version in `package.json`.
- Read the relevant guide in `node_modules/next/dist/docs/`.
- Follow the docs for this exact installed version.
- Heed deprecation notices.
- Do not rely only on training data for Next.js APIs.
<!-- END:nextjs-agent-rules -->

# Project conventions

- Use TypeScript-safe code.
- Prefer Server Components by default.
- Use Client Components only when hooks, browser APIs, or interactivity are needed.
- Follow the existing project structure.
- Do not introduce new libraries unless necessary.

# Frontend review rules

When reviewing frontend code:
- Check React and Next.js performance.
- Look for unnecessary Client Components.
- Check unnecessary re-renders.
- Check incorrect `useEffect` usage.
- Check bundle size impact.
- Check accessibility: semantic HTML, labels, keyboard navigation, focus states.
- Check loading, error, and empty states.
- Check responsive behavior.
- Check dark mode/theming if relevant.
- Prefer small, composable components.

# Frontend testing rules

When writing or reviewing tests:
- Prefer React Testing Library for component behavior tests.
- Test user-visible behavior, not implementation details.
- Prefer `userEvent` over `fireEvent` for real user interactions.
- Add tests for loading, error, empty, and success states.
- Mock network requests at the boundary.
- For Next.js App Router, be careful with Server Components and Client Components.
- Use Playwright for end-to-end flows.
- Use Vitest or Jest according to the existing project setup.
- Do not introduce a new test framework unless the project has none.
- Before adding tests, inspect `package.json` to see what testing tools already exist.