// Esta página muestra detalles de una categoría de cursos
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CategoryService from "app/services/category.service";
import { Category } from "app/models/category.model";

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (id) {
      CategoryService.getOne(Number(id)).then(setCategory);
    }
  }, [id]);

  if (!category) return <p>Cargando...</p>;

  return (
    <div>
      <h1>{category.name}</h1>
    </div>
  );
};

export default CategoryPage;
