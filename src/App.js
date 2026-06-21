import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Tu URL real de Render que probamos antes
    fetch('https://mi-backend-node-x0l9.onrender.com/api/productos')
      .then((response) => response.json())
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error('Error al traer productos:', error);
        setCargando(false);
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Mis Productos en la Nube</h1>
      
      {cargando ? (
        <p style={{ textAlign: 'center' }}>Cargando productos de Aiven (esto puede tardar unos segundos si Render estaba dormido)...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
          {productos.map((producto) => (
            <div key={producto.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#0070f3' }}>{producto.nombre}</h3>
              <p style={{ margin: '5px 0' }}><strong>Precio:</strong> ${producto.precio}</p>
              <p style={{ margin: '5px 0', color: producto.stock > 0 ? 'green' : 'red' }}>
                <strong>Stock:</strong> {producto.stock} unidades
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;

