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
import type { Content } from "app/models/content.model";
import { ContentForm } from "./content.form";
import { ContentDelete } from "./content.delete";

interface ContentDialogProps {
  mode: "add" | "edit" | "delete";
  content?: Content;
  action?: React.ReactNode;
  onConfirm: (contentData?: Content | { file: File | null; courseId: number; type: string }) => void;
}

export function ContentDialog({
  mode,
  content,
  action,
  onConfirm,
}: ContentDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [contentData, setContentData] = useState<
  Content | { file: File | null; courseId: number; type: string }
>(
  content
    ? content
    : { // No incluir 'id' en la creación
        type: "",
        courseId: 0,
        url: "",
        file: null,
      }
  );

  const handleConfirm = () => {
    onConfirm(contentData);
    setIsDialogOpen(false);
  };

  const renderDialogContent = () => {
    switch (mode) {
      case "add":
      case "edit":
        return (
          <ContentForm contentData={contentData} setContentData={setContentData} />
        );
      case "delete":
        return <ContentDelete content={content} />;
      default:
        console.warn(`Unexpected mode: ${mode}`); // Log a warning for unexpected modes
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