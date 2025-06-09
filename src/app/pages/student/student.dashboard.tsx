import { useState, useEffect } from "react";
import { EnrolledCourseCard } from "app/components/enrollment/enrolled.course.card";
import { Button } from "root/components/ui/button";
import type { EnrolledCourse } from "app/models/enrollment.model";
import enrollmentService from "app/services/enrollment.service";
import { Link } from "react-router-dom";
import { Search, BookOpen, Award } from "lucide-react";
import type { Certificate } from "app/models/certificate.model";
import certificateService from "app/services/certificate.service";
import { useAuth } from "../../security/context/auth.context";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [coursesData, certificatesData] = await Promise.all([
          enrollmentService.getMyEnrolledCourses(user!.id),
          certificateService.getMyCertificates(user!.id),
        ]);

        setEnrolledCourses(coursesData);
        setCertificates(certificatesData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get in-progress courses
  const inProgressCourses = enrolledCourses.filter(
    (course) => course.status === "en_progreso",
  );

  // Get recently enrolled courses (last 3)
  const recentCourses = [...enrolledCourses]
    .sort(
      (a, b) =>
        new Date(b.enrollmentDate).getTime() -
        new Date(a.enrollmentDate).getTime(),
    )
    .slice(0, 3);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard de Estudiante</h1>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link to="/courses/search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Find Courses
            </Link>
          </Button>
          <Button asChild>
            <Link to="/student/courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Mis Cursos
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 bg-muted animate-pulse rounded-md"
            ></div>
          ))}
        </div>
      ) : (
        <>
          {inProgressCourses.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">
                Continuar Aprendiendo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressCourses.slice(0, 3).map((course) => (
                  <EnrolledCourseCard key={course.id} course={course} />
                ))}
              </div>
            </section>
          )}

          <section className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Recent Enrollments</h2>
              <Button asChild variant="link">
                <Link to="/student/courses">View All</Link>
              </Button>
            </div>

            {recentCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentCourses.map((course) => (
                  <EnrolledCourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted rounded-lg">
                <h3 className="text-xl font-medium">No enrolled courses yet</h3>
                <p className="text-muted-foreground mt-2">
                  Start your learning journey today
                </p>
                <Button asChild className="mt-4">
                  <Link to="/courses/search">Browse Courses</Link>
                </Button>
              </div>
            )}
          </section>

          {certificates.length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Your Certificates</h2>
                <Button asChild variant="link">
                  <Link to="/student/certificates">View All</Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.slice(0, 3).map((certificate) => (
                  <div
                    key={certificate.id}
                    className="bg-card border rounded-lg p-4 flex items-center gap-4"
                  >
                    <Award className="h-10 w-10 text-yellow-500" />
                    <div>
                      <h3 className="font-medium">{certificate.courseName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Issued on{" "}
                        {new Date(certificate.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
