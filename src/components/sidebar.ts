// Tipo para los items del menú
interface MenuItem {
  id: string;
  label: string;
  icon: string;
  page: string;
}

// Componente Sidebar reutilizable
export class Sidebar {
  private sidebar: HTMLElement | null;
  private sidebarToggle: HTMLButtonElement | null;
  private sidebarMenu: HTMLElement | null;
  private menuItems: MenuItem[];
  private onPageChange: ((pageName: string) => void) | null = null;

  constructor(menuItems: MenuItem[] = []) {
    this.sidebar = document.getElementById('sidebar');
    this.sidebarToggle = document.getElementById('sidebar-toggle') as HTMLButtonElement;
    this.sidebarMenu = document.getElementById('sidebar-menu');
    this.menuItems = menuItems;
  }

  // Renderizar el menú
  render(items: MenuItem[]): void {
    if (!this.sidebarMenu) return;

    this.sidebarMenu.innerHTML = '';
    items.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'sidebar-menu-item' + (index === 0 ? ' active' : '');
      li.setAttribute('data-page', item.page);
      li.innerHTML = `
        <span class="sidebar-menu-icon">${item.icon}</span>
        <span class="sidebar-menu-label">${item.label}</span>
      `;

      li.addEventListener('click', () => this.handleMenuClick(li, item.page));
      this.sidebarMenu?.appendChild(li);
    });
  }

  // Manejar click en items del menú
  private handleMenuClick(element: HTMLElement, pageName: string): void {
    const allItems = this.sidebarMenu?.querySelectorAll(
      '.sidebar-menu-item'
    ) as NodeListOf<HTMLElement>;
    allItems.forEach((item) => item.classList.remove('active'));
    element.classList.add('active');

    // Ejecutar callback
    if (this.onPageChange) {
      this.onPageChange(pageName);
    }

    // Guardar en localStorage
    localStorage.setItem('active-page', pageName);
  }

  // Toggle sidebar collapse
  initToggle(): void {
    this.sidebarToggle?.addEventListener('click', () => {
      this.sidebar?.classList.toggle('collapsed');
      const isCollapsed = this.sidebar?.classList.contains('collapsed');
      localStorage.setItem('sidebar-collapsed', isCollapsed ? 'true' : 'false');
    });

    // Restaurar estado guardado
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState === 'true') {
      this.sidebar?.classList.add('collapsed');
    }
  }

  // Listener para cambio de página
  onPageChangeListener(callback: (pageName: string) => void): void {
    this.onPageChange = callback;
  }

  // Establecer página activa
  setActivePage(pageName: string): void {
    const menuItem = this.sidebarMenu?.querySelector(
      `.sidebar-menu-item[data-page="${pageName}"]`
    ) as HTMLElement;
    if (menuItem) {
      const allItems = this.sidebarMenu?.querySelectorAll(
        '.sidebar-menu-item'
      ) as NodeListOf<HTMLElement>;
      allItems.forEach((item) => item.classList.remove('active'));
      menuItem.classList.add('active');
    }
  }

  // Obtener página activa
  getActivePage(): string | null {
    const activeItem = this.sidebarMenu?.querySelector(
      '.sidebar-menu-item.active'
    ) as HTMLElement;
    return activeItem?.getAttribute('data-page') || null;
  }
}
