import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "root/components/ui/card";
import { Input } from "root/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "root/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "root/components/ui/table";
import { Badge } from "root/components/ui/badge";
import { Progress } from "root/components/ui/progress";
import { Search, Mail } from "lucide-react";
import { Button } from "root/components/ui/button";
import { useAuth } from "security/context/auth.context";
import courseService from "app/services/course.service";
import type { Course } from "app/models/course.model";

// Datos simulados de estudiantes
const mockStudents = [
  {
    id: 1,
    name: "Ana García",
    email: "ana.garcia@example.com",
    progress: 0.85,
    lastActive: "2023-05-18T14:30:00",
    status: "active",
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@example.com",
    progress: 0.65,
    lastActive: "2023-05-17T10:15:00",
    status: "active",
  },
  {
    id: 3,
    name: "Laura Martínez",
    email: "laura.martinez@example.com",
    progress: 0.92,
    lastActive: "2023-05-18T09:45:00",
    status: "completed",
  },
  {
    id: 4,
    name: "Miguel Sánchez",
    email: "miguel.sanchez@example.com",
    progress: 0.3,
    lastActive: "2023-05-15T16:20:00",
    status: "inactive",
  },
  {
    id: 5,
    name: "Sofía López",
    email: "sofia.lopez@example.com",
    progress: 0.75,
    lastActive: "2023-05-16T11:10:00",
    status: "active",
  },
];

export default function InstructorStudents() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [students, setStudents] = useState(mockStudents);
  const [filteredStudents, setFilteredStudents] = useState(mockStudents);
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
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  useEffect(() => {
    // Aplicar filtros
    let filtered = students;

    // Filtrar por curso
    if (selectedCourseId !== "all") {
      // En un entorno real, aquí se filtrarían los estudiantes por curso
      // Para esta demo, simplemente simulamos el filtrado
      filtered = filtered.filter(() => Math.random() > 0.3);
    }

    // Filtrar por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter((student) => student.status === statusFilter);
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredStudents(filtered);
  }, [selectedCourseId, statusFilter, searchTerm, students]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completado</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="h-8 w-64 bg-muted animate-pulse rounded-md mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="h-10 bg-muted animate-pulse rounded-md"></div>
          <div className="h-10 bg-muted animate-pulse rounded-md"></div>
          <div className="h-10 bg-muted animate-pulse rounded-md"></div>
        </div>
        <div className="h-64 bg-muted animate-pulse rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Estudiantes</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar estudiantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por curso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los cursos</SelectItem>
            {courses.map((course) => (
              <SelectItem key={course.id} value={String(course.id)}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="completed">Completados</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Estudiantes</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStudents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead>Última Actividad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.name}
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={student.progress * 100}
                          className="h-2 w-24"
                        />
                        <span>{(student.progress * 100).toFixed(0)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(student.lastActive).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Mail className="h-4 w-4" />
                        <span className="sr-only">Enviar mensaje</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No se encontraron estudiantes
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
