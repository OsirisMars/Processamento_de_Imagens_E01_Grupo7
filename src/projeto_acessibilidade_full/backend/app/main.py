
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import os, zipfile, shutil, io, pathlib

BASE_DIR = pathlib.Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data" / "wireframe_contents"
UPLOADS_DIR = BASE_DIR / "uploads"
EXPORT_DIR = BASE_DIR / "export"

os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(EXPORT_DIR, exist_ok=True)

app = FastAPI(title="Backend - Wireframe Accessibility Tool")\n\nfrom .image_processing import router as image_router\napp.include_router(image_router, prefix="/image")

# Serve static files (original contents) under /static
app.mount("/static", StaticFiles(directory=str(DATA_DIR)), name="static")

@app.get("/files")
def list_files():
    """Lista arquivos extraídos do zip (relative paths)."""
    files = []
    for root, dirs, filenames in os.walk(DATA_DIR):
        for fn in filenames:
            full = os.path.join(root, fn)
            rel = os.path.relpath(full, DATA_DIR)
            files.append(rel.replace('\\\', '/'))
    return JSONResponse(content={"files": sorted(files)})

@app.get("/download/{path:path}")
def download_file(path: str):
    """Baixa um arquivo do conteúdo extraído."""
    target = DATA_DIR / path
    if not target.exists() or not target.is_file():
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")
    return FileResponse(path=str(target), filename=target.name)

@app.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):
    """Faz upload de um arquivo para a pasta uploads."""
    dest = UPLOADS_DIR / file.filename
    with open(dest, "wb") as f:
        content = await file.read()
        f.write(content)
    return {"uploaded": file.filename, "size": len(content)}

@app.post("/replace-file")
async def replace_file(path: str = Form(...), file: UploadFile = File(...)):
    """Substitui um arquivo dentro do conteúdo extraído (path relativo)."""
    target = DATA_DIR / path
    if not target.exists():
        raise HTTPException(status_code=404, detail="Arquivo alvo não existe")
    # backup
    backup = str(target) + ".bak"
    shutil.copy2(str(target), backup)
    with open(target, "wb") as f:
        f.write(await file.read())
    return {"replaced": path, "backup": os.path.basename(backup)}

@app.post("/export-zip")
def export_zip(name: str = "backend_export.zip"):
    """Compacta a pasta data/wireframe_contents num zip para download."""
    out_path = EXPORT_DIR / name
    with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(DATA_DIR):
            for f in files:
                full = os.path.join(root, f)
                rel = os.path.relpath(full, DATA_DIR)
                zf.write(full, arcname=rel)
    return FileResponse(path=str(out_path), filename=name)

@app.get("/")
def home():
    return {"message": "Backend rodando. Use /files para listar, /static para ver arquivos estáticos."}
