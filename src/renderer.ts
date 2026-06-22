// Manejo de productos con la nueva arquitectura modular
class ProductsManager {
  private isInitialized = false;

  constructor() {
    // Esperar a que el DOM esté listo y app.ts haya renderizado las vistas
    document.addEventListener('DOMContentLoaded', () => {
      // Pequeño delay para asegurar que app.ts ya ha inicializado
      setTimeout(() => this.initialize(), 100);
    });

    // También intentar inicializar si el evento ya pasó
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      setTimeout(() => this.initialize(), 100);
    }
  }

  private initialize(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    const addProductButton = document.getElementById('add-product');
    if (addProductButton) {
      addProductButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleAddProduct();
      });
    }

    // Event delegation para botones de eliminar
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('delete-btn')) {
        this.handleDeleteProduct(target);
      }
    });

    // Cargar productos cuando la página esté lista
    this.renderProducts();
  }

  private async handleAddProduct(): Promise<void> {
    const ProductName = document.getElementById('product-name') as HTMLInputElement;
    const ProductDescription = document.getElementById('product-description') as HTMLInputElement;
    const ProductPrice = document.getElementById('product-price') as HTMLInputElement;

    const name = ProductName?.value.trim() || '';
    const description = ProductDescription?.value.trim() || '';
    const price = parseFloat(ProductPrice?.value.trim() || '0');

    if (!name || !description || isNaN(price)) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    try {
      await window.api.addProduct(name, description, price);
      alert('Producto agregado exitosamente!');
      
      // Limpiar formulario
      if (ProductName) ProductName.value = '';
      if (ProductDescription) ProductDescription.value = '';
      if (ProductPrice) ProductPrice.value = '';
      
      // Refrescar tabla
      await this.renderProducts();
    } catch (error) {
      console.error('Error al añadir producto:', error);
      alert('No se pudo agregar el producto. Por favor, inténtalo de nuevo.');
    }
  }

  private async handleDeleteProduct(target: HTMLElement): Promise<void> {
    const id = Number(target.getAttribute('data-id'));
    if (!id || !confirm('¿Eliminar este producto?')) return;

    try {
      await window.api.deleteProduct(id);
      await this.renderProducts();
    } catch (err) {
      console.error('Error eliminando producto', err);
      alert('No se pudo eliminar el producto. Revisa la consola.');
    }
  }

  private async renderProducts(): Promise<void> {
    const tbody = document.getElementById('product-table-body') as HTMLTableSectionElement | null;
    const messageEl = document.getElementById('product-message');
    
    if (!tbody) {
      console.warn('Tabla de productos no encontrada');
      return;
    }

    tbody.innerHTML = '';

    if (!window.api || typeof window.api.getProducts !== 'function') {
      if (messageEl) {
        messageEl.textContent = 'API no disponible en el renderer.';
        messageEl.classList.add('show');
      }
      console.error('window.api no está disponible');
      return;
    }

    try {
      const Products = await window.api.getProducts() as Array<{
        ProductID: number;
        Nombre: string;
        Descripcion: string;
        Precio: string | number;
      }>;

      if (!Products || Products.length === 0) {
        if (messageEl) {
          messageEl.textContent = 'No hay productos registrados.';
          messageEl.classList.add('show');
        }
        return;
      }

      Products.forEach((product) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${product.ProductID}</td>
          <td>${product.Nombre}</td>
          <td>${product.Descripcion ?? ''}</td>
          <td>$${Number(product.Precio).toLocaleString()}</td>
          <td><button class="delete-btn" data-id="${product.ProductID}">Eliminar</button></td>
        `;
        tbody.appendChild(tr);
      });

      if (messageEl) {
        messageEl.textContent = '';
        messageEl.classList.remove('show');
      }
    } catch (err) {
      console.error('Error en renderProducts:', err);
      if (messageEl) {
        messageEl.textContent = 'Error al cargar productos. Revisa la consola.';
        messageEl.classList.add('show');
      }
    }
  }
}

// Inicializar el gestor de productos
new ProductsManager();
