// Sidebar functionality
const sidebar = document.getElementById('sidebar') as HTMLElement;
const sidebarToggle = document.getElementById('sidebar-toggle') as HTMLButtonElement;
const sidebarMenu = document.getElementById('sidebar-menu') as HTMLElement;

// Toggle sidebar collapse/expand
sidebarToggle?.addEventListener('click', () => {
  sidebar?.classList.toggle('collapsed');
  // Save state to localStorage
  const isCollapsed = sidebar?.classList.contains('collapsed');
  localStorage.setItem('sidebar-collapsed', isCollapsed ? 'true' : 'false');
});

// Load sidebar state from localStorage
const savedState = localStorage.getItem('sidebar-collapsed');
if (savedState === 'true') {
  sidebar?.classList.add('collapsed');
}

// Menu item click handler
const menuItems = sidebarMenu?.querySelectorAll('.sidebar-menu-item') as NodeListOf<HTMLElement>;

menuItems?.forEach((item) => {
  item.addEventListener('click', () => {
    // Get the page name from data attribute
    const pageName = item.getAttribute('data-page');
    if (!pageName) return;

    // Remove active class from all items
    menuItems.forEach((i) => i.classList.remove('active'));
    // Add active class to clicked item
    item.classList.add('active');

    // Hide all pages
    const pages = document.querySelectorAll('.page') as NodeListOf<HTMLElement>;
    pages.forEach((page) => {
      page.style.display = 'none';
    });

    // Show the selected page
    const selectedPage = document.getElementById(`page-${pageName}`) as HTMLElement;
    if (selectedPage) {
      selectedPage.style.display = 'block';
    }

    // Save active page to localStorage
    localStorage.setItem('active-page', pageName);
  });
});

// Load active page from localStorage on page load
window.addEventListener('load', () => {
  const savedPage = localStorage.getItem('active-page') || 'dashboard';
  const pageItem = document.querySelector(
    `.sidebar-menu-item[data-page="${savedPage}"]`
  ) as HTMLElement;
  if (pageItem) {
    pageItem.click();
  }
});

// Clear data button (for settings page)
const clearDataBtn = document.getElementById('clear-data-btn') as HTMLButtonElement;
clearDataBtn?.addEventListener('click', () => {
  if (confirm('¿Estás seguro de que deseas limpiar todos los datos?')) {
    localStorage.clear();
    alert('Datos limpios exitosamente.');
    window.location.reload();
  }
});
