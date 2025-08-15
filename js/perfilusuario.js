document.addEventListener('DOMContentLoaded', async () => {
  const perfilMsg = document.getElementById('perfilMsg');
  const form = document.getElementById('editarPerfilForm');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario || !usuario.id) {
    perfilMsg.textContent = "No se encontró el usuario.";
    perfilMsg.className = "alert alert-warning mt-2";
    form.classList.add("d-none");
    return;
  }

  // Cargar datos del usuario
  try {
    const res = await fetch(`http://127.0.0.1:8000/usuarios/${usuario.id}`);
    const data = await res.json();

    if (data.usuario) {
      document.getElementById('nombre').value = data.usuario.nombre || '';
      document.getElementById('telefono').value = data.usuario.telefono || '';
      document.getElementById('email').value = data.usuario.correo || '';
    } else {
      perfilMsg.textContent = "Usuario no encontrado.";
      perfilMsg.className = "alert alert-warning mt-2";
    }
  } catch (err) {
    perfilMsg.textContent = "Error al cargar datos del usuario.";
    perfilMsg.className = "alert alert-danger mt-2";
  }

  // Actualizar perfil
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const correo = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
      const res = await fetch(`http://127.0.0.1:8000/usuarios/${usuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, telefono, correo, password })
      });

      const data = await res.json();
      perfilMsg.textContent = data.mensaje || "Perfil actualizado correctamente.";
      perfilMsg.className = "alert alert-success mt-2";
    } catch (err) {
      perfilMsg.textContent = "Error al actualizar el perfil.";
      perfilMsg.className = "alert alert-danger mt-2";
    }
  });
});
