// Aplicación principal que orquestra componentes y vistas
import { Sidebar } from './components/sidebar';
import { VistaDashboard } from './views/dashboard';
import { VistaProductos } from './views/productos';
import { VistaConfiguracion } from './views/configuracion';
import { VistaAyuda } from './views/ayuda';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  page: string;
}

class App {
  private sidebar: Sidebar | null = null;
  private contentContainer: HTMLElement | null = null;
  private vistas: Map<string, HTMLElement> = new Map();

  constructor() {
    this.contentContainer = document.querySelector('.content');
    this.initialize();
  }

  // Inicializar la aplicación
  private initialize(): void {
    // Configurar items del menú
    const menuItems: MenuItem[] = [
      { id: 'dashboard', label: 'Inicio', icon: '🏠', page: 'dashboard' },
      { id: 'products', label: 'Productos', icon: '📦', page: 'products' },
      { id: 'settings', label: 'Configuración', icon: '⚙️', page: 'settings' },
      { id: 'help', label: 'Ayuda', icon: '❓', page: 'help' },
    ];

    // Inicializar sidebar
    this.sidebar = new Sidebar(menuItems);
    this.sidebar.render(menuItems);
    this.sidebar.initToggle();

    // Renderizar vistas
    this.renderVistas();

    // Configurar listeners
    this.setupEventListeners();

    // Cargar página guardada o dashboard por defecto
    const savedPage = localStorage.getItem('active-page') || 'dashboard';
    this.showPage(savedPage);
  }

  // Renderizar todas las vistas
  private renderVistas(): void {
    const vistas = [
      new VistaDashboard(),
      new VistaProductos(),
      new VistaConfiguracion(),
      new VistaAyuda(),
    ];

    vistas.forEach((vista, index) => {
      const element = vista.render();
      // Solo la primera vista (dashboard) debe tener clase active inicialmente
      if (index !== 0) {
        element.classList.remove('active');
      }
      this.contentContainer?.appendChild(element);
      this.vistas.set(element.id, element);
    });
  }

  // Mostrar página específica
  private showPage(pageName: string): void {
    // Ocultar todas las páginas
    const allPages = document.querySelectorAll('.page');
    allPages.forEach((page) => {
      page.classList.remove('active');
    });

    // Mostrar página seleccionada
    const pageElement = document.getElementById(`page-${pageName}`);
    if (pageElement) {
      pageElement.classList.add('active');
    }

    // Actualizar sidebar
    if (this.sidebar) {
      this.sidebar.setActivePage(pageName);
    }
  }

  // Configurar listeners del evento
  private setupEventListeners(): void {
    if (this.sidebar) {
      this.sidebar.onPageChangeListener((pageName) => {
        this.showPage(pageName);
      });
    }

    // Listener para botón de limpiar datos
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.id === 'clear-data-btn') {
        if (confirm('¿Estás seguro de que deseas limpiar todos los datos?')) {
          localStorage.clear();
          alert('Datos limpios exitosamente.');
          window.location.reload();
        }
      }
    });
  }
}

// Inicializar la app cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
