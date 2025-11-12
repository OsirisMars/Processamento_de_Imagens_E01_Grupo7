import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { rgbToHsv, hsvToRgb, rgbToLab, labToRgb } from '../utils/colorTransforms';
import { ColorChannels } from './ColorChannelManipulation';
import { Loader2 } from 'lucide-react';

interface ColorVariationData {
  avgColorVariation: number;
  avgSaturationVariation: number;
  avgColorChange: number;
  avgSaturationChange: number;
  redData: { intensity: number; saturation: number }[];
  greenData: { intensity: number; saturation: number }[];
  blueData: { intensity: number; saturation: number }[];
}

interface ColorVariationAnalysisProps {
  imageUrl: string;
  colorChannels: ColorChannels;
  isProcessing?: boolean;
}

export function ColorVariationAnalysis({ imageUrl, colorChannels, isProcessing = false }: ColorVariationAnalysisProps) {
  const [variationData, setVariationData] = useState<ColorVariationData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const analyzeImage = async () => {
      setLoading(true);
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          
          if (!ctx) {
            setLoading(false);
            return;
          }

          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          let totalColorVariation = 0;
          let totalSaturationVariation = 0;
          let totalColorChange = 0;
          let totalSaturationChange = 0;
          let pixelCount = 0;

          const redData: { intensity: number; saturation: number }[] = [];
          const greenData: { intensity: number; saturation: number }[] = [];
          const blueData: { intensity: number; saturation: number }[] = [];

          // Amostragem a cada 10 pixels para performance
          for (let i = 0; i < data.length; i += 40) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];

            // Calcula HSV original
            const hsvOriginal = rgbToHsv(r, g, b);
            
            // Aplica manipulação (igual ao ColorBlindnessCanvas)
            // RGB
            let rManipulated = Math.max(0, Math.min(255, r + colorChannels.rgb.r * 2.55));
            let gManipulated = Math.max(0, Math.min(255, g + colorChannels.rgb.g * 2.55));
            let bManipulated = Math.max(0, Math.min(255, b + colorChannels.rgb.b * 2.55));

            // HSV
            if (colorChannels.hsv.h !== 0 || colorChannels.hsv.s !== 0 || colorChannels.hsv.v !== 0) {
              const hsv = rgbToHsv(rManipulated, gManipulated, bManipulated);
              hsv.h = (hsv.h + colorChannels.hsv.h + 360) % 360;
              hsv.s = Math.max(0, Math.min(100, hsv.s + colorChannels.hsv.s));
              hsv.v = Math.max(0, Math.min(100, hsv.v + colorChannels.hsv.v));
              const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
              rManipulated = rgb.r;
              gManipulated = rgb.g;
              bManipulated = rgb.b;
            }

            // LAB
            if (colorChannels.lab.l !== 0 || colorChannels.lab.a !== 0 || colorChannels.lab.b !== 0) {
              const lab = rgbToLab(rManipulated, gManipulated, bManipulated);
              lab.l = Math.max(0, Math.min(100, lab.l + colorChannels.lab.l));
              lab.a = lab.a + colorChannels.lab.a;
              lab.b = lab.b + colorChannels.lab.b;
              const rgb = labToRgb(lab.l, lab.a, lab.b);
              rManipulated = rgb.r;
              gManipulated = rgb.g;
              bManipulated = rgb.b;
            }

            const hsvManipulated = rgbToHsv(rManipulated, gManipulated, bManipulated);
            
            // Variação de cor da imagem manipulada (baseado na intensidade dos canais RGB)
            const avgIntensity = (rManipulated + gManipulated + bManipulated) / 3;
            const colorVariation = Math.sqrt(
              Math.pow(rManipulated - avgIntensity, 2) +
              Math.pow(gManipulated - avgIntensity, 2) +
              Math.pow(bManipulated - avgIntensity, 2)
            ) / 3;

            // Mudança de cor entre original e manipulada
            const colorChange = Math.sqrt(
              Math.pow(rManipulated - r, 2) +
              Math.pow(gManipulated - g, 2) +
              Math.pow(bManipulated - b, 2)
            ) / 3;

            // Mudança de saturação
            const saturationChange = Math.abs(hsvManipulated.s - hsvOriginal.s);

            totalColorVariation += colorVariation;
            totalSaturationVariation += hsvManipulated.s;
            totalColorChange += colorChange;
            totalSaturationChange += saturationChange;
            pixelCount++;

            // Dados para gráficos de dispersão (amostragem ainda menor)
            if (pixelCount % 50 === 0) {
              redData.push({ intensity: rManipulated, saturation: hsvManipulated.s });
              greenData.push({ intensity: gManipulated, saturation: hsvManipulated.s });
              blueData.push({ intensity: bManipulated, saturation: hsvManipulated.s });
            }
          }

          setVariationData({
            avgColorVariation: totalColorVariation / pixelCount,
            avgSaturationVariation: totalSaturationVariation / pixelCount,
            avgColorChange: totalColorChange / pixelCount,
            avgSaturationChange: totalSaturationChange / pixelCount,
            redData: redData.slice(0, 200), // Limita a 200 pontos
            greenData: greenData.slice(0, 200),
            blueData: blueData.slice(0, 200),
          });
          setLoading(false);
        };

        img.onerror = () => {
          setLoading(false);
        };

        img.src = imageUrl;
      } catch (error) {
        console.error('Erro ao analisar imagem:', error);
        setLoading(false);
      }
    };

    if (imageUrl) {
      analyzeImage();
    }
  }, [imageUrl, colorChannels]);

  if (loading || isProcessing) {
    return (
      <div className="space-y-3">
        <Label className="text-gray-700">Análise de Variação de Cores</Label>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (!variationData) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Label className="text-gray-700">Análise de Variação de Cores</Label>
      
      {/* Métricas */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3">
          <div className="text-xs text-gray-500 mb-1">Variação Média de Cor</div>
          <div className="text-lg text-gray-900">{variationData.avgColorVariation.toFixed(2)}</div>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-gray-500 mb-1">Saturação Média</div>
          <div className="text-lg text-gray-900">{variationData.avgSaturationVariation.toFixed(2)}%</div>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-gray-500 mb-1">Mudança de Cor</div>
          <div className="text-lg text-gray-900">{variationData.avgColorChange.toFixed(2)}</div>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-gray-500 mb-1">Mudança de Saturação</div>
          <div className="text-lg text-gray-900">{variationData.avgSaturationChange.toFixed(2)}%</div>
        </Card>
      </div>

      {/* Gráfico de dispersão - Canal Vermelho */}
      <Card className="p-3">
        <div className="text-xs text-gray-700 mb-2">Canal Vermelho: Intensidade vs Saturação</div>
        <ResponsiveContainer width="100%" height={150}>
          <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number" 
              dataKey="intensity" 
              name="Intensidade" 
              domain={[0, 255]}
              tick={{ fontSize: 10 }}
              stroke="#999"
            />
            <YAxis 
              type="number" 
              dataKey="saturation" 
              name="Saturação" 
              domain={[0, 100]}
              tick={{ fontSize: 10 }}
              stroke="#999"
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ fontSize: 11 }}
            />
            <Scatter 
              data={variationData.redData} 
              fill="#ef4444" 
              fillOpacity={0.6}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </Card>

      {/* Gráfico de dispersão - Canal Verde */}
      <Card className="p-3">
        <div className="text-xs text-gray-700 mb-2">Canal Verde: Intensidade vs Saturação</div>
        <ResponsiveContainer width="100%" height={150}>
          <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number" 
              dataKey="intensity" 
              name="Intensidade" 
              domain={[0, 255]}
              tick={{ fontSize: 10 }}
              stroke="#999"
            />
            <YAxis 
              type="number" 
              dataKey="saturation" 
              name="Saturação" 
              domain={[0, 100]}
              tick={{ fontSize: 10 }}
              stroke="#999"
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ fontSize: 11 }}
            />
            <Scatter 
              data={variationData.greenData} 
              fill="#22c55e" 
              fillOpacity={0.6}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </Card>

      {/* Gráfico de dispersão - Canal Azul */}
      <Card className="p-3">
        <div className="text-xs text-gray-700 mb-2">Canal Azul: Intensidade vs Saturação</div>
        <ResponsiveContainer width="100%" height={150}>
          <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number" 
              dataKey="intensity" 
              name="Intensidade" 
              domain={[0, 255]}
              tick={{ fontSize: 10 }}
              stroke="#999"
            />
            <YAxis 
              type="number" 
              dataKey="saturation" 
              name="Saturação" 
              domain={[0, 100]}
              tick={{ fontSize: 10 }}
              stroke="#999"
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ fontSize: 11 }}
            />
            <Scatter 
              data={variationData.blueData} 
              fill="#3b82f6" 
              fillOpacity={0.6}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
