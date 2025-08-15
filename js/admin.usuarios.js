const API_URL = 'https://deliciasexpress-1.onrender.com';
let usuariosGlobal = [];

document.addEventListener('DOMContentLoaded', async () => {
  await cargarUsuarios();
});

const cargarUsuarios = async () => {
  const tbody = document.querySelector('#tabla-usuarios tbody');
  tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Cargando usuarios...</td></tr>';
  try {
    const res = await fetch(`${API_URL}/usuarios`);
    const data = await res.json();
    tbody.innerHTML = '';

    if (Array.isArray(data.usuarios) && data.usuarios.length > 0) {
      usuariosGlobal = data.usuarios;
      data.usuarios.forEach(usuario => {
        tbody.innerHTML += `
          <tr>
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.correo}</td>
            <td>${usuario.telefono}</td>
            <td>
              <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
            </td>
          </tr>
        `;
      });
    } else {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay usuarios registrados.</td></tr>';
    }
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error al cargar usuarios.</td></tr>';
  }
};

const eliminarUsuario = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
  try {
    const res = await fetch(`${API_URL}/usuarios/${id}`, { method: 'DELETE' });
    const data = await res.json();
    alert(data.mensaje || 'Usuario eliminado');
    await cargarUsuarios();
  } catch (err) {
    alert('Error al eliminar el usuario');
  }
};

document.getElementById('busqueda').addEventListener('input', function () {
  const filtro = this.value.toLowerCase();
  document.querySelectorAll('#tabla-usuarios tbody tr').forEach(tr => {
    const texto = tr.textContent.toLowerCase();
    tr.style.display = texto.includes(filtro) ? '' : 'none';
  });
});
