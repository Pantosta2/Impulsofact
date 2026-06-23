import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';

export default function Products() {
  // Asegúrate de agregar 'updateProduct' a la desestructuración de tu hook useProducts
  const { products, loading, error, addProduct, deleteProduct, updateProduct } = useProducts();
  
  // Estados de los inputs
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [message, setMessage] = useState('');

  // 🚀 NUEVOS ESTADOS: Para controlar el modo edición
  const [editingId, setEditingId] = useState<number | null>(null);

  // Al hacer clic en Editar, cargamos los datos del producto en los inputs
  const handleEditClick = (product: any) => {
    setEditingId(product.ProductID);
    setProductName(product.Nombre);
    setProductDescription(product.Descripcion ?? '');
    setProductPrice(product.Precio.toString());
  };

  // Cancelar el modo edición y vaciar campos
  const handleCancelEdit = () => {
    setEditingId(null);
    setProductName('');
    setProductDescription('');
    setProductPrice('');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = productName.trim();
    const description = productDescription.trim();
    const price = parseFloat(productPrice.trim() || '0');

    if (!name || !description || Number.isNaN(price)) {
      setMessage('Por favor, completa todos los campos correctamente.');
      return;
    }

    try {
      if (editingId !== null) {
        await updateProduct(editingId, name, description, price);
        setMessage('Producto actualizado exitosamente!');
        setEditingId(null);
      } else {
        await addProduct(name, description, price);
        setMessage('Producto agregado exitosamente!');
      }

      setProductName('');
      setProductDescription('');
      setProductPrice('');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage(`No se pudo ${editingId ? 'actualizar' : 'agregar'} el producto. Por favor, inténtalo de nuevo.`);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('¿Eliminar este producto?')) return;

    try {
      await deleteProduct(id);
      if (editingId === id) handleCancelEdit();
    } catch {
      alert('No se pudo eliminar el producto. Revisa la consola.');
    }
  };

  return (
    <div className="page">
      <h1>{editingId !== null ? 'Editar Producto' : 'Gestión de Productos'}</h1>

      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="product-name">Nombre</label>
          <input
            id="product-name"
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="product-description">Descripción</label>
          <input
            id="product-description"
            type="text"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="product-price">Precio</label>
          <input
            id="product-price"
            type="number"
            step="0.01"
            min="0"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
          />
        </div>

        {/* 🚀 Cambia dinámicamente el texto del botón y añade el de Cancelar */}
        <div className="form-actions">
          <button type="submit" className={editingId !== null ? 'update-btn' : ''}>
            {editingId !== null ? 'Actualizar producto' : 'Guardar producto'}
          </button>
          
          {editingId !== null && (
            <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {message && (
        <div
          className={`message show ${message.includes('exitosamente') ? 'success' : 'error'}`}
          role="status"
        >
          {message}
        </div>
      )}

      {loading ? (
        <p>Cargando productos...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : products.length === 0 ? (
        <p>No hay productos registrados.</p>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.ProductID} className={editingId === product.ProductID ? 'editing-row' : ''}>
                <td>{product.ProductID}</td>
                <td>{product.Nombre}</td>
                <td>{product.Descripcion ?? ''}</td>
                <td>${Number(product.Precio).toLocaleString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => handleEditClick(product)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDeleteProduct(product.ProductID)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}