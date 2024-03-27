/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vite-plugin-terminal/client" />

interface Window {
  wasm_trace: (level: string, target: string, msg: string) => void;
}