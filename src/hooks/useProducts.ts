import { useEffect, useState } from 'react';

export interface Product {
  ProductID: number;
  Nombre: string;
  Descripcion: string;
  Precio: string | number;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      if (window.api && typeof window.api.getProducts === 'function') {
        const data = (await window.api.getProducts()) as Product[];
        setProducts(data || []);
        setError(null);
      } else {
        setError('API no disponible');
      }
    } catch (err) {
      console.error('Error cargando productos:', err);
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = async (name: string, description: string, price: number) => {
    if (!window.api) {
      throw new Error('API no disponible');
    }
    await window.api.addProduct(name, description, price);
    await loadProducts();
  };

  const deleteProduct = async (id: number) => {
    if (!window.api) {
      throw new Error('API no disponible');
    }
    await window.api.deleteProduct(id);
    await loadProducts();
  };

  return { products, loading, error, addProduct, deleteProduct, loadProducts };
}
