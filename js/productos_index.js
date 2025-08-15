const cargarProductos = () => {
  fetch("https://deliciasexpress-1.onrender.com/productos")
    .then(res => res.json())
    .then(data => {
      const contenedor = document.getElementById("contenedor-productos");
      if (!contenedor) return;

      contenedor.innerHTML = "";

      const productos = Array.isArray(data.productos) ? data.productos : data;

      if (Array.isArray(productos) && productos.length > 0) {
        productos.forEach(prod => {
          const imagenHtml = prod.imagen_url
            ? `<img src="/img/${prod.imagen_url}" alt="${prod.nombre}" class="img-fluid producto-img mb-2">`
            : `<div class="producto-img-placeholder mb-2">Sin imagen</div>`;

          const card = document.createElement("div");
          card.className = "col-12 col-sm-6 col-md-4 mb-4";
          card.innerHTML = `
            <div class="card h-100 shadow-sm border-0">
              <div class="card-body d-flex flex-column align-items-center text-center">
                <h5 class="card-title">${prod.nombre}</h5>
                ${imagenHtml}
                <p class="card-text text-muted">${prod.descripcion}</p>
                <p class="fw-bold text-success">$${prod.precio}</p>
                <p class="fw-bold text-secondary">Stock: ${prod.stock}</p>
              </div>
            </div>
          `;
          contenedor.appendChild(card);
        });
      } else {
        contenedor.innerHTML = `
          <div class="col-12 text-center text-muted">
            <div class="alert alert-info">No hay productos disponibles en este momento.</div>
          </div>
        `;
      }
    })
    .catch(error => {
      const contenedor = document.getElementById("contenedor-productos");
      if (contenedor) {
        contenedor.innerHTML = `
          <div class="col-12">
            <div class="alert alert-danger text-center">Error al cargar productos. Intenta de nuevo más tarde.</div>
          </div>
        `;
      }
      console.error("❌ Error al cargar productos:", error);
    });
};

// ✅ Ejecutar al cargar la página
window.onload = cargarProductos;
