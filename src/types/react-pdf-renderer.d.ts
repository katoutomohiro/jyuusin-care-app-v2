// Minimal ambient module stub for optional @react-pdf/renderer dependency
// Added to satisfy typecheck without installing the package yet.
// When the real dependency is installed, this file can remain or be removed.
declare module '@react-pdf/renderer' {
  export const Font: { register: (...args: any[]) => void };
}
