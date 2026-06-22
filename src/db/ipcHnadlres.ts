import { ipcMain } from "electron";

export default function setUpIpcHandlers(db: any) {
    ipcMain.handle('product:add', (_, Nombre, Descripcion, Precio) => {
        return db.addProduct(Nombre, Descripcion, Precio);
    });
    ipcMain.handle('product:delete', (_, ProductID) => {
        db.deleteProduct(ProductID);
    });
    ipcMain.handle('product:get', () => {
        return db.getAllProducts();
    });
}