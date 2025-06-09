import { environment } from "@/environments/environment";
import type { Certificate } from "app/models/certificate.model";
import axios from "axios";

class CertificateService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = `${environment.apiBaseUrl}/certificates`;
  }

  async generateCertificate(courseId: number): Promise<Certificate> {
    const response = await axios.post<Certificate>(
      `${this.baseUrl}/generate/${courseId}`,
    );
    return response.data;
  }

  async getMyCertificates(studentId: number): Promise<Certificate[]> {
    const response = await axios.get<Certificate[]>(
      `${this.baseUrl}/my-certificates/${studentId}`,
    );
    return response.data;
  }

  async downloadCertificate(certificateId: number): Promise<Blob> {
    const response = await axios.get(
      `${this.baseUrl}/download/${certificateId}`,
      {
        responseType: "blob",
      },
    );
    return response.data;
  }

  async sendCertificateByEmail(
    email: string,
    certificateId: number,
  ): Promise<{ status: number; message: string }> {
    const response = await axios.post<{
      status: number;
      message: string;
    }>(`${this.baseUrl}/send-email/${certificateId}?email=${email}`);
    return response.data;
  }

  async checkEligibility(
    courseId: number,
  ): Promise<{ eligible: boolean; reason?: string }> {
    const response = await axios.get<{ eligible: boolean; reason?: string }>(
      `${this.baseUrl}/check-eligibility/${courseId}`,
    );
    return response.data;
  }
}

export default new CertificateService();
