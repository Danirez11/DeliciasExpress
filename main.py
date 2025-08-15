from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# Routers
from routers import usuarios, productos

app = FastAPI()

# CORS para permitir peticiones del frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redirección a index.html
@app.get("/")
async def root(request: Request):
    return RedirectResponse(url="/html/index.html")

# Montar routers
app.include_router(usuarios.router)
app.include_router(productos.router)

# Archivos estáticos
app.mount("/css", StaticFiles(directory="css"), name="css")
app.mount("/js", StaticFiles(directory="js"), name="js")
app.mount("/img", StaticFiles(directory="img"), name="img")
app.mount("/html", StaticFiles(directory="html"), name="html")
