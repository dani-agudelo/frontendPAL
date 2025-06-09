import type { Course } from "app/models/course.model";

interface CourseDeleteProps {
  course?: Course;
}

export function CourseDelete({ course }: CourseDeleteProps) {
  return (
    <div className="py-4">
      <p className="text-center text-muted-foreground">
        You are about to delete the course:{" "}
        <span className="font-semibold text-foreground">{course?.title}</span>
      </p>
      <p className="text-center text-sm text-muted-foreground mt-2">
        This action cannot be undone.
      </p>
    </div>
  );
}
