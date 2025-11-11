import { useState, useRef } from "react";
import { ImagePreview } from "./components/ImagePreview";
import { Sidebar } from "./components/Sidebar";
import { toast } from "sonner@2.0.3";

type ColorBlindnessType =
  | "none"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia";

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

  const handleExport = () => {
    if (!canvasRef) {
      toast.error("Aguarde o processamento da imagem");
      return;
    }

    try {
      canvasRef.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          const fileName =
            selectedFilter === "none"
              ? "imagem-original.png"
              : `imagem-${selectedFilter}.png`;

          link.href = url;
          link.download = fileName;
          link.click();

          URL.revokeObjectURL(url);
          toast.success("Imagem exportada com sucesso!");
        }
      }, "image/png");
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
      />
      <ImagePreview
        imageUrl={imageUrl}
        selectedFilter={selectedFilter}
        onExport={handleExport}
        onCanvasReady={setCanvasRef}
        intensity={intensity}
        gridView={gridView}
      />
    </div>
  );
}