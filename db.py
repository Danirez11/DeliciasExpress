# db.py
from mysql.connector import pooling, errors

dbconfig = {
    "host": "blbljyfwic7vbhv0ueq1-mysql.services.clever-cloud.com",
    "user": "ujswtbyiwvpztvtd",
    "password": "HMwRoVsHgLPWUBSs3Tdr",
    "database": "blbljyfwic7vbhv0ueq1",
    "port": 3306
}

_connection_pool = None

def get_connection():
    global _connection_pool
    if _connection_pool is None:
        try:
            _connection_pool = pooling.MySQLConnectionPool(
                pool_name="mypool",
                pool_size=3,  # ✅ menor que el límite
                pool_reset_session=True,
                **dbconfig
            )
        except errors.ProgrammingError as e:
            raise RuntimeError(f"Error al crear el pool: {e}")
    try:
        return _connection_pool.get_connection()
    except errors.PoolError as e:
        raise RuntimeError(f"No se pudo obtener conexión del pool: {e}")
