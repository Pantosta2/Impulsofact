import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';

export default function Products() {
  const { products, loading, error, addProduct, deleteProduct } = useProducts();
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [message, setMessage] = useState('');

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = productName.trim();
    const description = productDescription.trim();
    const price = parseFloat(productPrice.trim() || '0');

    if (!name || !description || Number.isNaN(price)) {
      setMessage('Por favor, completa todos los campos correctamente.');
      return;
    }

    try {
      await addProduct(name, description, price);
      setMessage('Producto agregado exitosamente!');
      setProductName('');
      setProductDescription('');
      setProductPrice('');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('No se pudo agregar el producto. Por favor, inténtalo de nuevo.');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('¿Eliminar este producto?')) return;

    try {
      await deleteProduct(id);
    } catch {
      alert('No se pudo eliminar el producto. Revisa la consola.');
    }
  };

  return (
    <div className="page">
      <h1>Gestión de Productos</h1>

      <form onSubmit={handleAddProduct}>
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

        <button type="submit">Guardar producto</button>
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
              <tr key={product.ProductID}>
                <td>{product.ProductID}</td>
                <td>{product.Nombre}</td>
                <td>{product.Descripcion ?? ''}</td>
                <td>${Number(product.Precio).toLocaleString()}</td>
                <td>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDeleteProduct(product.ProductID)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
