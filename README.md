# 🎨 Sistema de Manipulação de Canais de Cor para Aprimoramento de Imagens

## 📌 Objetivo
O projeto **“Sistema de Manipulação de Canais de Cor para Aprimoramento de Imagens”** é uma aplicação **web full-stack** que combina uma interface moderna com um backend robusto para oferecer recursos de manipulação e aprimoramento de imagens.  

A aplicação permite **separar e visualizar canais de cor (RGB, HSV e LAB)**, **simular daltonismo (protanopia, deuteranopia, tritanopia)**, **converter imagens para diferentes formatos (PNG, BMP, JPG)** e contribuir para a **acessibilidade digital e inclusão visual**, possibilitando que profissionais adaptem materiais para pessoas com deficiência na percepção de cores.  

## 🏗️ Arquitetura e Tecnologias
O sistema é construído em duas camadas que se comunicam via **API**:

- **Frontend**: desenvolvido em **React**, utilizando **Vite** para build e servidor de desenvolvimento rápido, com **TypeScript (TSX)** para tipagem estática e componentes robustos. O ambiente é gerenciado pelo **Node.js**.  
- **Backend**: implementado em **Python 3.10+**, utilizando **OpenCV (cv2)** para manipulação e simulação de daltonismo, **NumPy** para cálculos matriciais e frameworks como **Flask** ou **FastAPI** para disponibilizar a API consumida pelo frontend.  

Essa combinação garante uma interface amigável e responsiva para o usuário, enquanto o backend realiza o processamento pesado das imagens.

## ▶️ Instruções de Execução
Para rodar o projeto, é necessário iniciar o **Frontend (React)** e o **Backend (Python)** em terminais separados.

### 🔧 Requisitos
- **Python 3.10+**  
- **Node.js 18+ (com NPM)**  

### 🖥️ Passos

#### 1. Backend (Servidor Python)
# 1. Navegue até a pasta do backend
cd backend

# 2. Instale as dependências (exemplo com Flask)
pip install opencv-python numpy flask flask-cors

# 3. Inicie o servidor da API
python app.py

#### 2. Frontend (Cliente React)
# 1. Abra um NOVO terminal e navegue até a pasta do frontend
cd frontend

# 2. Instale as dependências do Node
npm install

# 3. Inicie o servidor de desenvolvimento Vite
npm run dev

