document.getElementById('formProducto').addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const imagen_url = document.getElementById('imagen_url').value;
    const stock = document.getElementById('stock').value;

    fetch('http://127.0.0.1:8000/productos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion, precio, imagen_url, stock })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.mensaje || 'Producto agregado');
        e.target.reset();
        cargarProductosAdmin(); 
    })
    .catch(() => {
        alert('Error al agregar producto');
    });
});


const cargarProductosAdmin = () => { 
    fetch("http://127.0.0.1:8000/productos/")
        .then(res => res.json())
        .then(data => {
            const contenedor = document.getElementById("contenedor-productos");
            if (!contenedor) return;
            contenedor.innerHTML = "";
            if (Array.isArray(data.productos) && data.productos.length > 0) {
                data.productos.forEach(prod => { 
                    const imagenHtml = prod.imagen_url
                        ? `<img src="/img/${prod.imagen_url}" alt="${prod.nombre}" style="max-width:120px;max-height:120px;" class="mb-2">`
                        : '';
                    contenedor.innerHTML += `
                        <div class="col bg-white p-3 m-2 d-flex flex-column align-items-center border rounded shadow">
                            <h5>${prod.nombre}</h5>
                            ${imagenHtml}
                            <p class="text-muted">${prod.descripcion}</p>
                            <p class="fw-bold text-success">$${prod.precio}</p>
                            <p class="fw-bold text-secondary">Stock: ${prod.stock}</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-warning editar-btn" data-id="${prod.id}">Editar</button>
                                <button class="btn btn-danger eliminar-btn" data-id="${prod.id}">Eliminar</button>
                            </div>
                        </div>
                    `;
                });
            } else {
                contenedor.innerHTML = '<div class="col-12 text-center text-muted">No hay productos disponibles.</div>';
            }
        })
        .catch(error => { 
            const contenedor = document.getElementById("contenedor-productos");
            if (contenedor) {
                contenedor.innerHTML = `<div class='alert alert-danger'>Error al cargar productos. Intenta de nuevo más tarde.</div>`;
            }
        });
};

window.onload = () => { 
    cargarProductosAdmin();
};