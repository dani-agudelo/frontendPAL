import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "root/components/ui/card";
import { Button } from "root/components/ui/button";
import type { Certificate } from "app/models/certificate.model";
import { Award, Download, Eye } from "lucide-react";
import { format } from "date-fns";
import certificateService from "app/services/certificate.service";
import { useAuth } from "security/context/auth.context";

interface CertificateCardProps {
  certificate: Certificate;
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const { user } = useAuth();
  const handleDownload = async () => {
    try {
      const blob = await certificateService.downloadCertificate(certificate.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${certificate.courseName.replace(/\s+/g, "_")}_Certificate.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading certificate:", error);
    }
  };

  const handleSendEmail = async () => {
    try {
      const response = await certificateService.sendCertificateByEmail(
        user!.email,
        certificate.id,
      );
      if (response.status === 200) {
        alert("Certificate sent successfully to your email!");
      } else {
        alert("Failed to send certificate. Please try again.");
      }
    } catch (error) {
      console.error("Error sending certificate by email:", error);
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-500" />
          {certificate.courseName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm">
          <span className="font-medium">Issued to: </span>
          {certificate.courseName}
        </div>
        <div className="text-sm">
          <span className="font-medium">Issue Date: </span>
          {format(new Date(certificate.issueDate), "MMMM d, yyyy")}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 flex items-center gap-2"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
        <Button
          variant="default"
          className="flex-1 flex items-center gap-2"
          onClick={handleSendEmail}
        >
          <Eye className="h-4 w-4" />
          Enviar por Email
        </Button>
      </CardFooter>
    </Card>
  );
}
