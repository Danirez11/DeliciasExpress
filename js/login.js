document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const loginMsg = document.getElementById('loginMsg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const correo = document.getElementById('email').value.trim();
        const contraseña = document.getElementById('password').value.trim();

        loginMsg.textContent = '';
        loginMsg.classList.remove('text-danger');

        if (!correo || !contraseña) {
            mostrarMensaje('Por favor ingresa correo y contraseña', true);
            return;
        }

        try {
            const res = await fetch('http://127.0.0.1:8000/usuarios/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, contraseña })
            });

            const data = await res.json();

            if (res.ok && data.usuario) {
                guardarUsuario(data.usuario);
                sincronizarCarrito(data.usuario.id);
                redirigirPorRol(data.usuario.rol);
            } else {
                mostrarMensaje('Credenciales incorrectas', true);
            }
        } catch (error) {
            mostrarMensaje('Error al iniciar sesión', true);
            console.error('Login error:', error);
        }
    });

    function mostrarMensaje(msg, esError = false) {
        loginMsg.textContent = msg;
        loginMsg.classList.toggle('text-danger', esError);
    }

    function guardarUsuario(usuario) {
        localStorage.setItem('usuario', JSON.stringify(usuario));
        localStorage.setItem('usuario_id', usuario.id);
    }

    function sincronizarCarrito(usuarioId) {
        const carritoGenerico = localStorage.getItem('carrito');
        if (carritoGenerico) {
            localStorage.setItem(`carrito_${usuarioId}`, carritoGenerico);
            localStorage.removeItem('carrito');
        }
    }

    function redirigirPorRol(rol) {
        const destino = rol.toLowerCase() === 'admin' || rol.toLowerCase() === 'administrador'
            ? '/html/administrador.html'
            : '/html/cliente.html';
        window.location.href = destino;
    }
});
