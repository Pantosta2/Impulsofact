// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

const api = {
    addProduct: (Nombre: string, Descripcion: string, Precio: number) =>
      ipcRenderer.invoke('product:add', Nombre, Descripcion, Precio),
    updateProduct: (ProductID: number, Nombre: string, Descripcion: string, Precio: number) =>
      ipcRenderer.invoke('update-product', ProductID, Nombre, Descripcion, Precio),
    deleteProduct: (ProductID: number) => ipcRenderer.invoke('product:delete', ProductID),
    getProducts: () => ipcRenderer.invoke('product:get')
};

contextBridge.exposeInMainWorld('api', api);