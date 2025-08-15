window.onload = async () => { 
    const res = await fetch('http://127.0.0.1:8000/compras/');
    const data = await res.json();
    const contenedor = document.getElementById('comprasAdmin');
    contenedor.innerHTML = '';
    data.compras.forEach(compra => { 
        contenedor.innerHTML += `
            <div class="col-12 bg-white p-3 m-2 border rounded shadow">
                <h5>Compra #${compra.id}</h5>
                <p><strong>Nombre en tarjeta:</strong> ${compra.nombre_tarjeta}</p>
                <p><strong>Productos:</strong> ${compra.productos}</p>
            </div>
        `;
    });
};