# routers/productos.py
from fastapi import APIRouter, Request
from db import get_connection  # ✅ Usamos el pool

router = APIRouter(prefix="/productos", tags=["productos"])

@router.get("/")
def obtener_productos():
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT id, nombre, descripcion, precio, imagen_url, stock FROM productos")
        resultado = cursor.fetchall()

        productos = []
        for prod in resultado:
            productos.append({
                "id": prod[0],
                "nombre": prod[1],
                "descripcion": prod[2],
                "precio": prod[3],
                "imagen_url": prod[4] if prod[4] else "",
                "stock": prod[5]
            })

        return {"productos": productos}
    finally:
        cursor.close()
        conn.close()

@router.get("/{id}")
def obtener_producto(id: int):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "SELECT id, nombre, descripcion, precio, imagen_url, stock FROM productos WHERE id = %s",
            (id,)
        )
        data = cursor.fetchone()

        if data:
            return {
                "producto": {
                    "id": data[0],
                    "nombre": data[1],
                    "descripcion": data[2],
                    "precio": data[3],
                    "imagen_url": data[4] if data[4] else "",
                    "stock": data[5]
                }
            }
        else:
            return {"mensaje": "Producto no encontrado"}
    finally:
        cursor.close()
        conn.close()

@router.post("/")
async def crear_producto(request: Request):
    datos = await request.json()
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO productos (nombre, descripcion, precio, imagen_url, stock)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (
                datos["nombre"],
                datos["descripcion"],
                datos["precio"],
                datos["imagen_url"],
                datos["stock"]
            )
        )
        conn.commit()
        return {"mensaje": "Producto creado exitosamente"}
    finally:
        cursor.close()
        conn.close()

@router.put("/{id}")
async def actualizar_producto(id: int, producto: dict):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            UPDATE productos
            SET nombre=%s, descripcion=%s, precio=%s, imagen_url=%s, stock=%s
            WHERE id=%s
            """,
            (
                producto["nombre"],
                producto["descripcion"],
                producto["precio"],
                producto["imagen_url"],
                producto["stock"],
                id
            )
        )
        conn.commit()
        return {"mensaje": "Producto actualizado correctamente"}
    finally:
        cursor.close()
        conn.close()

@router.delete("/{id}")
async def eliminar_producto(id: int):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("DELETE FROM productos WHERE id = %s", (id,))
        conn.commit()
        return {"mensaje": "Producto eliminado exitosamente"}
    finally:
        cursor.close()
        conn.close()
