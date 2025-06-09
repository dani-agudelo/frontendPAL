import { Button } from "root/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "root/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "root/components/ui/select";

import { Input } from "root/components/ui/input";
import { Label } from "root/components/ui/label";
import { Course } from "app/models/course.model";
import { useEffect, useState } from "react";
import { User } from "app/models/user.model";
import { Category } from "app/models/category.model";
import categoryService from "app/services/category.service";
import userService from "app/services/user.service";

interface CourseManageProps {
  mode: "add" | "edit" | "delete";
  course?: Course;
  action?: any;
  onConfirm: (courseData?: Course) => void;
}

export default function CourseManage({
  mode,
  course,
  action,
  onConfirm,
}: CourseManageProps) {
  const [instructors, setInstructors] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [courseData, setCourseData] = useState<Course>(
    course || {
      id: 0,
      title: "",
      description: "",
      instructorId: 0,
      categoryId: 0,
      price: 0,
      difficulty: "",
      free: false,
      createdAt: "",
    },
  );

  const fetchInstructors = async () => {
    userService.getAll().then((data) => setInstructors(data));
  };

  const fetchCategories = async () => {
    categoryService.getAll().then((data) => setCategories(data));
  };

  useEffect(() => {
    fetchInstructors();
    fetchCategories();
  }, []);

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

        {mode !== "delete" && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={courseData.title}
                onChange={(e) =>
                  setCourseData({ ...courseData, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={courseData.description}
                onChange={(e) =>
                  setCourseData({ ...courseData, description: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                value={courseData.price}
                onChange={(e) =>
                  setCourseData({
                    ...courseData,
                    price: Number(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="instructorId" className="text-right">
                Instructor
              </Label>
              <Select
                defaultValue={String(courseData.instructorId)}
                onValueChange={(value) =>
                  setCourseData({ ...courseData, instructorId: Number(value) })
                }
              >
                <SelectTrigger className="col-span-3 w-full">
                  <SelectValue placeholder="Select Instructor" />
                </SelectTrigger>
                <SelectContent>
                  {instructors.map((instructor) => (
                    <SelectItem
                      key={instructor.id}
                      value={String(instructor.id)}
                    >
                      {instructor.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryId" className="text-right">
                Category
              </Label>
              <Select
                defaultValue={String(courseData.categoryId)}
                onValueChange={(value) =>
                  setCourseData({ ...courseData, categoryId: Number(value) })
                }
              >
                <SelectTrigger className="col-span-3 w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="difficulty" className="text-right">
                Difficulty
              </Label>
              <Select
                defaultValue={courseData.difficulty || ""}
                onValueChange={(value) =>
                  setCourseData({ ...courseData, difficulty: value })
                }
              >
                <SelectTrigger className="col-span-3 w-full">
                  <SelectValue placeholder="Select Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="free" className="text-right">
                Free
              </Label>
              <Select
                defaultValue={String(courseData.free)}
                onValueChange={(value) =>
                  setCourseData({ ...courseData, free: value === "true" })
                }
              >
                <SelectTrigger className="col-span-3 w-full">
                  <SelectValue placeholder="Select Free" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant={mode === "delete" ? "destructive" : "default"}
            onClick={() => {
              onConfirm(courseData);
              setIsDialogOpen(false);
            }}
          >
            {mode === "delete" ? "Delete" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
