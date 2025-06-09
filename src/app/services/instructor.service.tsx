import { environment } from "@/environments/environment";
import { InstructorReport } from "app/models/instructor.report.model";

import axios from "axios";

class InstructorReportService {
  private baseUrl: string;
  constructor() {
    this.baseUrl = `${environment.apiBaseUrl}/reports/`;
  }

  async reportByInstructorId(instructorId: number): Promise<InstructorReport> {
    const response = await axios.get<any>(
      `${this.baseUrl}instructor/${instructorId}`,
    );
    return response.data;
  }
}

export default new InstructorReportService();
