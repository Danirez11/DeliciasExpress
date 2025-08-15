const getIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
};

document.addEventListener('DOMContentLoaded', async () => {
    const id = getIdFromUrl();
    const mensajeDiv = document.getElementById('mensajeEditar');
    if (!id) {
        mensajeDiv.textContent = "ID de producto no especificado.";
        mensajeDiv.className = "alert alert-danger";
        return;
    }

  
    try {
        const res = await fetch(`http://127.0.0.1:8000/productos/${id}`);
        const data = await res.json();
        if (data.producto) {
            document.getElementById('nombre').value = data.producto.nombre || '';
            document.getElementById('descripcion').value = data.producto.descripcion || '';
            document.getElementById('precio').value = data.producto.precio || '';
            document.getElementById('imagen_url').value = data.producto.imagen_url || '';
            document.getElementById('stock').value = data.producto.stock || '';
        } else {
            mensajeDiv.textContent = "Producto no encontrado.";
            mensajeDiv.className = "alert alert-danger";
        }
    } catch (err) {
        mensajeDiv.textContent = "Error al cargar el producto.";
        mensajeDiv.className = "alert alert-danger";
    }

    
    document.getElementById('formEditarProducto').onsubmit = async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const descripcion = document.getElementById('descripcion').value;
        const precio = document.getElementById('precio').value;
        const imagen_url = document.getElementById('imagen_url').value;
        const stock = document.getElementById('stock').value;

        try {
            const res = await fetch(`http://127.0.0.1:8000/productos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, descripcion, precio, imagen_url, stock })
            });
            const data = await res.json();
            if (res.ok) {
                mensajeDiv.textContent = data.mensaje || "Producto actualizado correctamente";
                mensajeDiv.className = "alert alert-success";
            } else {
                mensajeDiv.textContent = data.mensaje || "Error al actualizar el producto";
                mensajeDiv.className = "alert alert-danger";
            }
        } catch (err) {
            mensajeDiv.textContent = "Error al actualizar el producto.";
            mensajeDiv.className = "alert alert-danger";
        }
    };
});