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
import type { Content } from "app/models/content.model";
import type { Course } from "app/models/course.model";
import courseService from "app/services/course.service";

interface ContentFormProps {
  contentData: Content | { file: File | null; courseId: number; type: string };
  setContentData: React.Dispatch<
    React.SetStateAction<Content | { file: File | null; courseId: number; type: string }>
  >;
}

export function ContentForm({ contentData, setContentData }: ContentFormProps) {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    courseService.getAll().then((data) => setCourses(data));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setContentData({ ...contentData, file: e.target.files[0] });
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="file" className="text-right">
          File
        </Label>
        <Input
          id="file"
          type="file"
          onChange={handleFileChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="type" className="text-right">
          Type
        </Label>
        <Select
          defaultValue={contentData.type}
          onValueChange={(value) => setContentData({ ...contentData, type: value })}
        >
          <SelectTrigger className="col-span-3 w-full">
            <SelectValue placeholder="Select Content Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="courseId" className="text-right">
          Course
        </Label>
        <Select
          defaultValue={String(contentData.courseId)}
          onValueChange={(value) =>
            setContentData({ ...contentData, courseId: Number(value) })
          }
        >
          <SelectTrigger className="col-span-3 w-full">
            <SelectValue placeholder="Select Course" />
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
    </div>
  );
}