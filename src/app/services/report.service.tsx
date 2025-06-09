import { environment } from "@/environments/environment";

import axios from "axios";
import { ReportData } from "app/models/report_data.model";

class ReportService {
  private baseUrl: string;
  constructor() {
    this.baseUrl = `${environment.apiBaseUrl}/reports`;
  }

  async reportByCourseId(courseId: number): Promise<ReportData> {
    const response = await axios.get<ReportData>(
      `${this.baseUrl}/progress/${courseId}`,
    );
    return response.data;
  }
}

export default new ReportService();
