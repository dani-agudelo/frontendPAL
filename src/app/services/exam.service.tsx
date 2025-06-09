import { environment } from "@/environments/environment"
import type { Exam, ExamResult, ExamSubmission } from "app/models/exam.model"
import axios from "axios"

class ExamService {
  private readonly baseUrl: string

  constructor() {
    this.baseUrl = `${environment.apiBaseUrl}/exams`
  }

  async getExamsByCourse(courseId: number): Promise<Exam[]> {
    const response = await axios.get<Exam[]>(`${this.baseUrl}/course/${courseId}`)
    return response.data
  }

  async getExamById(examId: number): Promise<Exam> {
    const response = await axios.get<Exam>(`${this.baseUrl}/${examId}`)
    return response.data
  }

  async submitExam(examId: number, submission: ExamSubmission): Promise<ExamResult> {
    const response = await axios.post<ExamResult>(`${this.baseUrl}/submit/${examId}`, submission)
    return response.data
  }

  async getExamResults(examId: number): Promise<ExamResult> {
    const response = await axios.get<ExamResult>(`${this.baseUrl}/results/${examId}`)
    return response.data
  }

  async getMyExamResults(courseId: number): Promise<ExamResult[]> {
    const response = await axios.get<ExamResult[]>(`${this.baseUrl}/my-results/${courseId}`)
    return response.data
  }
}

export default new ExamService()
