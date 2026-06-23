import React from 'react';

export default function Configuration() {
  const handleClearData = () => {
    if (confirm('¿Estás seguro de que deseas limpiar todos los datos?')) {
      localStorage.clear();
      alert('Datos limpios exitosamente.');
      window.location.reload();
    }
  };

  return (
    <div className="page">
      <h1>Configuración</h1>
      <p>Opciones de configuración de la aplicación.</p>
      <button type="button" id="clear-data-btn" onClick={handleClearData}>
        Limpiar datos
      </button>
    </div>
  );
}
