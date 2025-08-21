/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly BASE_URL?: string;
}
interface ImportMeta { readonly env: ImportMetaEnv; }
declare module "*.ttf?url" { const src: string; export default src; }
