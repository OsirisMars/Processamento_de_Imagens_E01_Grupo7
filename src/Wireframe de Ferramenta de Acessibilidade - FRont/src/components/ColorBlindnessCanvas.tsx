import { useEffect, useRef } from 'react';
import { ColorChannels } from './ColorChannelManipulation';
import { rgbToHsv, hsvToRgb, rgbToLab, labToRgb } from '../utils/colorTransforms';

type ColorBlindnessType = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

interface ColorBlindnessCanvasProps {
  imageUrl: string;
  filter: ColorBlindnessType;
  className?: string;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
  intensity?: number;
  colorChannels?: ColorChannels;
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

export function ColorBlindnessCanvas({ imageUrl, filter, className, onCanvasReady, intensity = 100, colorChannels }: ColorBlindnessCanvasProps) {
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

      // Pega os dados da imagem
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Aplica manipulação de canais de cor primeiro
      if (colorChannels) {
        for (let i = 0; i < data.length; i += 4) {
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];

          // Aplica ajustes RGB
          r = Math.max(0, Math.min(255, r + colorChannels.rgb.r * 2.55));
          g = Math.max(0, Math.min(255, g + colorChannels.rgb.g * 2.55));
          b = Math.max(0, Math.min(255, b + colorChannels.rgb.b * 2.55));

          // Aplica ajustes HSV
          if (colorChannels.hsv.h !== 0 || colorChannels.hsv.s !== 0 || colorChannels.hsv.v !== 0) {
            const hsv = rgbToHsv(r, g, b);
            hsv.h = (hsv.h + colorChannels.hsv.h + 360) % 360;
            hsv.s = Math.max(0, Math.min(100, hsv.s + colorChannels.hsv.s));
            hsv.v = Math.max(0, Math.min(100, hsv.v + colorChannels.hsv.v));
            const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
            r = rgb.r;
            g = rgb.g;
            b = rgb.b;
          }

          // Aplica ajustes LAB
          if (colorChannels.lab.l !== 0 || colorChannels.lab.a !== 0 || colorChannels.lab.b !== 0) {
            const lab = rgbToLab(r, g, b);
            lab.l = Math.max(0, Math.min(100, lab.l + colorChannels.lab.l));
            lab.a = lab.a + colorChannels.lab.a;
            lab.b = lab.b + colorChannels.lab.b;
            const rgb = labToRgb(lab.l, lab.a, lab.b);
            r = rgb.r;
            g = rgb.g;
            b = rgb.b;
          }

          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
        }
      }

      // Aplica o filtro de daltonismo se necessário
      if (filter !== 'none') {
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
      }

      ctx.putImageData(imageData, 0, 0);

      // Notifica que o canvas está pronto
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
    };

    img.onerror = () => {
      console.error('Erro ao carregar imagem');
    };

    img.src = imageUrl;
  }, [imageUrl, filter, onCanvasReady, intensity, colorChannels]);

  return <canvas ref={canvasRef} className={className} />;
}
