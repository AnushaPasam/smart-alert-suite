interface ImportMetaEnv {
  readonly VITE_APP_PANEL?: "admin" | "user" | "announcer" | "principal";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
