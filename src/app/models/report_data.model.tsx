import { StudentReport } from "./student.report.model";

export interface ReportData {
  courseTitle: string;
  generatedDate: string;
  students: StudentReport[];
}
