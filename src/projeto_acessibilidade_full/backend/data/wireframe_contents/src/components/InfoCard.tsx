import { Info } from 'lucide-react';
import { Card, CardContent } from './ui/card';

type ColorBlindnessType = 'protanopia' | 'deuteranopia' | 'tritanopia';

interface InfoCardProps {
  type: ColorBlindnessType;
}

const colorBlindnessInfo: Record<ColorBlindnessType, { title: string; description: string; prevalence: string }> = {
  protanopia: {
    title: 'Protanopia',
    description: 'Ausência de fotorreceptores vermelhos. Dificuldade em distinguir entre vermelho, verde, amarelo e laranja.',
    prevalence: '~1% dos homens',
  },
  deuteranopia: {
    title: 'Deuteranopia',
    description: 'Ausência de fotorreceptores verdes. É o tipo mais comum de daltonismo. Dificuldade com verdes e vermelhos.',
    prevalence: '~1% dos homens',
  },
  tritanopia: {
    title: 'Tritanopia',
    description: 'Ausência de fotorreceptores azuis. Dificuldade em distinguir entre azul e verde, e entre amarelo e violeta.',
    prevalence: '~0.001% das pessoas',
  },
};

export function InfoCard({ type }: InfoCardProps) {
  const info = colorBlindnessInfo[type];

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="pt-4 pb-4 px-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-blue-900">{info.title}</h4>
            <p className="text-sm text-blue-800">{info.description}</p>
            <p className="text-xs text-blue-700">
              <strong>Prevalência:</strong> {info.prevalence}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
