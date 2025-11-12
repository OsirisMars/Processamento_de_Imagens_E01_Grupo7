
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from PIL import Image, ImageFilter, ImageOps, ImageEnhance
import io, os, pathlib

router = APIRouter()
BASE_DIR = pathlib.Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data" / "wireframe_contents"
PROCESSED_DIR = BASE_DIR / "data" / "processed"
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_FILTERS = ["grayscale", "blur", "edge", "contrast", "invert"]

def _open_image(path):
    try:
        img = Image.open(path).convert("RGB")
        return img
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao abrir imagem: {e}")

@router.get("/processed")
def list_processed():
    files = []
    for root, dirs, filenames in os.walk(PROCESSED_DIR):
        for fn in filenames:
            rel = os.path.relpath(os.path.join(root, fn), PROCESSED_DIR)
            files.append(rel.replace("\\", "/"))
    return {"processed": sorted(files)}

@router.post("/process-image")
async def process_image(path: str = Form(...), filter: str = Form(...), save_name: str = Form(None)):
    """Aplica um filtro em uma imagem existente no conteúdo extraído.
    - path: caminho relativo dentro de data/wireframe_contents (ex: src/assets/img.png)
    - filter: um dos ALLOWED_FILTERS
    - save_name: nome do arquivo salvo (opcional). Se omitido, será gerado automaticamente.
    Retorna o caminho relativo dentro de data/processed.
    """
    if filter not in ALLOWED_FILTERS:
        raise HTTPException(status_code=400, detail=f"Filtro inválido. Permitidos: {ALLOWED_FILTERS}")
    src = DATA_DIR / path
    if not src.exists() or not src.is_file():
        raise HTTPException(status_code=404, detail="Arquivo fonte não encontrado")
    img = _open_image(src)
    # aplicar filtro
    if filter == "grayscale":
        out = ImageOps.grayscale(img).convert("RGB")
    elif filter == "blur":
        out = img.filter(ImageFilter.GaussianBlur(radius=5))
    elif filter == "edge":
        out = img.filter(ImageFilter.FIND_EDGES)
    elif filter == "contrast":
        enhancer = ImageEnhance.Contrast(img)
        out = enhancer.enhance(1.8)
    elif filter == "invert":
        out = ImageOps.invert(img)
    else:
        out = img
    # salvar
    if save_name:
        out_name = save_name
    else:
        stem = pathlib.Path(path).stem
        out_name = f"{stem}_{filter}.png"
    out_path = PROCESSED_DIR / out_name
    out.save(out_path, format="PNG")
    return {"processed_path": os.path.relpath(out_path, PROCESSED_DIR).replace("\\", "/")}

@router.get("/compare")
def compare(path: str, processed: str):
    """Retorna uma imagem combinada (lado a lado) do original e do processado.
    - path: caminho relativo dentro de data/wireframe_contents (original)
    - processed: nome do arquivo em data/processed (processado)
    """
    src = DATA_DIR / path
    proc = PROCESSED_DIR / processed
    if not src.exists() or not src.is_file():
        raise HTTPException(status_code=404, detail="Arquivo original não encontrado")
    if not proc.exists() or not proc.is_file():
        raise HTTPException(status_code=404, detail="Arquivo processado não encontrado")
    img1 = _open_image(src)
    img2 = _open_image(proc)
    # redimensionar para a mesma altura
    h = min(img1.height, img2.height)
    def resize_keep_aspect(im, target_h):
        w = int(im.width * (target_h / im.height))
        return im.resize((w, target_h))
    r1 = resize_keep_aspect(img1, h)
    r2 = resize_keep_aspect(img2, h)
    # criar lado a lado
    combined = Image.new("RGB", (r1.width + r2.width, h))
    combined.paste(r1, (0,0))
    combined.paste(r2, (r1.width,0))
    buf = io.BytesIO()
    combined.save(buf, format="PNG")
    buf.seek(0)
    return FileResponse(buf, media_type="image/png", filename="compare.png")
