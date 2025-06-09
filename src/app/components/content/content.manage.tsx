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
import { Content } from "app/models/content.model";
import { useEffect, useState } from "react";
import { Course } from "app/models/course.model";
import courseService from "app/services/course.service";

interface ContentManageProps {
  mode: "add" | "edit" | "delete";
  content?: Content;
  action?: any;
  onConfirm: (contentData?: Content | { file: File | null; courseId: number; type: string }) => void;
}

export default function ContentManage({
  mode,
  content,
  action,
  onConfirm,
}: ContentManageProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [contentData, setContentData] = useState<Content | { file: File | null; courseId: number; type: string }>(
    content || {
      id: 0,
      file: null,
      courseId: 0,
      type: "",
      url: "",
    }
  );

  useEffect(() => {
    courseService.getAll().then((data) => setCourses(data));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setContentData({ ...contentData, file: e.target.files[0] });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{action}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add"
              ? "Upload Content"
              : mode === "edit"
              ? "Edit Content"
              : "Delete Content"}
          </DialogTitle>
          <DialogDescription>
            {mode === "delete"
              ? "Are you sure you want to delete this content?"
              : "Fill in the details below."}
          </DialogDescription>
        </DialogHeader>

        {mode !== "delete" && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                File
              </Label>
              <Input id="file" type="file" onChange={handleFileChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                defaultValue={contentData.type || ""}
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
                defaultValue={String(contentData.courseId) || ""}
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
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant={mode === "delete" ? "destructive" : "default"}
            onClick={() => {
              onConfirm(contentData);
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