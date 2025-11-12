import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';

export interface ColorChannels {
  rgb: { r: number; g: number; b: number };
  hsv: { h: number; s: number; v: number };
  lab: { l: number; a: number; b: number };
}

interface ColorChannelManipulationProps {
  channels: ColorChannels;
  onChannelsChange: (channels: ColorChannels) => void;
  onReset: () => void;
}

export function ColorChannelManipulation({ channels, onChannelsChange, onReset }: ColorChannelManipulationProps) {
  const handleRGBChange = (channel: 'r' | 'g' | 'b', value: number) => {
    onChannelsChange({
      ...channels,
      rgb: { ...channels.rgb, [channel]: value }
    });
  };

  const handleHSVChange = (channel: 'h' | 's' | 'v', value: number) => {
    onChannelsChange({
      ...channels,
      hsv: { ...channels.hsv, [channel]: value }
    });
  };

  const handleLABChange = (channel: 'l' | 'a' | 'b', value: number) => {
    onChannelsChange({
      ...channels,
      lab: { ...channels.lab, [channel]: value }
    });
  };

  const hasChanges = 
    channels.rgb.r !== 0 || channels.rgb.g !== 0 || channels.rgb.b !== 0 ||
    channels.hsv.h !== 0 || channels.hsv.s !== 0 || channels.hsv.v !== 0 ||
    channels.lab.l !== 0 || channels.lab.a !== 0 || channels.lab.b !== 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Label className="text-gray-700">Manipulação de Canais de Cor</Label>
        {hasChanges && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset}
            className="text-xs h-auto py-1"
          >
            Resetar
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="rgb" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rgb">RGB</TabsTrigger>
          <TabsTrigger value="hsv">HSV</TabsTrigger>
          <TabsTrigger value="lab">LAB</TabsTrigger>
        </TabsList>

        <TabsContent value="rgb" className="space-y-4 mt-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm text-red-600">Red</Label>
              <span className="text-xs text-gray-500">{channels.rgb.r > 0 ? '+' : ''}{channels.rgb.r}</span>
            </div>
            <Slider
              value={[channels.rgb.r]}
              onValueChange={(values) => handleRGBChange('r', values[0])}
              min={-100}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm text-green-600">Green</Label>
              <span className="text-xs text-gray-500">{channels.rgb.g > 0 ? '+' : ''}{channels.rgb.g}</span>
            </div>
            <Slider
              value={[channels.rgb.g]}
              onValueChange={(values) => handleRGBChange('g', values[0])}
              min={-100}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm text-blue-600">Blue</Label>
              <span className="text-xs text-gray-500">{channels.rgb.b > 0 ? '+' : ''}{channels.rgb.b}</span>
            </div>
            <Slider
              value={[channels.rgb.b]}
              onValueChange={(values) => handleRGBChange('b', values[0])}
              min={-100}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        </TabsContent>

        <TabsContent value="hsv" className="space-y-4 mt-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm">Hue (Matiz)</Label>
              <span className="text-xs text-gray-500">{channels.hsv.h > 0 ? '+' : ''}{channels.hsv.h}°</span>
            </div>
            <Slider
              value={[channels.hsv.h]}
              onValueChange={(values) => handleHSVChange('h', values[0])}
              min={-180}
              max={180}
              step={10}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm">Saturation (Saturação)</Label>
              <span className="text-xs text-gray-500">{channels.hsv.s > 0 ? '+' : ''}{channels.hsv.s}%</span>
            </div>
            <Slider
              value={[channels.hsv.s]}
              onValueChange={(values) => handleHSVChange('s', values[0])}
              min={-100}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm">Value (Brilho)</Label>
              <span className="text-xs text-gray-500">{channels.hsv.v > 0 ? '+' : ''}{channels.hsv.v}%</span>
            </div>
            <Slider
              value={[channels.hsv.v]}
              onValueChange={(values) => handleHSVChange('v', values[0])}
              min={-100}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        </TabsContent>

        <TabsContent value="lab" className="space-y-4 mt-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm">Lightness (Luminosidade)</Label>
              <span className="text-xs text-gray-500">{channels.lab.l > 0 ? '+' : ''}{channels.lab.l}</span>
            </div>
            <Slider
              value={[channels.lab.l]}
              onValueChange={(values) => handleLABChange('l', values[0])}
              min={-100}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm">A (Verde-Vermelho)</Label>
              <span className="text-xs text-gray-500">{channels.lab.a > 0 ? '+' : ''}{channels.lab.a}</span>
            </div>
            <Slider
              value={[channels.lab.a]}
              onValueChange={(values) => handleLABChange('a', values[0])}
              min={-128}
              max={128}
              step={5}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm">B (Azul-Amarelo)</Label>
              <span className="text-xs text-gray-500">{channels.lab.b > 0 ? '+' : ''}{channels.lab.b}</span>
            </div>
            <Slider
              value={[channels.lab.b]}
              onValueChange={(values) => handleLABChange('b', values[0])}
              min={-128}
              max={128}
              step={5}
              className="w-full"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
