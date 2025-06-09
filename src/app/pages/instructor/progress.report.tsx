import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "root/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "root/components/ui/card";
import { Progress } from "root/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "root/components/ui/table";
import type { ReportData } from "app/models/report_data.model";
import reportService from "app/services/report.service";
import { toast } from "sonner";
import { Download, FileText, Users, Award } from "lucide-react";
import { PDFReport } from "app/components/report/pdf.report";
import { PDFDownloadLink } from "@react-pdf/renderer";

export default function ProgressReport() {
  const { courseId } = useParams<{ courseId: string }>();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      if (!courseId) return;

      setIsLoading(true);
      try {
        const data = await reportService.reportByCourseId(Number(courseId));
        setReportData(data);
      } catch (error) {
        console.error("Error fetching report data:", error);
        toast.error("Failed to load report data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [courseId]);

  const calculateAverageProgress = () => {
    if (!reportData || !reportData.students.length) return 0;
    const sum = reportData.students.reduce(
      (acc, student) => acc + student.courseProgress,
      0,
    );
    return sum / reportData.students.length;
  };

  const calculateAverageScore = () => {
    if (!reportData || !reportData.students.length) return 0;
    const sum = reportData.students.reduce(
      (acc, student) => acc + student.averageScore,
      0,
    );
    return sum / reportData.students.length;
  };

  const exportCSV = () => {
    if (!reportData) return;

    // Create CSV content
    const headers = [
      "Student Name",
      "Progress",
      "Average Score",
      "Forum Messages",
    ];
    const rows = reportData.students.map((student) => [
      student.username,
      (student.courseProgress * 100).toFixed(0) + "%",
      student.averageScore.toFixed(1),
      student.forumMessages,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${reportData.courseTitle}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="h-8 w-64 bg-muted animate-pulse rounded-md mb-4"></div>
        <div className="h-4 w-full max-w-2xl bg-muted animate-pulse rounded-md mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
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

  if (!reportData) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Report not available</h1>
        <p className="mb-6">
          The report data for this course is not available.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            {reportData.courseTitle} - Reporte de Progreso
          </h1>
          <p className="text-muted-foreground">
            Generated on{" "}
            {new Date(reportData.generatedDate).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={exportCSV}
          >
            <FileText className="h-4 w-4" />
            Export CSV
          </Button>

          {reportData && (
            <PDFDownloadLink
              document={<PDFReport data={reportData} />}
              fileName={`${reportData.courseTitle}_Report.pdf`}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2"
            >
              {({ loading }) =>
                loading ? (
                  "Loading..."
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Export PDF
                  </>
                )
              }
            </PDFDownloadLink>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">
                {reportData.students.length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {(calculateAverageProgress() * 100).toFixed(0)}%
                </span>
              </div>
              <Progress
                value={calculateAverageProgress() * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">
                {calculateAverageScore().toFixed(1)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Progress Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Average Score</TableHead>
                <TableHead>Forum Messages</TableHead>
                <TableHead>Exam Results</TableHead>
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
                      <span>{(student.courseProgress * 100).toFixed(0)}%</span>
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
                        No exams taken
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
  );
}
