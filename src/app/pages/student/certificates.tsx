import { useState, useEffect } from "react";
import { CertificateCard } from "app/components/certificate/certificate.card";
import { Input } from "root/components/ui/input";
import type { Certificate } from "app/models/certificate.model";
import certificateService from "app/services/certificate.service";
import { Search } from "lucide-react";
import { useAuth } from "../../security/context/auth.context";

export default function Certificates() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [filteredCertificates, setFilteredCertificates] = useState<
    Certificate[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      setIsLoading(true);
      try {
        const data = await certificateService.getMyCertificates(user!.id);
        setCertificates(data);
        setFilteredCertificates(data);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  useEffect(() => {
    // Apply search filter
    if (searchTerm) {
      const filtered = certificates.filter((certificate) =>
        certificate.courseName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredCertificates(filtered);
    } else {
      setFilteredCertificates(certificates);
    }
  }, [searchTerm, certificates]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Certificates</h1>

      <div className="mb-8 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 bg-muted animate-pulse rounded-md"
            ></div>
          ))}
        </div>
      ) : filteredCertificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((certificate) => (
            <CertificateCard key={certificate.id} certificate={certificate} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <h3 className="text-xl font-medium">No certificates found</h3>
          <p className="text-muted-foreground mt-2">
            {searchTerm
              ? "Try adjusting your search criteria"
              : "Complete courses to earn certificates"}
          </p>
        </div>
      )}
    </div>
  );
}
