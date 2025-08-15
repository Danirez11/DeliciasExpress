if (!usuarioLogueado()) {
  alert('Debes iniciar sesión para acceder a esta página.');
  window.location.href = '/html/login.usuario.html';
}

document.getElementById('formCompra').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombreTarjeta = document.getElementById('nombreTarjeta').value.trim();
  const numeroTarjeta = document.getElementById('numeroTarjeta').value.trim();
  const fechaVencimiento = document.getElementById('fechaVencimiento').value.trim();
  const cvv = document.getElementById('cvv').value.trim();
  const compraMsg = document.getElementById('compraMsg');
  compraMsg.textContent = '';

  const carrito = JSON.parse(localStorage.getItem(getCarritoKey())) || [];
  if (carrito.length === 0) {
    compraMsg.textContent = 'No hay productos en el carrito.';
    compraMsg.className = 'text-danger mt-2';
    return;
  }

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario || !usuario.id) {
    compraMsg.textContent = 'Usuario no válido.';
    compraMsg.className = 'text-danger mt-2';
    return;
  }

  try {
    const res = await fetch('https://deliciasexpress-1.onrender.com/compras', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario_id: usuario.id,
        nombre_tarjeta: nombreTarjeta,
        numero_tarjeta: numeroTarjeta,
        fecha_vencimiento: fechaVencimiento,
        cvv,
        productos: carrito
      })
    });

    const data = await res.json();

    if (res.ok && data.mensaje) {
      compraMsg.textContent = '¡Compra realizada exitosamente!';
      compraMsg.className = 'text-success mt-2';
      localStorage.removeItem(getCarritoKey());
      document.getElementById('formCompra').reset();
    } else {
      compraMsg.textContent = data.error || 'Error al procesar la compra.';
      compraMsg.className = 'text-danger mt-2';
    }
  } catch (err) {
    compraMsg.textContent = 'Error de conexión con el servidor.';
    compraMsg.className = 'text-danger mt-2';
  }
});

function getCarritoKey() {
  const usuarioId = localStorage.getItem('usuario_id');
  return usuarioId ? `carrito_${usuarioId}` : 'carrito';
}
