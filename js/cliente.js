const renderProductos = async () => {
    const cont = document.getElementById('productosCliente');
    if (!cont) {
        console.error('No existe el elemento con id "productosCliente" en el HTML');
        return;
    }
    cont.innerHTML = '<div class="text-center text-muted">Cargando productos...</div>';
    try {
        const res = await fetch('http://127.0.0.1:8000/productos/');
        const data = await res.json();
        cont.innerHTML = '';
        if (Array.isArray(data.productos) && data.productos.length > 0) {
            data.productos.forEach(prod => { 
                cont.innerHTML += `
                <div class="col bg-white p-3 m-2 d-flex flex-column align-items-center border rounded shadow">
                    <h5>${prod.nombre}</h5>
                    ${prod.imagen_url ? `<img src="/img/${prod.imagen_url}" alt="${prod.nombre}" style="max-width:120px;max-height:120px;" class="mb-2">` : ''}
                    <p class="text-muted">${prod.descripcion}</p>
                    <p class="fw-bold text-success">$${prod.precio}</p>
                    <p class="fw-bold text-secondary">Stock: ${prod.stock}</p>
                    <button class="btn btn-primary mt-2" onclick="agregarAlCarrito(${prod.id})">
                        <i class="bi bi-cart-plus"></i> Agregar al carrito
                    </button>
                </div>
                `;
            });
        } else {
            cont.innerHTML = '<div class="col-12 text-center text-muted">No hay productos disponibles.</div>';
        }
    } catch (err) {
        cont.innerHTML = '<div class="col-12 text-center text-danger">Error al cargar productos. Intenta de nuevo más tarde.</div>';
    }
};

const getCarritoKey = () => { 
    let usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) {
        
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        usuarioId = usuario && usuario.id ? usuario.id : null;
    }
    return usuarioId ? `carrito_${usuarioId}` : 'carrito';
};

window.agregarAlCarrito = async (id) => { 
    try {
        const res = await fetch(`http://127.0.0.1:8000/productos/${id}`);
        const data = await res.json();
        if (data.producto) {
            let carrito = JSON.parse(localStorage.getItem(getCarritoKey())) || [];
            if (!carrito.some(p => p.id === data.producto.id)) carrito.push(data.producto);
            localStorage.setItem(getCarritoKey(), JSON.stringify(carrito));
            alert('Producto agregado al carrito');
            renderCarrito();
        }
    } catch (err) {
        alert('Error al agregar producto al carrito');
    }
};

const renderCarrito = () => { 
    const contenedor = document.getElementById('carrito-container');
    if (!contenedor) return;
    let carrito = JSON.parse(localStorage.getItem(getCarritoKey())) || [];
    contenedor.innerHTML = '';
    if (carrito.length === 0) {
        contenedor.innerHTML = '<div class="alert alert-info">El carrito está vacío.</div>';
        return;
    }
    carrito.forEach((prod, idx) => { 
        const imagenHtml = prod.imagen_url
            ? `<img src="/img/${prod.imagen_url}" alt="${prod.nombre}" style="max-width:80px;max-height:80px;" class="me-2">`
            : '';
        contenedor.innerHTML += `
            <div class="d-flex align-items-center border-bottom py-2">
                ${imagenHtml}
                <div class="flex-grow-1">
                    <h6 class="mb-1">${prod.nombre}</h6>
                    <p class="mb-0 text-muted">${prod.descripcion || ''}</p>
                    <span class="fw-bold text-success">$${prod.precio}</span>
                </div>
                <button class="btn btn-danger btn-sm ms-2" onclick="eliminarDelCarrito(${idx})">Eliminar</button>
            </div>
        `;
    });
};

window.eliminarDelCarrito = (idx) => { 
    let carrito = JSON.parse(localStorage.getItem(getCarritoKey())) || [];
    carrito.splice(idx, 1);
    localStorage.setItem(getCarritoKey(), JSON.stringify(carrito));
    renderCarrito();
};

const btnComprar = document.getElementById('comprarBtn');
if (btnComprar) {
    btnComprar.onclick = () => { 
        let carrito = JSON.parse(localStorage.getItem(getCarritoKey())) || [];
        if (carrito.length === 0) return;
        document.getElementById('compraMsg').textContent = '¡Compra realizada con éxito!';
        document.getElementById('compraMsg').className = 'text-success';
        localStorage.removeItem(getCarritoKey());
        renderCarrito();
        setTimeout(() => document.getElementById('compraMsg').textContent = '', 2000); 
    };
}


const renderPerfil = async () => { 
    try {
        const perfilCont = document.getElementById('perfil-container');
        if (!perfilCont) return; 
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!usuario || !usuario.id) return;
        const res = await fetch(`http://127.0.0.1:8000/usuarios/${usuario.id}`);
        const data = await res.json();
        if (data.usuario) {
            perfilCont.innerHTML = `
                <div class="card p-3">
                    <form id="formPerfil">
                        <div class="mb-2">
                            <label class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="perfilNombre" value="${data.usuario.nombre}" required>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Correo</label>
                            <input type="email" class="form-control" id="perfilCorreo" value="${data.usuario.correo}" required>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Teléfono</label>
                            <input type="tel" class="form-control" id="perfilTelefono" value="${data.usuario.telefono || ''}" required pattern="[0-9]{10}">
                        </div>
                        <button type="submit" class="btn btn-info mt-2">Guardar cambios</button>
                        <div id="perfilMsg" class="mt-2"></div>
                    </form>
                </div>
            `;
        
            document.getElementById('formPerfil').onsubmit = async (e) => { 
                e.preventDefault();
                const nombre = document.getElementById('perfilNombre').value;
                const correo = document.getElementById('perfilCorreo').value;
                const telefono = document.getElementById('perfilTelefono').value;
                try {
                    const res = await fetch(`http://127.0.0.1:8000/usuarios/${usuario.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ nombre, correo, contraseña: '', telefono })
                    });
                    const data = await res.json();
                    if (res.ok && data.mensaje) {
                        document.getElementById('perfilMsg').textContent = 'Cambios guardados correctamente.';
                        document.getElementById('perfilMsg').className = 'text-success mt-2';
                    } else {
                        document.getElementById('perfilMsg').textContent = data.error || 'Error al guardar.';
                        document.getElementById('perfilMsg').className = 'text-danger mt-2';
                    }
                } catch (err) {
                    document.getElementById('perfilMsg').textContent = 'Error de conexión.';
                    document.getElementById('perfilMsg').className = 'text-danger mt-2';
                }
                setTimeout(() => document.getElementById('perfilMsg').textContent = '', 2000); 
            };
        }
    } catch (err) {
        console.error('Error al cargar perfil:', err);
    }
};

document.addEventListener('DOMContentLoaded', async () => { 
    let usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        usuarioId = usuario && usuario.id ? usuario.id : null;
    }
    if (usuarioId) {
        try {
            const res = await fetch(`http://127.0.0.1:8000/usuarios/${usuarioId}`);
            const data = await res.json();
            if (data.usuario && data.usuario.nombre) {
                document.getElementById('nombreUsuario').textContent = data.usuario.nombre;
            }
        } catch (err) {
            
        }
    }
    renderProductos();
    if (document.getElementById('carrito-container')) {
        renderCarrito();
    }
    renderPerfil();
});

window.onload = renderCarrito; 

document.addEventListener('DOMContentLoaded', () => { 
    const cerrarSesion = document.getElementById('cerrarSesion');
    if (cerrarSesion) {
        cerrarSesion.onclick = (e) => { 
            e.preventDefault();
            localStorage.clear();
            window.location.href = "/html/index.html";
        };
    }
});