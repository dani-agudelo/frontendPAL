import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Pencil, Trash } from "lucide-react";
import { Button } from "root/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "root/components/ui/table";
import { ContentDialog } from "app/components/content/content.dialog";
import type { Content } from "app/models/content.model";
import contentService from "app/services/content.service";

const ContentList = () => {
  const [contents, setContents] = useState<Content[]>([]);

  useEffect(() => {
    contentService.getAll().then((data) => setContents(data));
  }, []);

  const uploadContent = (
    contentData?:
      | Content
      | { file: File | null; courseId: number; type: string },
  ) => {
    if (!contentData || "id" in contentData) {
      console.error("Invalid contentData:", contentData);
      toast.error("Invalid content data for upload");
      return;
    }

    if (!contentData.file) {
      console.error("File is missing:", contentData);
      toast.error("File is required to upload content");
      return;
    }

    contentService
      .upload(contentData.file, contentData.courseId, contentData.type)
      .then((data) => {
        setContents([...contents, data]);
        toast.success("Content uploaded successfully");
      })
      .catch(() => {
        toast.error("Failed to upload content");
      });
  };

  const updateContent = (data: Content | undefined) => {
    if (!data) {
      toast.error("Invalid content data");
      return;
    }

    contentService
      .update(data.id, null, data.type)
      .then((updatedContent) => {
        setContents(
          contents.map((content) =>
            content.id === updatedContent.id ? updatedContent : content,
          ),
        );
        toast.success("Content updated successfully");
      })
      .catch(() => {
        toast.error("Failed to update content");
      });
  };

  const deleteContent = (data: Content | undefined) => {
    if (!data) {
      toast.error("Invalid content data");
      return;
    }

    contentService
      .delete(data.id)
      .then(() => {
        setContents(contents.filter((content) => content.id !== data.id));
        toast.success("Content deleted successfully");
      })
      .catch(() => {
        toast.error("Failed to delete content");
      });
  };

  const renderContentDialog = (mode: "edit" | "delete", content: Content) => {
    const isEdit = mode === "edit";
    return (
      <ContentDialog
        mode={mode}
        content={content}
        onConfirm={(contentData) => {
          if ("id" in (contentData || {})) {
            isEdit
              ? updateContent(contentData as Content)
              : deleteContent(contentData as Content);
          }
        }}
        action={
          <Button
            variant="outline"
            size="icon"
            className={isEdit ? "text-blue-500" : "text-red-500"}
          >
            {isEdit ? <Pencil /> : <Trash />}
          </Button>
        }
      />
    );
  };

  return (
    <div className="w-full px-20 py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-center">Content List</h1>
        <ContentDialog
          mode="add"
          onConfirm={uploadContent}
          action={
            <button className="text-white bg-sky-500 hover:bg-sky-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none ">
              Upload Content
            </button>
          }
        />
      </div>
      <Table className="text-base">
        <TableHeader className="bg-transparent h-12">
          <TableRow className="font-bold bg-sky-300 rounded-t-lg border-b-2">
            <TableHead className="rounded-tl-lg">Id</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Course ID</TableHead>
            <TableHead>URL</TableHead>
            <TableHead className="rounded-tr-lg">Options</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="bg-white border-b-2 max-h-[400px] overflow-y-auto">
          {contents.map((content) => (
            <TableRow key={content.id}>
              <TableCell>{content.id}</TableCell>
              <TableCell>{content.type}</TableCell>
              <TableCell>{content.courseId}</TableCell>
              <TableCell>
                <a
                  href={`http://localhost:8080/files/${content.url.split("/").pop()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content.url.split("/").pop()}
                </a>
              </TableCell>
              <TableCell className="flex gap-2 w-1">
                {renderContentDialog("edit", content)}
                {renderContentDialog("delete", content)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContentList;

