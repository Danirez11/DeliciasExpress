document.getElementById('registroForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const correo = document.getElementById('email').value.trim();
    const contraseña = document.getElementById('password').value.trim();
    const tipoUsuario = document.querySelector('input[name="tipoUsuario"]:checked').value;
    const msg = document.getElementById('registroMsg');
    msg.textContent = '';
    if (!nombre || !telefono || !correo || !contraseña || !tipoUsuario) {
        msg.textContent = 'Todos los campos son obligatorios';
        msg.className = 'text-danger mt-2';
        return;
    }
    try {
        const res = await fetch('http://127.0.0.1:8000/usuarios/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, telefono, correo, contraseña, rol: tipoUsuario })
        });
        const data = await res.json();
        if (res.ok && data.mensaje) {
            msg.textContent = 'Usuario creado exitosamente.';
            msg.className = 'text-success mt-2';
            setTimeout(() => {
                if (tipoUsuario === 'admin') {
                    window.location.href = '/html/administrador.html';
                } else {
                    window.location.href = '/html/cliente.html';
                }
            }, 1200);
            document.getElementById('registroForm').reset();
        } else {
            msg.textContent = data.error || 'Error al crear usuario.';
            msg.className = 'text-danger mt-2';
        }
    } catch (err) {
        msg.textContent = 'Error de conexión.';
        msg.className = 'text-danger mt-2';
    }
});