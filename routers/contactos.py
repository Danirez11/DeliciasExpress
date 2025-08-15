# routers/contactos.py
from fastapi import APIRouter, Request
from db import get_connection  # ✅ Usamos el pool
from typing import List

router = APIRouter(prefix="/contactos", tags=["contactos"])

@router.post("/")
async def crear_contacto(request: Request):
    data = await request.json()
    nombre = data.get("nombre", "").strip()
    correo = data.get("correo", "").strip()
    mensaje = data.get("mensaje", "").strip()

    if not nombre or not correo or not mensaje:
        return {"error": "Todos los campos son obligatorios"}

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO contactos (nombre, correo, mensaje) VALUES (%s, %s, %s)",
            (nombre, correo, mensaje)
        )
        conn.commit()
        return {"mensaje": "Contacto creado exitosamente"}
    except Exception as error:
        return {"error": str(error)}
    finally:
        cursor.close()
        conn.close()

@router.get("/")
def obtener_contactos():
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT * FROM contactos")
        resultado = cursor.fetchall()

        contactos = []
        for fila in resultado:
            contactos.append({
                "id": fila[0],
                "nombre": fila[1],
                "correo": fila[2],
                "mensaje": fila[3]
            })

        return {"contactos": contactos}
    except Exception as error:
        return {"error": str(error)}
    finally:
        cursor.close()
        conn.close()

@router.get("/{id}")
def obtener_contacto(id: int):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT * FROM contactos WHERE id = %s", (id,))
        data = cursor.fetchone()

        if data:
            return {
                "id": data[0],
                "nombre": data[1],
                "correo": data[2],
                "mensaje": data[3]
            }
        else:
            return {"mensaje": "Contacto no encontrado"}
    except Exception as error:
        return {"error": str(error)}
    finally:
        cursor.close()
        conn.close()

@router.put("/{id}")
async def actualizar_contacto(id: int, request: Request):
    data = await request.json()
    nombre = data.get("nombre", "").strip()
    correo = data.get("correo", "").strip()
    mensaje = data.get("mensaje", "").strip()

    if not nombre or not correo or not mensaje:
        return {"error": "Todos los campos son obligatorios"}

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "UPDATE contactos SET nombre = %s, correo = %s, mensaje = %s WHERE id = %s",
            (nombre, correo, mensaje, id)
        )
        conn.commit()
        return {"mensaje": "Contacto actualizado correctamente"}
    except Exception as error:
        return {"error": str(error)}
    finally:
        cursor.close()
        conn.close()

@router.delete("/{id}")
def eliminar_contacto(id: int):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("DELETE FROM contactos WHERE id = %s", (id,))
        conn.commit()
        return {"mensaje": "Contacto eliminado correctamente"}
    except Exception as error:
        return {"error": str(error)}
    finally:
        cursor.close()
        conn.close()
