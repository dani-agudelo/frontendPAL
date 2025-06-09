export interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  enrollmentDate: string;
  status: "completado" | "en_progreso" | "no_iniciado";
  progress: number;
}

export interface EnrolledCourse {
  id: number;
  title: string;
  description: string;
  enrollmentDate: string;
  status: "completado" | "en_progreso" | "no_iniciado";
  progress: number;
  instructorName: string;
  categoryName: string;
}
