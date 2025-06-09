import { useState } from "react";
import type { ReportData } from "app/models/report_data.model";
import reportService from "app/services/report.service";

interface PDFDownloadButtonProps {
  reportData: ReportData;
  filename: string;
}

const PDFDownloadButton = ({
  reportData,
  filename,
}: PDFDownloadButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      // Crear un objeto con los datos que enviaremos al servidor
      const requestData = {
        reportData,
        filename,
      };

      // Simular la generación de PDF (en un entorno real, esto sería una llamada a una API)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        throw new Error("Error al generar el PDF");
      }

      // Para esta demostración, mostraremos un mensaje de éxito
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Hubo un error al generar el PDF. Por favor, inténtalo de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={`px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors duration-200 ${
        isGenerating ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {isGenerating ? "Generando PDF..." : "Descargar Informe PDF"}
    </button>
  );
};

export default PDFDownloadButton;
