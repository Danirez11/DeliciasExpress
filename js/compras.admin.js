window.onload = async () => { 
  try {
    const res = await fetch('https://deliciasexpress-1.onrender.com/compras');
    const data = await res.json();
    const contenedor = document.getElementById('comprasAdmin');
    contenedor.innerHTML = '';

    if (Array.isArray(data.compras) && data.compras.length > 0) {
      data.compras.forEach(compra => { 
        contenedor.innerHTML += `
          <div class="col-12 bg-white p-3 m-2 border rounded shadow">
            <h5>Compra #${compra.id}</h5>
            <p><strong>Nombre en tarjeta:</strong> ${compra.nombre_tarjeta}</p>
            <p><strong>Productos:</strong> ${compra.productos}</p>
          </div>
        `;
      });
    } else {
      contenedor.innerHTML = `
        <div class="alert alert-info text-center">No hay compras registradas.</div>
      `;
    }
  } catch (err) {
    const contenedor = document.getElementById('comprasAdmin');
    contenedor.innerHTML = `
      <div class="alert alert-danger text-center">Error al cargar las compras.</div>
    `;
    console.error("❌ Error al cargar compras:", err);
  }
};
