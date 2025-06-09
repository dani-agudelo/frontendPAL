import { Routes, Route, Navigate } from "react-router-dom";
import StudentDashboard from "app/pages/student/student.dashboard";
import EnrolledCourses from "app/pages/student/enrolled.courses";
import CourseDetail from "app/pages/student/course.detail";
import TakeExam from "app/pages/student/take.exam";
import ExamResults from "app/pages/student/exam.results";
import Certificates from "app/pages/student/certificates";

const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="courses" element={<EnrolledCourses />} />
      <Route path="courses/:courseId" element={<CourseDetail />} />
      <Route path="exams/take/:examId" element={<TakeExam />} />
      <Route path="exams/results/:examId" element={<ExamResults />} />
      <Route path="certificates/:certificateId" element={<Certificates />} />
      <Route path="*" element={<Navigate to="/student/dashboard" />} />
    </Routes>
  );
};

export default StudentRoutes;
