import { environment } from "@/environments/environment";

import { User } from "app/models/user.model";
import axios from "axios";

class UserService {
  private baseUrl: string;
  constructor() {
    this.baseUrl = `${environment.apiBaseUrl}/users`;
  }

  async getAll(): Promise<User[]> {
    const response = await axios.get<User[]>(`${this.baseUrl}/all`);
    return response.data;
  }

  async getOne(id: number): Promise<User> {
    const response = await axios.get<User>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(user: User): Promise<User> {
    const response = await axios.post<User>(`${this.baseUrl}/create`, user);
    return response.data;
  }

  async update(id: Number, user: User): Promise<User> {
    const response = await axios.put<User>(
      `${this.baseUrl}/update/${id}`,
      user,
    );
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/delete/${id}`);
  }
}

export default new UserService();
