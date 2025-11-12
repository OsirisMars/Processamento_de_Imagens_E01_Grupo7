
# Backend FastAPI para "Wireframe de Ferramenta de Acessibilidade"

## O que inclui
- Estrutura básica de FastAPI em `app/main.py`
- Endpoints:
  - `GET /` - mensagem de saúde
  - `GET /files` - lista arquivos extraídos do zip
  - `GET /download/{path}` - baixa arquivo específico
  - `POST /upload-file` - faz upload de arquivos para `uploads/`
  - `POST /replace-file` - substitui arquivo no conteúdo extraído (parâmetro form `path` com o caminho relativo)
  - `POST /export-zip` - recompacta o conteúdo extraído e retorna o .zip

## Como rodar (local)
1. Criar um venv e instalar dependências:
   ```bash
   python -m venv venv
   source venv/bin/activate  # ou venv\Scripts\activate no Windows
   pip install -r requirements.txt
   ```
2. Rodar com uvicorn:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## Observações
- Os arquivos originais foram copiados para `data/wireframe_contents` e são servidos em `/static`.
- Endpoint `/replace-file` realiza backup do arquivo substituído com sufixo `.bak`.
