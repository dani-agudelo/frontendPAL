import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "root/components/ui/button";
import { Input } from "root/components/ui/input";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "root/components/ui/card";
import { Badge } from "root/components/ui/badge";
import { BookOpen, Users, Search, Plus } from "lucide-react";
import { useAuth } from "security/context/auth.context";
import courseService from "app/services/course.service";
import type { Course } from "app/models/course.model";

export default function InstructorCourses() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("keyword") || "",
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const coursesData = await courseService.getAll();
        // Filtrar cursos por instructorId
        const instructorCourses = coursesData.filter(
          (course) => course.instructorId === user?.id,
        );
        setCourses(instructorCourses);
        setFilteredCourses(instructorCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  useEffect(() => {
    // Aplicar filtro de búsqueda
    if (searchTerm) {
      const filtered = courses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  }, [searchTerm, courses]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-64 bg-muted animate-pulse rounded-md"></div>
          <div className="h-10 w-40 bg-muted animate-pulse rounded-md"></div>
        </div>
        <div className="h-12 w-full bg-muted animate-pulse rounded-md mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 bg-muted animate-pulse rounded-md"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mis Cursos</h1>
        <Button asChild>
          <Link
            to="/instructor/courses/create"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Crear Curso
          </Link>
        </Button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar cursos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden transition-all hover:shadow-lg"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  <Badge variant={course.free ? "secondary" : "default"}>
                    {course.free ? "Gratis" : `$${course.price}`}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${getDifficultyColor(course.difficulty)}`}
                    >
                      {course.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>25 estudiantes</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link to={`/instructor/courses/${course.id}`}>
                    Ver Detalles
                  </Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link to={`/instructor/courses/${course.id}/edit`}>
                    Editar
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <h3 className="text-xl font-medium">No se encontraron cursos</h3>
          <p className="text-muted-foreground mt-2">
            {searchTerm
              ? "Intenta ajustar tu búsqueda"
              : "Aún no has creado ningún curso"}
          </p>
          {!searchTerm && (
            <Button asChild className="mt-4">
              <Link to="/instructor/courses/create">Crear tu primer curso</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
