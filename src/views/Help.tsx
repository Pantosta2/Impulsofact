import React from 'react';

export default function Help() {
  return (
    <div className="page">
      <h1>Ayuda</h1>
      <p>¿Necesitas ayuda? Aquí puedes encontrar documentación y soporte.</p>
      <h2>Preguntas frecuentes</h2>
      <ul>
        <li>¿Cómo agregar un nuevo producto? Ve a la sección de Productos y completa el formulario.</li>
        <li>¿Cómo editar un producto? Haz clic en el botón correspondiente en la tabla de productos.</li>
        <li>¿Cómo eliminar un producto? Usa el botón de eliminar en la fila del producto.</li>
      </ul>
    </div>
  );
}
