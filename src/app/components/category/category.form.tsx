import type React from "react";
import { Label } from "root/components/ui/label";
import { Input } from "root/components/ui/input";
import type { Category } from "app/models/category.model";

interface CategoryFormProps {
  categoryData: Category;
  setCategoryData: React.Dispatch<React.SetStateAction<Category>>;
}

export function CategoryForm({ categoryData, setCategoryData }: CategoryFormProps) {
  return (
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
  );
}
