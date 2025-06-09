import type { Category } from "app/models/category.model";

interface CategoryDeleteProps {
  category?: Category;
}

export function CategoryDelete({ category }: CategoryDeleteProps) {
  return (
    <div className="py-4">
      <p className="text-center text-muted-foreground">
        You are about to delete the category:{" "}
        <span className="font-semibold text-foreground">{category?.name}</span>
      </p>
      <p className="text-center text-sm text-muted-foreground mt-2">
        This action cannot be undone.
      </p>
    </div>
  );
}
