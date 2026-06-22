// Test stub for `server-only` / `client-only`. These packages intentionally
// throw when resolved in the "wrong" environment; under vitest's jsdom we just
// want them to be no-ops so server modules can be unit-tested directly.
export {};
