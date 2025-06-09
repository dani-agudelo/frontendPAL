import { Routes, Route, Navigate } from "react-router-dom";
import InstructorDashboard from "app/pages/instructor/instructor.dashboard";
import InstructorCourses from "app/pages/instructor/instructor.courses";
import InstructorReports from "app/pages/instructor/instructor.reports";
import InstructorStudents from "app/pages/instructor/instructor.students";
import ProgressReport from "app/pages/instructor/progress.report";

const InstructorRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<InstructorDashboard />} />
      <Route path="courses" element={<InstructorCourses />} />
      <Route path="reports" element={<InstructorReports />} />
      <Route path="students" element={<InstructorStudents />} />
      <Route path="reports/course/:courseId" element={<ProgressReport />} />
      <Route path="*" element={<Navigate to="/instructor/dashboard" />} />
    </Routes>
  );
};

export default InstructorRoutes;
