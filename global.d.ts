declare global {
  interface ImportMetaEnv {
    readonly DEV?: boolean;
    readonly PROD?: boolean;
    // any VITE_ keys or custom envs
    [key: string]: any;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
