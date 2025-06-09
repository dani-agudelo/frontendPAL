import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "root/components/ui/dialog";
import { Button } from "root/components/ui/button";
import type { Course } from "app/models/course.model";
import { CourseForm } from "./course.form";
import { CourseDelete } from "./course.delete";

interface CourseDialogProps {
  mode: "add" | "edit" | "delete";
  course?: Course;
  action?: React.ReactNode;
  onConfirm: (courseData?: Course) => void;
}

const defaultCourse: Course = {
  id: 0,
  title: "",
  description: "",
  instructorId: 0,
  categoryId: 0,
  price: 0,
  difficulty: "",
  free: false,
  createdAt: "",
};

export function CourseDialog({
  mode,
  course,
  action,
  onConfirm,
}: CourseDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [courseData, setCourseData] = useState<Course>(course || defaultCourse);

  const handleConfirm = () => {
    onConfirm(courseData);
    setIsDialogOpen(false);
    setCourseData(course || defaultCourse);
  };

  const renderDialogContent = () => {
    switch (mode) {
      case "add":
      case "edit":
        return (
          <CourseForm courseData={courseData} setCourseData={setCourseData} />
        );
      case "delete":
        return <CourseDelete course={course} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{action}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add"
              ? "Add Course"
              : mode === "edit"
                ? "Edit Course"
                : "Delete Course"}
          </DialogTitle>
          <DialogDescription>
            {mode === "delete"
              ? "Are you sure you want to delete this course?"
              : "Fill in the details below."}
          </DialogDescription>
        </DialogHeader>

        {renderDialogContent()}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant={mode === "delete" ? "destructive" : "default"}
            onClick={handleConfirm}
          >
            {mode === "delete" ? "Delete" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
