import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "root/components/ui/card";
import { Button } from "root/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Users, Award, Clock } from "lucide-react";
import { useAuth } from "security/context/auth.context";
import courseService from "app/services/course.service";
import instructorService from "app/services/instructor.service";
import type { Course } from "app/models/course.model";
import { InstructorReport } from "../../models/instructor.report.model";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<InstructorReport>({
    totalCourses: 0,
    totalStudents: 0,
    completionRate: 0,
    averageScore: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Obtener cursos del instructor
        await courseService.getByInstructorId(user!.id).then(setCourses);
        await instructorService.reportByInstructorId(user!.id).then(setStats);
      } catch (error) {
        console.error("Error fetching instructor data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-muted animate-pulse rounded-md"
            ></div>
          ))}
        </div>
        <div className="h-64 bg-muted animate-pulse rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard de Instructor</h1>
        <Button asChild>
          <Link to="/instructor/courses/create">Crear Nuevo Curso</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Cursos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{stats.totalCourses}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Estudiantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{stats.totalStudents}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tasa de Finalización
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">
                {Math.round(stats.completionRate * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Puntuación Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">
                {stats.averageScore}/100
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cursos Recientes</CardTitle>
            <CardDescription>
              Tus cursos más recientes y su estado actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            {courses.length > 0 ? (
              <div className="space-y-4">
                {courses.slice(0, 5).map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div>
                      <h3 className="font-medium">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {course.difficulty} •{" "}
                        {course.free ? "Gratis" : `$${course.price}`}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/instructor/reports/course/${course.id}`}>
                        Ver
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No tienes cursos creados aún
                </p>
                <Button asChild className="mt-4">
                  <Link to="/instructor/courses">Crear Curso</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas actividades en tus cursos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Actividades simuladas */}
              <div className="flex items-start gap-4 border-b pb-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Nuevo estudiante inscrito</p>
                  <p className="text-sm text-muted-foreground">
                    Un nuevo estudiante se ha inscrito en tu curso "Introducción
                    a React"
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Hace 2 horas
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 border-b pb-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Award className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Certificado emitido</p>
                  <p className="text-sm text-muted-foreground">
                    Un estudiante ha completado el curso "JavaScript Avanzado"
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Hace 1 día
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Contenido actualizado</p>
                  <p className="text-sm text-muted-foreground">
                    Has actualizado el contenido del curso "Desarrollo Web"
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Hace 3 días
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
