import { useRef } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { InfoCard } from './InfoCard';
import { ColorAnalysis } from './ColorAnalysis';
import { ColorChannelManipulation, ColorChannels } from './ColorChannelManipulation';
import { ColorVariationAnalysis } from './ColorVariationAnalysis';
import { Upload, Grid3x3, Columns2 } from 'lucide-react';
import logo from 'figma:asset/2d81f24f78c80f47c448fcc253be80ee011ba603.png';

type ColorBlindnessType = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

interface SidebarProps {
  selectedFilter: ColorBlindnessType;
  onFilterChange: (filter: ColorBlindnessType) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  intensity: number;
  onIntensityChange: (value: number) => void;
  gridView: boolean;
  onGridViewChange: (value: boolean) => void;
  imageUrl: string;
  colorChannels: ColorChannels;
  onColorChannelsChange: (channels: ColorChannels) => void;
  onColorChannelsReset: () => void;
}

export function Sidebar({ 
  selectedFilter, 
  onFilterChange, 
  onImageUpload,
  intensity,
  onIntensityChange,
  gridView,
  onGridViewChange,
  imageUrl,
  colorChannels,
  onColorChannelsChange,
  onColorChannelsReset
}: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filters: { value: ColorBlindnessType; label: string }[] = [
    { value: 'protanopia', label: 'Protanopia' },
    { value: 'deuteranopia', label: 'Deuteranopia' },
    { value: 'tritanopia', label: 'Tritanopia' },
  ];

  return (
    <aside className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
      <div className="mb-8">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="w-32 h-auto" />
        </div>
        <h1 className="text-gray-900 mb-1 text-center">Acessibilidade de Imagens</h1>
        <p className="text-gray-500 text-sm text-center">Ferramenta de simulação</p>
      </div>

      <div className="space-y-6">
        {/* Upload de Imagem */}
        <div>
          <Label className="text-gray-700 mb-3 block">Carregar Imagem</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4" />
            Escolher Imagem
          </Button>
        </div>

        {/* Modo de Visualização */}
        <div className="pt-4 border-t border-gray-200">
          <Label className="text-gray-700 mb-3 block">Modo de Visualização</Label>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Columns2 className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">
                {gridView ? 'Grade Completa' : 'Antes/Depois'}
              </span>
            </div>
            <Switch
              checked={gridView}
              onCheckedChange={onGridViewChange}
            />
          </div>
        </div>

        {/* Manipulação de Canais de Cor */}
        {!gridView && (
          <div className="pt-4 border-t border-gray-200">
            <ColorChannelManipulation 
              channels={colorChannels}
              onChannelsChange={onColorChannelsChange}
              onReset={onColorChannelsReset}
            />
          </div>
        )}

        {/* Simulação de Daltonismo */}
        {!gridView && (
          <div className="pt-4 border-t border-gray-200">
            <Label className="text-gray-700 mb-3 block">Simulação de Daltonismo</Label>
            <div className="space-y-2">
              {filters.map((filter) => (
                <Button
                  key={filter.value}
                  variant={selectedFilter === filter.value ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => onFilterChange(filter.value)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 mt-2"
              onClick={() => onFilterChange('none')}
            >
              Limpar Filtro
            </Button>

            {/* Intensidade do Filtro */}
            {selectedFilter !== 'none' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-gray-700">Intensidade</Label>
                  <span className="text-sm text-gray-500">{intensity}%</span>
                </div>
                <Slider
                  value={[intensity]}
                  onValueChange={(values) => onIntensityChange(values[0])}
                  min={0}
                  max={100}
                  step={10}
                  className="w-full"
                />
              </div>
            )}
          </div>
        )}

        {/* Análise de Cores */}
        <div className="pt-4 border-t border-gray-200">
          <ColorAnalysis imageUrl={imageUrl} />
        </div>

        {/* Análise de Variação de Cores */}
        {!gridView && (
          <div className="pt-4 border-t border-gray-200">
            <ColorVariationAnalysis 
              imageUrl={imageUrl}
              colorChannels={colorChannels}
            />
          </div>
        )}

        {/* Informações Educativas */}
        {selectedFilter !== 'none' && !gridView && (
          <div className="pt-4 border-t border-gray-200">
            <Label className="text-gray-700 mb-3 block">Sobre este tipo</Label>
            <InfoCard type={selectedFilter as 'protanopia' | 'deuteranopia' | 'tritanopia'} />
          </div>
        )}
      </div>
    </aside>
  );
}
