import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import Products from './views/Products';
import Configuration from './views/Configuration';
import Help from './views/Help';
import './views/vistas.css';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  page: string;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Inicio', icon: '🏠', page: 'dashboard' },
  { id: 'products', label: 'Productos', icon: '📦', page: 'products' },
  { id: 'settings', label: 'Configuración', icon: '⚙️', page: 'settings' },
  { id: 'help', label: 'Ayuda', icon: '❓', page: 'help' },
];

export default function App() {
  const [activePage, setActivePage] = useState(
    () => localStorage.getItem('active-page') || 'dashboard',
  );
  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem('sidebar-collapsed') === 'true',
  );

  useEffect(() => {
    localStorage.setItem('active-page', activePage);
  }, [activePage]);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', isCollapsed ? 'true' : 'false');
  }, [isCollapsed]);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'settings':
        return <Configuration />;
      case 'help':
        return <Help />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="main-container">
      <Sidebar
        menuItems={menuItems}
        activePage={activePage}
        onPageChange={setActivePage}
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed((prev) => !prev)}
      />
      <main className="content">{renderPage()}</main>
    </div>
  );
}
