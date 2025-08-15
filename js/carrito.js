const API_URL = 'https://deliciasexpress-1.onrender.com';

const carritoProductos = document.getElementById('carritoProductos');
const carritoMsg = document.getElementById('carritoMsg');
const btnComprar = document.getElementById('btnComprar');

const usuarioLogueado = () => {
  const usuario = localStorage.getItem('usuario');
  return usuario && usuario !== "undefined" && usuario !== "null";
};

if (!usuarioLogueado()) {
  alert('Debes iniciar sesión para acceder a esta página.');
  window.location.href = '/html/login.usuario.html';
}

const getCarritoKey = () => {
  let usuarioId = localStorage.getItem('usuario_id');
  if (!usuarioId) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    usuarioId = usuario && usuario.id ? usuario.id : null;
  }
  return usuarioId ? `carrito_${usuarioId}` : 'carrito';
};

const renderCarrito = () => {
  const contenedor = document.getElementById('carrito-container');
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

const eliminarDelCarrito = (idx) => {
  let carrito = JSON.parse(localStorage.getItem(getCarritoKey())) || [];
  carrito.splice(idx, 1);
  localStorage.setItem(getCarritoKey(), JSON.stringify(carrito));
  renderCarrito();
};

btnComprar.onclick = async () => {
  const carrito = JSON.parse(localStorage.getItem(getCarritoKey())) || [];
  if (carrito.length === 0) return;

  carritoMsg.textContent = '¡Compra realizada con éxito!';
  carritoMsg.className = 'text-success mt-3';
  localStorage.removeItem(getCarritoKey());
  renderCarrito();
  setTimeout(() => carritoMsg.textContent = '', 2000);
};

window.onload = renderCarrito;
document.addEventListener('DOMContentLoaded', renderCarrito);

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    fetch(`${API_URL}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      if (data.usuario) {
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        localStorage.setItem('usuario_id', data.usuario.id);

        const carritoGenerico = localStorage.getItem('carrito');
        if (carritoGenerico) {
          localStorage.setItem(`carrito_${data.usuario.id}`, carritoGenerico);
          localStorage.removeItem('carrito');
        }

        if (data.usuario.rol === 'admin' || data.usuario.rol === 'administrador') {
          window.location.href = '/html/administrador.html';
        } else {
          window.location.href = '/html/cliente.html';
        }
      } else {
        document.getElementById('loginMsg').textContent = 'Credenciales incorrectas';
        document.getElementById('loginMsg').classList.add('text-danger');
      }
    })
    .catch(error => {
      console.error('Error en la autenticación:', error);
      document.getElementById('loginMsg').textContent = 'Error en el servidor, intenta más tarde';
      document.getElementById('loginMsg').classList.add('text-danger');
    });
  };
}
