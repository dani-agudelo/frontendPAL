import { environment } from "@/environments/environment";

import { Course } from "app/models/course.model";
import axios from "axios";

class CourseService {
  private baseUrl: string;
  constructor() {
    this.baseUrl = `${environment.apiBaseUrl}/courses`;
  }

  async getAll(): Promise<Course[]> {
    const response = await axios.get<Course[]>(`${this.baseUrl}/all`);
    return response.data;
  }

  async getOne(id: number): Promise<Course> {
    const response = await axios.get<Course>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async getByInstructorId(instructorId: number): Promise<Course[]> {
    const response = await axios.get<Course[]>(
      `${this.baseUrl}/by-instructor/${instructorId}`,
    );
    return response.data;
  }

  async create(course: Course): Promise<Course> {
    const response = await axios.post<Course>(
      `${this.baseUrl}/create`,
      course,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  }

  async update(id: number, course: Course): Promise<Course> {
    const response = await axios.put<Course>(
      `${this.baseUrl}/update/${id}`,
      course,
    );
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/delete/${id}`);
  }

  async search(params: {
    keyword?: string | null;
    difficulty?: string | null;
    free?: string | null; // "true" o "false"
    sortBy?: string | null; // <--- Agregamos esto
    categoryId?: number | null;
  }): Promise<Course[]> {
    const queryParams = new URLSearchParams();

    if (params.keyword) queryParams.append("keyword", params.keyword);
    if (params.difficulty) queryParams.append("difficulty", params.difficulty);
    if (params.free !== null && params.free !== undefined) {
      queryParams.append("free", String(params.free));
    }
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.categoryId !== null && params.categoryId !== undefined) {
      queryParams.append("categoryId", String(params.categoryId)); // <-- Agrega esto
    }

    const response = await axios.get<Course[]>(
      `${this.baseUrl}/search?${queryParams.toString()}`,
    );
    return response.data;
  }
}

export default new CourseService();
