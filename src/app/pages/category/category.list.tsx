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
import { CategoryDialog } from "app/components/category/category.dialog";
import type { Category } from "app/models/category.model";
import categoryService from "app/services/category.service";

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoryService.getAll().then((data) => setCategories(data));
  }, []);

  const createCategory = (categoryData: Category | undefined) => {
    categoryService
      .create(categoryData as Category)
      .then((data) => {
        setCategories([...categories, data]);
        toast.success("Category created successfully");
      })
      .catch(() => {
        toast.error("Failed to create category");
      });
  };

  const updateCategory = (data: Category | undefined) => {
    categoryService
      .update(data?.id as number, data as Category)
      .then((updatedCategory) => {
        setCategories(
          categories.map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category,
          ),
        );
        toast.success("Category updated successfully");
      })
      .catch(() => {
        toast.error("Failed to update category");
      });
  };

  const deleteCategory = (data: Category | undefined) => {
    categoryService
      .delete(data?.id as number)
      .then(() => {
        setCategories(categories.filter((category) => category.id !== data?.id));
        toast.success("Category deleted successfully");
      })
      .catch(() => {
        toast.error("Failed to delete category");
      });
  };

  return (
    <div className="w-full px-20 py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-center">Category List</h1>
        <CategoryDialog
          mode="add"
          onConfirm={createCategory}
          action={
            <button className="text-white bg-sky-500 hover:bg-sky-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none">
              Add Category
            </button>
          }
        />
      </div>
      <Table className="text-base">
        <TableHeader className="bg-transparent h-12">
          <TableRow className="font-bold bg-sky-300 rounded-t-lg border-b-2">
            <TableHead className="rounded-tl-lg">Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="rounded-tr-lg">Options</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="bg-white border-b-2 max-h-1 overflow-scroll">
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell className="max-w-[150px] truncate">{category.name}</TableCell>
              <TableCell className="flex gap-2 w-1">
                <CategoryDialog
                  mode="edit"
                  category={category}
                  onConfirm={updateCategory}
                  action={
                    <Button variant="outline" size="icon" className="text-blue-500">
                      <Pencil />
                    </Button>
                  }
                />
                <CategoryDialog
                  mode="delete"
                  category={category}
                  onConfirm={deleteCategory}
                  action={
                    <Button variant="outline" size="icon" className="text-red-500">
                      <Trash />
                    </Button>
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryList;
