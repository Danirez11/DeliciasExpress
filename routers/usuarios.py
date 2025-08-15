from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, EmailStr
from db import get_connection

router = APIRouter(prefix="/usuarios", tags=["usuarios"])

# 📌 Modelos
class Usuario(BaseModel):
    nombre: str
    telefono: str
    correo: EmailStr
    contraseña: str
    rol: str

class LoginData(BaseModel):
    correo: EmailStr
    contraseña: str

# 📌 Crear usuario
@router.post("/")
async def crear_usuario(usuario: Usuario):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            INSERT INTO usuarios (nombre, telefono, correo, contraseña, rol)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (usuario.nombre, usuario.telefono, usuario.correo, usuario.contraseña, usuario.rol)
        )
        conn.commit()
        return {"mensaje": "Usuario creado exitosamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear usuario: {str(e)}")
    finally:
        cursor.close()
        conn.close()

# 📌 Obtener usuarios (opcionalmente filtrado por admin_id)
@router.get("/")
def obtener_usuarios(admin_id: int = Query(None)):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        if admin_id is not None:
            cursor.execute(
                """
                SELECT id, nombre, correo, telefono
                FROM usuarios
                WHERE rol = 'cliente' AND id != %s
                """,
                (admin_id,)
            )
        else:
            cursor.execute(
                """
                SELECT id, nombre, correo, telefono
                FROM usuarios
                WHERE rol = 'cliente'
                """
            )
        resultado = cursor.fetchall()
        usuarios = [
            {
                "id": usr[0],
                "nombre": usr[1],
                "correo": usr[2],
                "telefono": usr[3]
            }
            for usr in resultado
        ]
        return {"usuarios": usuarios}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener usuarios: {str(e)}")
    finally:
        cursor.close()
        conn.close()

# 📌 Eliminar usuario
@router.delete("/{id}")
def eliminar_usuario(id: int):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM usuarios WHERE id = %s", (id,))
        conn.commit()
        return {"mensaje": "Usuario eliminado correctamente"}
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error al eliminar usuario: {str(error)}")
    finally:
        cursor.close()
        conn.close()

# 📌 Login
@router.post("/login")
async def login_usuario(datos: LoginData):
    correo = datos.correo.strip()
    contraseña = datos.contraseña.strip()

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            SELECT id, nombre, correo, telefono, rol
            FROM usuarios
            WHERE correo = %s AND contraseña = %s
            """,
            (correo, contraseña)
        )
        usuario = cursor.fetchone()
        if usuario:
            return {
                "usuario": {
                    "id": usuario[0],
                    "nombre": usuario[1],
                    "correo": usuario[2],
                    "telefono": usuario[3],
                    "rol": usuario[4]
                }
            }
        else:
            return {"usuario": None}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al iniciar sesión: {str(e)}")
    finally:
        cursor.close()
        conn.close()

# 📌 Actualizar usuario
@router.put("/{id}")
async def actualizar_usuario(id: int, usuario: Usuario):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            UPDATE usuarios
            SET nombre=%s, correo=%s, telefono=%s, contraseña=%s, rol=%s
            WHERE id=%s
            """,
            (usuario.nombre, usuario.correo, usuario.telefono, usuario.contraseña, usuario.rol, id)
        )
        conn.commit()
        return {"mensaje": "Usuario actualizado correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar usuario: {str(e)}")
    finally:
        cursor.close()
        conn.close()

# 📌 Obtener usuario por ID
@router.get("/{id}")
async def obtener_usuario(id: int):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            SELECT id, nombre, correo, telefono, rol
            FROM usuarios
            WHERE id=%s
            """,
            (id,)
        )
        usuario = cursor.fetchone()
        if usuario:
            return {
                "usuario": {
                    "id": usuario[0],
                    "nombre": usuario[1],
                    "correo": usuario[2],
                    "telefono": usuario[3],
                    "rol": usuario[4]
                }
            }
        else:
            return {"usuario": None}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener usuario: {str(e)}")
    finally:
        cursor.close()
        conn.close()
