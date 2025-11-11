import { useState } from 'react';
import { Button } from './ui/button';
import { Download, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ColorBlindnessCanvas } from './ColorBlindnessCanvas';
import { GridView } from './GridView';

type ColorBlindnessType = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

interface ImagePreviewProps {
  imageUrl: string;
  selectedFilter: ColorBlindnessType;
  onExport: () => void;
  onCanvasReady: (canvas: HTMLCanvasElement | null) => void;
  intensity: number;
  gridView: boolean;
}

export function ImagePreview({ imageUrl, selectedFilter, onExport, onCanvasReady, intensity, gridView }: ImagePreviewProps) {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleZoomReset = () => setZoom(100);
  return (
    <main className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-gray-700">Visualização de Imagem</h2>
          {!gridView && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-600 min-w-[60px] text-center">{zoom}%</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleZoomReset}
              >
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        <Button onClick={onExport} className="gap-2">
          <Download className="w-4 h-4" />
          Exportar
        </Button>
      </header>

      {/* Content Area */}
      <div className="flex-1 p-8 overflow-auto">
        {gridView ? (
          <GridView imageUrl={imageUrl} />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-8 max-w-7xl mx-auto">
              {/* Before */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-900">Original</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">ANTES</span>
                </div>
                <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden aspect-video flex items-center justify-center">
                  <div style={{ transform: `scale(${zoom / 100})`, transition: 'transform 0.2s' }}>
                    <ImageWithFallback 
                      src={imageUrl}
                      alt="Imagem original"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* After */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-900">
                    {selectedFilter === 'none' ? 'Nenhum filtro aplicado' : 
                      selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}
                  </h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">DEPOIS</span>
                </div>
                <div className="bg-white rounded-lg border-2 border-gray-900 overflow-hidden aspect-video flex items-center justify-center">
                  <div style={{ transform: `scale(${zoom / 100})`, transition: 'transform 0.2s' }}>
                    <ColorBlindnessCanvas
                      imageUrl={imageUrl}
                      filter={selectedFilter}
                      className="max-w-full max-h-full object-contain"
                      onCanvasReady={onCanvasReady}
                      intensity={intensity}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            {selectedFilter !== 'none' && (
              <div className="max-w-7xl mx-auto mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Informação:</strong> Esta é uma simulação científica de como pessoas com {selectedFilter} percebem as cores nesta imagem, usando matrizes de transformação de cores {intensity < 100 && `com intensidade de ${intensity}%`}.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
