document.addEventListener('DOMContentLoaded', cargarProductosAdmin);

async function cargarProductosAdmin() {
    const tbody = document.querySelector('#tabla-productos tbody');
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Cargando productos...</td></tr>';
    try {
        const res = await fetch('http://127.0.0.1:8000/productos/');
        const data = await res.json();
        tbody.innerHTML = '';
        if (Array.isArray(data.productos) && data.productos.length > 0) {
            data.productos.forEach(prod => {
                tbody.innerHTML += `
                    <tr>
                        <td>${prod.id}</td>
                        <td>${prod.nombre}</td>
                        <td>${prod.imagen_url ? `<img src="/img/${prod.imagen_url}" alt="${prod.nombre}" style="max-width:60px;max-height:60px;">` : ''}</td>
                        <td>${prod.descripcion}</td>
                        <td class="text-success fw-bold">$${prod.precio}</td>
                        <td>${prod.stock}</td>
                        <td>
                            <button class="btn btn-warning btn-sm me-2" onclick="actualizarProducto(${prod.id})">Actualizar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${prod.id})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No hay productos disponibles.</td></tr>';
        }
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error al cargar productos.</td></tr>';
    }
}

// Eliminar producto
async function eliminarProducto(id) {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
    try {
        const res = await fetch(`http://127.0.0.1:8000/productos/${id}`, { method: 'DELETE' });
        const data = await res.json();
        alert(data.mensaje || 'Producto eliminado');
        // Elimina el producto de los carritos guardados en localStorage (si existen)
        limpiarProductoDeCarritos(id);
        cargarProductosAdmin();
    } catch (err) {
        alert('Error al eliminar el producto');
    }
}

// Elimina el producto de todos los carritos en localStorage
function limpiarProductoDeCarritos(id) {
    // Si usas un solo carrito:
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(prod => prod.id !== id);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    // Si usas carritos por usuario, recorre todas las claves y limpia las que sean de carrito
    for (let key in localStorage) {
        if (key.startsWith('carrito_')) {
            let c = JSON.parse(localStorage.getItem(key)) || [];
            c = c.filter(prod => prod.id !== id);
            localStorage.setItem(key, JSON.stringify(c));
        }
    }
}

// Actualizar producto (redirige a un formulario de edición)
function actualizarProducto(id) {
    window.location.href = `/html/editar_producto.html?id=${id}`;
}