import { useEffect, useRef } from 'react';

type ColorBlindnessType = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

interface ColorBlindnessCanvasProps {
  imageUrl: string;
  filter: ColorBlindnessType;
  className?: string;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
  intensity?: number;
}

// Matrizes de transformação de cores para simulação de daltonismo
const colorBlindnessMatrices: Record<ColorBlindnessType, number[][]> = {
  none: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  // Protanopia (deficiência de vermelho)
  protanopia: [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758],
  ],
  // Deuteranopia (deficiência de verde)
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7],
  ],
  // Tritanopia (deficiência de azul)
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525],
  ],
};

export function ColorBlindnessCanvas({ imageUrl, filter, className, onCanvasReady, intensity = 100 }: ColorBlindnessCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Define as dimensões do canvas
      canvas.width = img.width;
      canvas.height = img.height;

      // Desenha a imagem original
      ctx.drawImage(img, 0, 0);

      // Aplica o filtro de daltonismo se necessário
      if (filter !== 'none') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const matrix = colorBlindnessMatrices[filter];
        const intensityFactor = intensity / 100;

        // Aplica a matriz de transformação em cada pixel
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Calcula as novas cores com a matriz
          const newR = matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b;
          const newG = matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b;
          const newB = matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b;

          // Aplica a intensidade (blend entre original e filtrado)
          data[i] = r + (newR - r) * intensityFactor;
          data[i + 1] = g + (newG - g) * intensityFactor;
          data[i + 2] = b + (newB - b) * intensityFactor;
        }

        ctx.putImageData(imageData, 0, 0);
      }

      // Notifica que o canvas está pronto
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
    };

    img.onerror = () => {
      console.error('Erro ao carregar imagem');
    };

    img.src = imageUrl;
  }, [imageUrl, filter, onCanvasReady, intensity]);

  return <canvas ref={canvasRef} className={className} />;
}
