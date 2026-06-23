import React from 'react';
import './sidebar.css';
import type { MenuItem } from '../App';

interface SidebarProps {
  menuItems: MenuItem[];
  activePage: string;
  onPageChange: (pageName: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  menuItems,
  activePage,
  onPageChange,
  isCollapsed,
  onToggle,
}: SidebarProps) {
  const handleClearData = () => {
    if (confirm('¿Estás seguro de que deseas limpiar todos los datos?')) {
      localStorage.clear();
      alert('Datos limpios exitosamente.');
      window.location.reload();
    }
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span>📦</span>
          {!isCollapsed && <span>Impulsofact</span>}
        </div>
        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`sidebar-menu-item ${item.page === activePage ? 'active' : ''}`}
            onClick={() => onPageChange(item.page)}
          >
            <span className="sidebar-menu-icon">{item.icon}</span>
            {!isCollapsed && <span className="sidebar-menu-label">{item.label}</span>}
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <button
          type="button"
          id="clear-data-btn"
          className="clear-data-btn"
          onClick={handleClearData}
          title="Limpiar datos"
        >
          🗑️
          {!isCollapsed && <span>Limpiar datos</span>}
        </button>
      </div>
    </aside>
  );
}
