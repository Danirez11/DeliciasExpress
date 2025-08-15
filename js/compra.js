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

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        compraMsg.textContent = 'No hay productos en el carrito.';
        compraMsg.className = 'text-danger mt-2';
        return;
    }




    try {
    
        const data = { mensaje: "Compra procesada exitosamente con datos simulados." };
        const res = { ok: true };

        if (res.ok && data.mensaje) {
            compraMsg.textContent = '¡Compra realizada exitosamente!';
            compraMsg.className = 'text-success mt-2';
            localStorage.removeItem('carrito');
            
        
            document.getElementById('formCompra').reset(); 
        } else {
            compraMsg.textContent = data.error || 'Error al procesar la compra (simulada).';
            compraMsg.className = 'text-danger mt-2';
        }
    } catch (err) {
        compraMsg.textContent = 'Error de conexión o simulación fallida.';
        compraMsg.className = 'text-danger mt-2';
    }
});