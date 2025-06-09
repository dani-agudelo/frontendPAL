import { environment } from "@/environments/environment";

import { Category } from "app/models/category.model";
import axios from "axios";

class CategoryService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${environment.apiBaseUrl}/categories`;
  }

  async getAll(): Promise<Category[]> {
    const response = await axios.get<Category[]>(`${this.baseUrl}/all`);
    return response.data;
  }

  async getOne(id: number): Promise<Category> {
    const response = await axios.get<Category>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(category: Category): Promise<Category> {
    const response = await axios.post<Category>(
      `${this.baseUrl}/create`,
      category,
    );
    return response.data;
  }

  async update(id: number, category: Category): Promise<Category> {
    const response = await axios.put<Category>(
      `${this.baseUrl}/update/${id}`,
      category,
    );
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/delete/${id}`);
  }
}

export default new CategoryService();
