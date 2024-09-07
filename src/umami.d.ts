// src/umami.d.ts
export {};

declare global {
  interface Window {
    umami: {
      track: (event: string, data?: any) => void;
    };
  }
}