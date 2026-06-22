/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />

declare global {
  interface Window {
    api: {
      deleteProduct(id: number): unknown;
      getProducts(): unknown;
      addProduct: (name: string, description: string, price: number) => Promise<void>;
    };
  }
}
export {};