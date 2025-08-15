# routers/pedidos.py
from fastapi import APIRouter, Request
from db import get_connection  # ✅ Usamos el pool

router = APIRouter(prefix="/pedidos", tags=["pedidos"])

@router.post("/")
async def crear_pedido(request: Request):
    data = await request.json()
    id_usuario = data.get("id_usuario")
    id_producto = data.get("id_producto")
    cantidad = data.get("cantidad")

    if not id_usuario or not id_producto or not cantidad:
        return {"error": "Todos los campos son obligatorios"}

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO pedidos (id_usuario, id_producto, cantidad) VALUES (%s, %s, %s)",
            (id_usuario, id_producto, cantidad)
        )
        conn.commit()
        return {"mensaje": "Pedido creado exitosamente"}
    except Exception as error:
        return {"error": str(error)}
    finally:
        cursor.close()
        conn.close()

@router.get("/")
def obtener_pedidos():
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT * FROM pedidos")
        resultado = cursor.fetchall()

        pedidos = []
        for fila in resultado:
            pedidos.append({
                "id": fila[0],
                "id_usuario": fila[1],
                "id_producto": fila[2],
                "cantidad": fila[3]
            })

        return {"pedidos": pedidos}
    except Exception as error:
        return {"error": str(error)}
    finally:
        cursor.close()
        conn.close()

@router.get("/{id}")
def obtener_pedido(id: int):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT * FROM pedidos WHERE id = %s", (id,))
        data = cursor.fetchone()

        if data:
            return {
                "id": data[0],
                "id_usuario": data[1],
                "id_producto": data[2],
                "cantidad": data[3]
            }
        else:
            return {"mensaje": "Pedido no encontrado"}
    except Exception as error:
        return {"error": str(error)}
    finally:
        cursor.close()
        conn.close()

@router.put("/{id}")
async def actualizar_pedido(id: int, request: Request):
    data = await request.json()
    id_usuario = data.get("id_usuario")
    id_producto = data.get("id_producto")
    cantidad = data.get("cantidad")

    if not id_usuario or not id_producto or not cantidad:
        return {"error": "Todos los campos son obligatorios"}

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "UPDATE pedidos SET id_usuario = %s, id_producto = %s, cantidad = %s WHERE id = %s",
            (id_usuario, id_producto, cantidad, id)
        )
        conn.commit()
        return {"mensaje": "Pedido actualizado correctamente"}
    except Exception as error:
        return {"error": str(error)}
    finally:
        cursor.close()
        conn.close()

@router.delete("/{id}")
def eliminar_pedido(id: int):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("DELETE FROM pedidos WHERE id = %s", (id,))
        conn.commit()
        return {"mensaje": "Pedido eliminado correctamente"}
    except Exception as error:
        return {"error": str(error)}
    finally:
        cursor.close()
        conn.close()
