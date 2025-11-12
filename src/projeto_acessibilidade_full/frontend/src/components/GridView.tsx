import { ColorBlindnessCanvas } from './ColorBlindnessCanvas';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface GridViewProps {
  imageUrl: string;
}

const filters = [
  { value: 'none' as const, label: 'Original' },
  { value: 'protanopia' as const, label: 'Protanopia' },
  { value: 'deuteranopia' as const, label: 'Deuteranopia' },
  { value: 'tritanopia' as const, label: 'Tritanopia' },
];

export function GridView({ imageUrl }: GridViewProps) {
  return (
    <div className="grid grid-cols-2 gap-6 max-w-7xl mx-auto">
      {filters.map((filter) => (
        <div key={filter.value} className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900">{filter.label}</h3>
            {filter.value === 'none' && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">ORIGINAL</span>
            )}
          </div>
          <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden aspect-video flex items-center justify-center">
            {filter.value === 'none' ? (
              <ImageWithFallback
                src={imageUrl}
                alt={filter.label}
                className="w-full h-full object-contain"
              />
            ) : (
              <ColorBlindnessCanvas
                imageUrl={imageUrl}
                filter={filter.value}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
