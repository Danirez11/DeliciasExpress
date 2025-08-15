document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
});

const modalEditar = new bootstrap.Modal(document.getElementById('modalEditarProducto'));

const usuarioLogueado = () => !!localStorage.getItem('usuario');

const getCarritoKey = () => {
  let usuarioId = localStorage.getItem('usuario_id');
  if (!usuarioId) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    usuarioId = usuario && usuario.id ? usuario.id : null;
  }
  return usuarioId ? `carrito_${usuarioId}` : 'carrito';
};

const cargarProductos = async () => {
  const tbody = document.querySelector('#tabla-productos tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Cargando productos...</td></tr>';
  try {
    const res = await fetch('http://127.0.0.1:8000/productos/');
    const data = await res.json();
    tbody.innerHTML = '';
    if (Array.isArray(data.productos) && data.productos.length > 0) {
      data.productos.forEach(prod => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${prod.id}</td>
          <td>${prod.nombre}</td>
          <td>${prod.imagen_url ? `<img src="/img/${prod.imagen_url}" alt="${prod.nombre}" style="max-width:60px;max-height:60px;">` : ''}</td>
          <td>${prod.descripcion}</td>
          <td>${prod.precio}</td>
          <td>${prod.stock}</td>
          <td>
            <button class="btn btn-primary btn-sm me-2" onclick="mostrarEditarProducto(${prod.id}, '${prod.nombre}', '${prod.descripcion}', ${prod.precio}, ${prod.stock}, '${prod.imagen_url || ''}')">Actualizar</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${prod.id})">Eliminar</button>
          </td>
        `;
        tbody.appendChild(fila);
      });

      $('#tabla-productos').DataTable({
        destroy: true,
        responsive: true,
        language: {
          url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
        }
      });

    } else {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No hay productos registrados.</td></tr>';
    }
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error al cargar productos.</td></tr>';
  }
};

window.mostrarEditarProducto = (id, nombre, descripcion, precio, stock, imagen_url) => {
  document.getElementById('producto_id').value = id;
  document.getElementById('nombre').value = nombre;
  document.getElementById('descripcion').value = descripcion;
  document.getElementById('precio').value = precio;
  document.getElementById('stock').value = stock;
  document.getElementById('imagen_url').value = imagen_url;
  document.getElementById('mensajeEditarProducto').textContent = '';
  document.getElementById('mensajeEditarProducto').className = '';
  modalEditar.show();
};

document.getElementById('formEditarProducto').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('producto_id').value;
  const nombre = document.getElementById('nombre').value;
  const descripcion = document.getElementById('descripcion').value;
  const precio = parseFloat(document.getElementById('precio').value);
  const stock = parseInt(document.getElementById('stock').value);
  const imagen_url = document.getElementById('imagen_url').value;
  const mensajeDiv = document.getElementById('mensajeEditarProducto');

  try {
    const res = await fetch(`http://127.0.0.1:8000/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, descripcion, precio, stock, imagen_url })
    });
    const data = await res.json();
    if (res.ok) {
      mensajeDiv.textContent = data.mensaje || "Producto actualizado correctamente";
      mensajeDiv.className = "alert alert-success";
      modalEditar.hide();
      cargarProductos();
    } else {
      mensajeDiv.textContent = data.mensaje || "Error al actualizar el producto";
      mensajeDiv.className = "alert alert-danger";
    }
  } catch (err) {
    mensajeDiv.textContent = "Error de conexión con el servidor";
    mensajeDiv.className = "alert alert-danger";
  }
});

const eliminarProducto = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
  try {
    const res = await fetch(`http://127.0.0.1:8000/productos/${id}`, { method: 'DELETE' });
    const data = await res.json();
    alert(data.mensaje || 'Producto eliminado');
    cargarProductos();
  } catch (err) {
    alert('Error al eliminar el producto');
  }
};

const agregarAlCarrito = (id, nombre) => {
  fetch(`http://127.0.0.1:8000/productos/${id}`)
    .then(res => res.json())
    .then(data => {
      if (data.producto) {
        let carrito = JSON.parse(localStorage.getItem(getCarritoKey())) || [];
        carrito.push(data.producto);
        localStorage.setItem(getCarritoKey(), JSON.stringify(carrito));
        mostrarMensaje(`"${nombre}" ha sido agregado al carrito.`, "success");
      }
    })
    .catch(() => {
      mostrarMensaje("Error al agregar el producto al carrito.", "danger");
    });
};

const mostrarMensaje = (texto, tipo) => {
  let msgDiv = document.getElementById('mensaje-carrito');
  if (!msgDiv) {
    msgDiv = document.createElement('div');
    msgDiv.id = 'mensaje-carrito';
    msgDiv.className = 'alert alert-' + tipo + ' mt-3 text-center';
    document.body.appendChild(msgDiv);
  }
  msgDiv.textContent = texto;
  msgDiv.className = 'alert alert-' + tipo + ' mt-3 text-center';
  setTimeout(() => { msgDiv.remove(); }, 2000);
};

const comprarProducto = (id) => {
  alert('Funcionalidad de compra directa para producto ID: ' + id);
};

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('comprar-btn')) {
    if (!usuarioLogueado()) {
      alert('Debes iniciar sesión para comprar.');
      window.location.href = '/html/login.usuario.html';
      return;
    }
    window.location.href = '/html/compra.html';
  }

  if (e.target.classList.contains('agregar-carrito-btn') || e.target.closest('.agregar-carrito-btn')) {
    if (!usuarioLogueado()) {
      alert('Debes iniciar sesión para agregar productos al carrito.');
      window.location.href = '/html/login.usuario.html';
      return;
    }
    const btn = e.target.classList.contains('agregar-carrito-btn') ? e.target : e.target.closest('.agregar-carrito-btn');
    const card = btn.closest('.col');
    const nombre = card.querySelector('h5').textContent;
    const descripcion = card.querySelector('p.text-muted').textContent;
    const precio = card.querySelector('.fw-bold.text-success').textContent.replace('$', '');
    const stock = card.querySelector('.fw-bold.text-secondary').textContent.replace('Stock: ', '');
    const imagen = card.querySelector('img') ? card.querySelector('img').getAttribute('src').replace('/img/', '') : '';
    const producto = { nombre, descripcion, precio, stock, imagen_url: imagen };
    let carrito = JSON.parse(localStorage.getItem(getCarritoKey())) || [];
    carrito.push(producto);
    localStorage.setItem(getCarritoKey(), JSON.stringify(carrito));
    alert('Producto agregado al carrito');
    if (document.getElementById('carrito-container')) {
      mostrarCarrito();
    }
  }
});

if (document.getElementById('carrito-container')) {
  document.getElementById('carrito-container').addEventListener('click', (e) => {
    let carrito = JSON.parse(localStorage.getItem(getCarritoKey())) || [];
    if (e.target.classList.contains('quitar-carrito-btn')) {
      const idx = e.target.getAttribute('data-idx');
      carrito.splice(idx, 1);
      localStorage.setItem(getCarritoKey(), JSON.stringify(carrito));
      mostrarCarrito();
    }
  });
}

const mostrarCarrito = () => {
  let carrito = JSON.parse(localStorage.getItem(getCarritoKey())) || [];
  const contenedor = document.getElementById('carrito-container');
  if (!contenedor) return;

  contenedor.innerHTML = '';
  if (carrito.length === 0) {
    contenedor.innerHTML = '<div class="alert alert-info">El carrito está vacío.</div>';
    return;
  }

  carrito.forEach((producto, idx) => {
    contenedor.innerHTML += `
      <div class="card mb-2">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <strong>${producto.nombre}</strong> - $${producto.precio}
          </div>
          <div>
            <button class="btn btn-danger btn-sm quitar-carrito-btn" data-idx="${idx}">Quitar</button>
            <button class="btn btn-success btn-sm comprar-carrito-btn" data-idx="${idx}">Comprar</button>
          </div>
        </div>
      </div>
    `;
  });
};

// ✅ Funciones auxiliares para sesión
const almacenarUsuario = (usuario) => {
  localStorage.setItem('usuario', JSON.stringify(usuario));
  localStorage.setItem('usuario_id', usuario.id);
};

const eliminarUsuario = () => {
  localStorage.removeItem('usuario');
  localStorage.removeItem('usuario_id');
};
