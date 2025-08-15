document.addEventListener('DOMContentLoaded', () => {
  cargarUsuarios();
});

const modalEditar = new bootstrap.Modal(document.getElementById('modalEditarUsuario'));

const cargarUsuarios = async () => {
  const tbody = document.querySelector('#tabla-usuarios tbody');
  tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Cargando usuarios...</td></tr>';
  try {
    const res = await fetch('http://127.0.0.1:8000/usuarios/');
    const data = await res.json();
    tbody.innerHTML = '';
    if (Array.isArray(data.usuarios) && data.usuarios.length > 0) {
      data.usuarios.forEach(usuario => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${usuario.id}</td>
          <td>${usuario.nombre}</td>
          <td>${usuario.correo}</td>
          <td>${usuario.telefono}</td>
          <td>
            <button class="btn btn-primary btn-sm me-2" onclick="mostrarEditarUsuario(${usuario.id}, '${usuario.nombre}', '${usuario.correo}', '${usuario.telefono}')">Actualizar</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
          </td>
        `;
        tbody.appendChild(fila);
      });

      // ✅ DataTable con idioma en español (HTTPS para evitar CORS)
      $('#tabla-usuarios').DataTable({
        destroy: true,
        responsive: true,
        language: {
          url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
        }
      });

    } else {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay usuarios registrados.</td></tr>';
    }
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error al cargar usuarios.</td></tr>';
  }
};

window.mostrarEditarUsuario = (id, nombre, correo, telefono) => {
  document.getElementById('usuario_id').value = id;
  document.getElementById('nombre').value = nombre;
  document.getElementById('correo').value = correo;
  document.getElementById('telefono').value = telefono;
  document.getElementById('mensajeEditarUsuario').textContent = '';
  document.getElementById('mensajeEditarUsuario').className = '';
  modalEditar.show();
};

const eliminarUsuario = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
  try {
    const res = await fetch(`http://127.0.0.1:8000/usuarios/${id}`, { method: 'DELETE' });
    const data = await res.json();
    alert(data.mensaje || 'Usuario eliminado');
    cargarUsuarios();
  } catch (err) {
    alert('Error al eliminar el usuario');
  }
};

document.getElementById('formEditarUsuario').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('usuario_id').value;
  const nombre = document.getElementById('nombre').value;
  const correo = document.getElementById('correo').value;
  const telefono = document.getElementById('telefono').value;
  const mensajeDiv = document.getElementById('mensajeEditarUsuario');

  try {
    const res = await fetch(`http://127.0.0.1:8000/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo, telefono })
    });
    const data = await res.json();
    if (res.ok) {
      mensajeDiv.textContent = data.mensaje || "Usuario actualizado correctamente";
      mensajeDiv.className = "alert alert-success";
      modalEditar.hide();
      cargarUsuarios();
    } else {
      mensajeDiv.textContent = data.mensaje || "Error al actualizar el usuario";
      mensajeDiv.className = "alert alert-danger";
    }
  } catch (err) {
    mensajeDiv.textContent = "Error de conexión con el servidor";
    mensajeDiv.className = "alert alert-danger";
  }
});
