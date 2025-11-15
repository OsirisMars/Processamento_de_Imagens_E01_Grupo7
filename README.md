Sistema de Manipulação de Canais de Cor

Aplicação web 100% client-side para manipulação de canais de cor e simulação de daltonismo, construída com React, TypeScript e a API de Canvas do HTML5.

🎯 Objetivo do Projeto

Este projeto é uma ferramenta de processamento de imagens moderna, executada inteiramente no navegador do usuário, com foco em acessibilidade e análise visual. A aplicação permite que os usuários façam upload de imagens e apliquem filtros e manipulações de canais de cor em tempo real, sem a necessidade de um servidor de backend.

O sistema foi originalmente concebido como parte de um trabalho acadêmico para a Universidade Tiradentes (Aracaju - SE, 2025).

✨ Funcionalidades Principais

Baseado na análise do App.tsx, o sistema suporta:

Upload de Imagens: Carregue qualquer arquivo de imagem (com validação de tipo).

Manipulação de Canais de Cor: Ajuste granular dos canais RGB (Vermelho, Verde, Azul), HSV (Matiz, Saturação, Valor) e LAB (Luminosidade, a, b).

Simulação de Daltonismo: Aplique filtros em tempo real para:

Protanopia

Deuteranopia

Tritanopia

Ajuste de Intensidade: Controle a intensidade do filtro de daltonismo aplicado.

Modo de Grade (Grid View): Visualize a imagem original e a processada lado a lado.

Exportação de Imagens: Salve a imagem processada nos formatos PNG ou JPG com qualidade ajustável.

Notificações (Toasts): Feedback instantâneo para o usuário sobre o carregamento e exportação de imagens.

🛠️ Stack de Tecnologias (100% Client-Side)

Toda a lógica de processamento de imagem é executada no navegador.

React (v18+): Biblioteca principal para a construção da interface de usuário (UI).

TypeScript (TSX): Utilizado para tipagem estática e componentes robustos.

Vite: Ferramenta de build e servidor de desenvolvimento de alta performance.

HTML5 Canvas API: O núcleo do processamento de imagem, usado para ler e manipular os pixels da imagem.

Sonner: Biblioteca de notificações (toasts) elegante e simples.

Node.js: Utilizado apenas para o ambiente de desenvolvimento (via Vite) e gerenciamento de pacotes (NPM). Não é usado como servidor de backend.

🚀 Como Executar Localmente

Este é um projeto padrão Vite.

Pré-requisitos:

Node.js (v18 ou superior)

NPM (geralmente incluído no Node.js)

Instalação e Execução:

Clone o repositório:

git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)


Navegue até a pasta do projeto:

cd seu-repositorio


Instale as dependências:

npm install


Inicie o servidor de desenvolvimento:

npm run dev


Abra seu navegador e acesse http://localhost:5173 (ou o endereço que o Vite fornecer).

👨‍💻 Autores (Grupo 7)

Emilly Vitória Cavalcante Siqueira Santos

Pedro Cruz Flores

Pedro Henrique Araújo Souza

Gladiston Teles de Meneses Filho

Guilherme Araújo Chaves
