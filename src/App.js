import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados independientes para controlar las cajas de texto del formulario
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');

  // Tu URL pública de Render (Mantenla tal cual)
  const API_URL = 'https://mi-backend-node-x0l9.onrender.com/api/productos';

  // Función reutilizable para consultar los productos actualizados de la nube
  const obtenerProductos = () => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error('Error al traer productos:', error);
        setCargando(false);
      });
  };

  // Trae los productos automáticamente al cargar la página por primera vez
  useEffect(() => {
    obtenerProductos();
  }, []);

  // Función que procesa el formulario al dar clic en el botón "Guardar"
  const manejarEnvio = (e) => {
    e.preventDefault(); // Detiene el comportamiento de Windows que recarga la página completa

    // Enviamos los datos del estado a Render usando POST y transformándolos a JSON
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: nombre,
        precio: parseFloat(precio), // Convierte el texto de la caja a número decimal (ej: "15.50" -> 15.5)
        stock: parseInt(stock)       // Convierte el texto de la caja a número entero (ej: "10" -> 10)
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert('Hubo un problema: ' + data.error);
        } else {
          alert('¡Excelente! Producto guardado exitosamente en Aiven.');
          // Reseteamos las cajas del formulario para que queden vacías de nuevo
          setNombre('');
          setPrecio('');
          setStock('');
          // Llamamos a la función para refrescar la lista de abajo al instante con el nuevo producto
          obtenerProductos();
        }
      })
      .catch((error) => {
        console.error('Error al enviar el producto:', error);
      });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Panel de Control de Inventario</h1>
      
      {/* FORMULARIO ESTILIZADO DE INSERCIÓN */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', maxWidth: '400px', margin: '0 auto 30px auto' }}>
        <h2 style={{ marginTop: 0, color: '#333', fontSize: '1.2rem', textAlign: 'center' }}>Agregar Producto Nuevo</h2>
        <form onSubmit={manejarEnvio} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontWeight: 'bold', color: '#555' }}>
            Nombre del artículo:
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontWeight: 'bold', color: '#555' }}>
            Precio ($):
            <input type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontWeight: 'bold', color: '#555' }}>
            Unidades en Stock:
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }} />
          </label>
          <button type="submit" style={{ padding: '12px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '5px' }}>
            Subir a la Nube
          </button>
        </form>
      </div>

      {/* REJILLA VISUAL DE PRODUCTOS */}
      <h2 style={{ textAlign: 'center', marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '30px' }}>Mis Productos Disponibles</h2>
      {cargando ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Cargando datos desde el servidor en la nube...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px', marginTop: '20px' }}>
          {productos.map((producto) => (
            <div key={producto.id} style={{ border: '1px solid #eee', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.05)', backgroundColor: '#fff', transition: 'transform 0.2s' }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#0070f3', fontSize: '1.3rem' }}>{producto.nombre}</h3>
              <p style={{ margin: '6px 0', color: '#444' }}><strong>Precio:</strong> ${producto.precio}</p>
              <p style={{ margin: '6px 0', fontWeight: 'bold', color: producto.stock > 0 ? '#2e7d32' : '#c62828' }}>
                <strong>Existencias:</strong> {producto.stock} uds.
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
