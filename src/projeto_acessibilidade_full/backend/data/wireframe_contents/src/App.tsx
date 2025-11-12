import { useState, useRef } from "react";
import { ImagePreview, ExportFormat } from "./components/ImagePreview";
import { Sidebar } from "./components/Sidebar";
import { ColorChannels } from "./components/ColorChannelManipulation";
import { toast } from "sonner@2.0.3";

type ColorBlindnessType =
  | "none"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia";

const defaultColorChannels: ColorChannels = {
  rgb: { r: 0, g: 0, b: 0 },
  hsv: { h: 0, s: 0, v: 0 },
  lab: { l: 0, a: 0, b: 0 }
};

export default function App() {
  const [selectedFilter, setSelectedFilter] =
    useState<ColorBlindnessType>("none");
  const [imageUrl, setImageUrl] = useState<string>(
    "https://images.unsplash.com/photo-1559153668-469d592824a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMG5hdHVyZSUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjI4MTA3MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  );
  const [canvasRef, setCanvasRef] =
    useState<HTMLCanvasElement | null>(null);
  const [intensity, setIntensity] = useState(100);
  const [gridView, setGridView] = useState(false);
  const [colorChannels, setColorChannels] = useState<ColorChannels>(defaultColorChannels);

  const handleColorChannelsReset = () => {
    setColorChannels(defaultColorChannels);
    toast.success("Canais de cor resetados");
  };

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(
          "Por favor, selecione um arquivo de imagem válido",
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImageUrl(result);
        toast.success("Imagem carregada com sucesso!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = (format: ExportFormat) => {
    if (!canvasRef) {
      toast.error("Aguarde o processamento da imagem");
      return;
    }

    try {
      // Determina o MIME type baseado no formato
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      
      canvasRef.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          const fileName =
            selectedFilter === "none"
              ? `imagem-original.${format}`
              : `imagem-${selectedFilter}.${format}`;

          link.href = url;
          link.download = fileName;
          link.click();

          URL.revokeObjectURL(url);
          toast.success(`Imagem exportada com sucesso em ${format.toUpperCase()}!`);
        }
      }, mimeType, 0.95); // 0.95 é a qualidade para JPEG/JPG
    } catch (error) {
      toast.error("Erro ao exportar imagem");
      console.error("Erro ao exportar:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        onImageUpload={handleImageUpload}
        intensity={intensity}
        onIntensityChange={setIntensity}
        gridView={gridView}
        onGridViewChange={setGridView}
        imageUrl={imageUrl}
        colorChannels={colorChannels}
        onColorChannelsChange={setColorChannels}
        onColorChannelsReset={handleColorChannelsReset}
      />
      <ImagePreview
        imageUrl={imageUrl}
        selectedFilter={selectedFilter}
        onExport={handleExport}
        onCanvasReady={setCanvasRef}
        intensity={intensity}
        gridView={gridView}
        colorChannels={colorChannels}
      />
    </div>
  );
}