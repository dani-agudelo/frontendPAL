import { Button } from "root/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "root/components/ui/card";
import { Badge } from "root/components/ui/badge";
import { BookOpen, DollarSign, Award } from "lucide-react";
import type { Course } from "app/models/course.model";
import { Link } from "react-router-dom";

interface CourseCardProps {
  course: Course;
  showEnrollButton?: boolean;
  onEnroll?: (courseId: number) => void;
  isEnrolled?: boolean;
}

export function CourseCard({
  course,
  showEnrollButton = true,
  onEnroll,
  isEnrolled = false,
}: CourseCardProps) {
  const handleEnroll = () => {
    if (onEnroll) {
      onEnroll(course.id);
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{course.title}</CardTitle>
          <Badge variant={course.free ? "secondary" : "default"}>
            {course.free ? "Free" : `$${course.price}`}
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
            <span className="capitalize">{course.difficulty}</span>
          </div>
          {!course.free && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span>${course.price}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4" />
            <span>Certificate</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {showEnrollButton ? (
          isEnrolled ? (
            <Button asChild className="w-full">
              <Link to={`/student/courses/${course.id}`}>
                Continuar Aprendiendo
              </Link>
            </Button>
          ) : (
            <Button onClick={handleEnroll} className="w-full">
              Matricularse
            </Button>
          )
        ) : (
          <Button asChild variant="outline" className="w-full">
            <Link to={`/courses/${course.id}`}>View Details</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
