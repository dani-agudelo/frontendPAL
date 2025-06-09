import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "root/components/ui/card";
import { Button } from "root/components/ui/button";
import { Badge } from "root/components/ui/badge";
import { Progress } from "root/components/ui/progress";
import type { EnrolledCourse } from "app/models/enrollment.model";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { BookOpen, Award, Clock } from "lucide-react";

interface EnrolledCourseCardProps {
  course: EnrolledCourse;
}

export function EnrolledCourseCard({ course }: EnrolledCourseCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in_progress":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completado":
        return "Completed";
      case "en_progreso":
        return "In Progress";
      default:
        return "Not Started";
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{course.title}</CardTitle>
          <Badge className={`${getStatusColor(course.status)} text-white`}>
            {getStatusText(course.status)}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span>Progress</span>
          <span>{Math.round(course.progress * 100)}%</span>
        </div>
        <Progress value={course.progress * 100} className="h-2" />

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{course.categoryName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4" />
            <span>{course.instructorName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>
              Enrolled{" "}
              {formatDistanceToNow(new Date(course.enrollmentDate), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {course.status !== "completado" && (
          <Button asChild className="flex-1">
            <Link to={`/student/courses/${course.id}`}>Continuar Curso</Link>
          </Button>
        )}
        {course.status === "completado" && (
          <Button asChild variant="outline" className="flex-1">
            <Link to={`/student/certificates/${course.id}`}>
              Ver Certificado
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
