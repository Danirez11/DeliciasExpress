# routers/compras.py
from fastapi import APIRouter
from pydantic import BaseModel
from db import get_connection  # ✅ Usamos el pool desde db.py

router = APIRouter()

class Compra(BaseModel):
    nombreTarjeta: str
    numeroTarjeta: str
    fechaVencimiento: str
    cvv: str
    productos: list

@router.post("/")
async def registrar_compra(compra: Compra):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO compras (nombre_tarjeta, numero_tarjeta, fecha_vencimiento, cvv, productos)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (
                compra.nombreTarjeta,
                compra.numeroTarjeta,
                compra.fechaVencimiento,
                compra.cvv,
                str(compra.productos)
            )
        )
        conn.commit()
        return {"mensaje": "Compra registrada exitosamente"}
    except Exception as e:
        return {"error": f"Error al registrar la compra: {e}"}
    finally:
        cursor.close()
        conn.close()

@router.get("/")
def obtener_compras():
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT * FROM compras")
        resultado = cursor.fetchall()
        compras = []
        for comp in resultado:
            compras.append({
                "id": comp[0],
                "nombre_tarjeta": comp[1],
                "numero_tarjeta": comp[2],
                "fecha_vencimiento": comp[3],
                "cvv": comp[4],
                "productos": comp[5]
            })
        return {"compras": compras}
    finally:
        cursor.close()
        conn.close()
