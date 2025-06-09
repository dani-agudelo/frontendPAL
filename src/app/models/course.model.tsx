export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  difficulty: string;
  free: boolean;
  instructorId: number;
  categoryId: number;
  createdAt: string;
}

