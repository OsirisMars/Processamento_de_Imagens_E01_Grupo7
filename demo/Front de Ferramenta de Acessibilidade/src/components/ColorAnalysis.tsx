import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface ColorAnalysisProps {
  imageUrl: string;
}

interface ColorInfo {
  color: string;
  percentage: number;
}

export function ColorAnalysis({ imageUrl }: ColorAnalysisProps) {
  const [dominantColors, setDominantColors] = useState<ColorInfo[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    analyzeColors();
  }, [imageUrl]);

  const analyzeColors = () => {
    setIsAnalyzing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      // Redimensionar para análise mais rápida
      const maxSize = 100;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Agrupar cores similares
      const colorMap = new Map<string, number>();
      
      for (let i = 0; i < data.length; i += 4) {
        const r = Math.round(data[i] / 30) * 30;
        const g = Math.round(data[i + 1] / 30) * 30;
        const b = Math.round(data[i + 2] / 30) * 30;
        const key = `${r},${g},${b}`;
        
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
      }

      // Obter as 5 cores mais dominantes
      const totalPixels = canvas.width * canvas.height;
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([color, count]) => {
          const [r, g, b] = color.split(',').map(Number);
          return {
            color: `rgb(${r}, ${g}, ${b})`,
            percentage: (count / totalPixels) * 100,
          };
        });

      setDominantColors(sortedColors);
      setIsAnalyzing(false);
    };

    img.onerror = () => {
      setIsAnalyzing(false);
    };

    img.src = imageUrl;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Análise de Cores</CardTitle>
      </CardHeader>
      <CardContent>
        {isAnalyzing ? (
          <p className="text-sm text-gray-500">Analisando...</p>
        ) : (
          <div className="space-y-2">
            {dominantColors.map((colorInfo, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded border border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: colorInfo.color }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Cor {index + 1}</span>
                    <Badge variant="secondary" className="text-xs">
                      {colorInfo.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all"
                      style={{ width: `${colorInfo.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
