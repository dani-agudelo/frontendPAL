import type React from "react";

import { useState, useEffect } from "react";
import { Label } from "root/components/ui/label";
import { Input } from "root/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "root/components/ui/select";
import type { Course } from "app/models/course.model";
import type { User } from "app/models/user.model";
import type { Category } from "app/models/category.model";
import userService from "app/services/user.service";
import categoryService from "app/services/category.service";

interface CourseFormProps {
  courseData: Course;
  setCourseData: React.Dispatch<React.SetStateAction<Course>>;
}

export function CourseForm({ courseData, setCourseData }: CourseFormProps) {
  const [instructors, setInstructors] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

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
              <SelectItem key={instructor.id} value={String(instructor.id)}>
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
          defaultValue={courseData.difficulty}
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
          defaultValue={courseData.free ? "yes" : "no"}
          onValueChange={(value) =>
            setCourseData({ ...courseData, free: value === "yes" })
          }
        >
          <SelectTrigger className="col-span-3 w-full">
            <SelectValue placeholder="Is Free?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Sí</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
