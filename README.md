# Sistema de Manipulação de Canais de Cor para Aprimoramento de Imagens

## Objetivo do Módulo Desenvolvido
O projeto **“Sistema de Manipulação de Canais de Cor para Aprimoramento de Imagens”** tem como objetivo desenvolver um **software de processamento de imagens** em Python que permite:
- Separar e visualizar canais de cor (RGB, HSV e LAB);
- **Simular daltonismo** (protanopia, deuteranopia e tritanopia);
- **Converter imagens** para diferentes formatos (PNG, BMP, JPG);
- Contribuir para a **acessibilidade digital** e **inclusão visual**, permitindo que profissionais adaptem materiais para pessoas com deficiência na percepção de cores.

O sistema foi projetado para uso em setores públicos (como educação e comunicação social), com foco na acessibilidade e otimização visual de imagens.

---

## Bibliotecas Utilizadas
| Biblioteca | Função |
|-------------|--------|
| **OpenCV (cv2)** | Leitura, exibição, conversão e manipulação de imagens; simulação de daltonismo. |
| **NumPy** | Operações matriciais para cálculos de cores e transformações. |
| **Pillow (PIL)** | Conversão e salvamento de imagens em diferentes formatos. |
| **Matplotlib** | Exibição e comparação visual de imagens processadas. |
| **Google Colab (files, patches)** | Upload e visualização de imagens diretamente em notebooks Colab. |

---

## Instruções de Execução

### Requisitos:
- **Python 3.10+**
- Instalar as bibliotecas necessárias:
  ```bash
  pip install opencv-python pillow numpy matplotlib
