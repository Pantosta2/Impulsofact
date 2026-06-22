import { app } from 'electron';
import path from 'node:path';
import Database from 'better-sqlite3';



class AppDatabase {
    db: Database.Database;
    
    constructor(){
        const dbPath = path.join(app.getPath('userData'), 'impulso.sqlite');
        this.db = new Database(dbPath);
        this.db.pragma('journal_mode = WAL');
        this.setUpDatabase();
    }
    setUpDatabase() {
        this.db.exec( `
            CREATE TABLE IF NOT EXISTS Products (
                ProductID INTEGER PRIMARY KEY AUTOINCREMENT,
                Nombre TEXT NOT NULL,
                Descripcion TEXT,
                Precio INTEGER NOT NULL
            )
        `);
        console.log('Database setup complete');
    }
    // -------------- Tabla de Productos --------------
    addProduct(Nombre: string, Descripcion: string, Precio: number) {
        const stmt = this.db.prepare('INSERT INTO Products (Nombre, Descripcion, Precio) VALUES (?, ?, ?)');
        const info = stmt.run(Nombre, Descripcion, Precio);
        return info.lastInsertRowid;
    }
    deleteProduct(ProductID: number) {
        const stmt = this.db.prepare('DELETE FROM Products WHERE ProductID = ?');
        stmt.run(ProductID);
    }
    getAllProducts() {
        const stmt = this.db.prepare('SELECT * FROM Products');
        return stmt.all();
    }
    close() {        
        this.db.close();
        console.log('Database closed');
    }
}

export default AppDatabase;