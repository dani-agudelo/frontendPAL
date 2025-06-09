import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "root/components/ui/card";
import { Button } from "root/components/ui/button";
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
import { Progress } from "root/components/ui/progress";
import { FileText, FileIcon as FilePdf } from "lucide-react";
import { useAuth } from "security/context/auth.context";
import courseService from "app/services/course.service";
import reportService from "app/services/report.service";
import type { Course } from "app/models/course.model";
import type { ReportData } from "app/models/report_data.model";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PDFReport } from "app/components/report/pdf.report";
import { Link } from "react-router-dom";

export default function InstructorReports() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

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

        // Seleccionar el primer curso por defecto si hay cursos
        if (instructorCourses.length > 0) {
          setSelectedCourseId(String(instructorCourses[0].id));
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  useEffect(() => {
    // Cargar informe cuando se selecciona un curso
    const fetchReport = async () => {
      if (!selectedCourseId) return;

      setIsLoadingReport(true);
      try {
        const data = await reportService.reportByCourseId(
          Number(selectedCourseId),
        );
        setReportData(data);
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setIsLoadingReport(false);
      }
    };

    fetchReport();
  }, [selectedCourseId]);

  const exportCSV = () => {
    if (!reportData) return;

    // Crear contenido CSV
    const headers = [
      "Estudiante",
      "Progreso",
      "Puntuación Promedio",
      "Mensajes en Foro",
      "Resultados de Exámenes",
    ];
    const rows = reportData.students.map((student) => [
      student.username,
      (student.courseProgress * 100).toFixed(0) + "%",
      student.averageScore.toFixed(1),
      student.forumMessages,
      student.examResults.map((r) => `${r.examTitle}: ${r.score}`).join("; "),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Crear y descargar el archivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${reportData.courseTitle}_Informe.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="h-8 w-64 bg-muted animate-pulse rounded-md mb-4"></div>
        <div className="h-10 w-full max-w-xs bg-muted animate-pulse rounded-md mb-8"></div>
        <div className="h-64 bg-muted animate-pulse rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Informes de Cursos</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="w-full md:w-64">
          <Select
            value={selectedCourseId}
            onValueChange={setSelectedCourseId}
            disabled={courses.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar curso" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={String(course.id)}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {reportData && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={exportCSV}
            >
              <FileText className="h-4 w-4" />
              Exportar CSV
            </Button>

            <PDFDownloadLink
              document={<PDFReport data={reportData} />}
              fileName={`${reportData.courseTitle}_Informe.pdf`}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2"
            >
              {({ loading }) =>
                loading ? (
                  "Cargando..."
                ) : (
                  <>
                    <FilePdf className="h-4 w-4" />
                    Exportar PDF
                  </>
                )
              }
            </PDFDownloadLink>
          </div>
        )}
      </div>

      {isLoadingReport ? (
        <div className="h-64 bg-muted animate-pulse rounded-md"></div>
      ) : reportData ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {reportData.courseTitle} - Informe de Progreso
              </CardTitle>
              <CardDescription>
                Generado el{" "}
                {new Date(reportData.generatedDate).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Total de Estudiantes
                  </h3>
                  <p className="text-2xl font-bold">
                    {reportData.students.length}
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Progreso Promedio
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        {reportData.students.length > 0
                          ? (
                              (reportData.students.reduce(
                                (acc, student) => acc + student.courseProgress,
                                0,
                              ) /
                                reportData.students.length) *
                              100
                            ).toFixed(0)
                          : 0}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        reportData.students.length > 0
                          ? (reportData.students.reduce(
                              (acc, student) => acc + student.courseProgress,
                              0,
                            ) /
                              reportData.students.length) *
                            100
                          : 0
                      }
                      className="h-2"
                    />
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Puntuación Promedio
                  </h3>
                  <p className="text-2xl font-bold">
                    {reportData.students.length > 0
                      ? (
                          reportData.students.reduce(
                            (acc, student) => acc + student.averageScore,
                            0,
                          ) / reportData.students.length
                        ).toFixed(1)
                      : 0}
                  </p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudiante</TableHead>
                    <TableHead>Progreso</TableHead>
                    <TableHead>Puntuación Promedio</TableHead>
                    <TableHead>Mensajes en Foro</TableHead>
                    <TableHead>Resultados de Exámenes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.students.map((student, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {student.username}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={student.courseProgress * 100}
                            className="h-2 w-24"
                          />
                          <span>
                            {(student.courseProgress * 100).toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{student.averageScore.toFixed(1)}</TableCell>
                      <TableCell>{student.forumMessages}</TableCell>
                      <TableCell>
                        {student.examResults.length > 0 ? (
                          <div className="space-y-1">
                            {student.examResults.map((result, resultIndex) => (
                              <div key={resultIndex} className="text-xs">
                                <span className="font-medium">
                                  {result.examTitle}:
                                </span>{" "}
                                <span>{result.score.toFixed(1)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            No ha realizado exámenes
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <h3 className="text-xl font-medium">No hay informes disponibles</h3>
          <p className="text-muted-foreground mt-2">
            {courses.length > 0
              ? "Selecciona un curso para ver su informe"
              : "No tienes cursos creados aún"}
          </p>
          {courses.length === 0 && (
            <Button asChild className="mt-4">
              <Link to="/instructor/courses/create">Crear Curso</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
