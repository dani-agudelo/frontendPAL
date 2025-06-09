import { environment } from "@/environments/environment";
import { Content } from "app/models/content.model";
import axios from "axios";

class ContentService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = `${environment.apiBaseUrl}/content`;
  }

  async getAll(): Promise<Content[]> {
    const response = await axios.get<Content[]>(`${this.baseUrl}/all`);
    return response.data;
  }

  async getOne(id: number): Promise<Content> {
    const response = await axios.get<Content>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  upload(file: File, courseId: number, type: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseId", courseId.toString());
    formData.append("type", type);

    return axios
      .post(`${environment.apiBaseUrl}/content/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response.data);
  }

  async update(id: number, file: File | null, type: string): Promise<Content> {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    formData.append("type", type);

    try {
      const response = await axios.put<Content>(
        `${this.baseUrl}/update/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error updating content:", error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/delete/${id}`);
  }
}

export default new ContentService();

