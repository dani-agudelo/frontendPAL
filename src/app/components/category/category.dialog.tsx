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
import type { Category } from "app/models/category.model";
import { CategoryForm } from "./category.form";
import { CategoryDelete } from "./category.delete";

interface CategoryDialogProps {
  mode: "add" | "edit" | "delete";
  category?: Category;
  action?: React.ReactNode;
  onConfirm: (categoryData?: Category) => void;
}

const defaultCategory: Category = {
  id: 0,
  name: "",
};

export function CategoryDialog({
  mode,
  category,
  action,
  onConfirm,
}: CategoryDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryData, setCategoryData] = useState<Category>(
    category || defaultCategory
  );

  const handleConfirm = () => {
    onConfirm(categoryData);
    setIsDialogOpen(false);
    setCategoryData(category || defaultCategory);
  };

  const renderDialogContent = () => {
    switch (mode) {
      case "add":
      case "edit":
        return (
          <CategoryForm categoryData={categoryData} setCategoryData={setCategoryData} />
        );
      case "delete":
        return <CategoryDelete category={category} />;
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
              ? "Add Category"
              : mode === "edit"
              ? "Edit Category"
              : "Delete Category"}
          </DialogTitle>
          <DialogDescription>
            {mode === "delete"
              ? "Are you sure you want to delete this category?"
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
