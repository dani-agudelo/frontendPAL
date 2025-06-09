export interface Question {
  id: number
  text: string
  options: string[]
  correctOptionIndex: number
}

export interface Exam {
  id: number
  title: string
  description: string
  courseId: number
  questions: Question[]
  timeLimit: number // in minutes
  passingScore: number // percentage
}

export interface ExamSubmission {
  examId: number
  answers: number[] // indices of selected options
}

export interface ExamResult {
  id: number
  examId: number
  studentId: number
  score: number
  passingScore: number
  submissionDate: string
  correctAnswers: number
  totalQuestions: number
  feedback: string
  passed: boolean
  answers: number[]
}
