import { ExamResult } from "./exam_result.model";

export interface StudentReport {
  username: string;
  email: string;
  courseProgress: number;
  averageScore: number;
  forumMessages: number;
  examResults: ExamResult[];
}
