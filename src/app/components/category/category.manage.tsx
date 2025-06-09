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
import { Input } from "root/components/ui/input";
import { Label } from "root/components/ui/label";
import { Category } from "app/models/category.model";
import { useState } from "react";
import { CategoryDelete } from "./category.delete";

interface CategoryManageProps {
  mode: "add" | "edit" | "delete";
  category?: Category;
  action?: any;
  onConfirm: (categoryData?: Category) => void;
}

export default function CategoryManage({
  mode,
  category,
  action,
  onConfirm,
}: CategoryManageProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryData, setCategoryData] = useState<Category>(
    category || { id: 0, name: "" }
  );

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

        {mode !== "delete" && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={categoryData.name}
                onChange={(e) =>
                  setCategoryData({ ...categoryData, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
        )}

        {mode === "delete" && <CategoryDelete category={category} />}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant={mode === "delete" ? "destructive" : "default"}
            onClick={() => onConfirm(categoryData)}
          >
            {mode === "delete" ? "Delete" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
