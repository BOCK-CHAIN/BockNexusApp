export interface Category {
  id: number;
  name: string;
  image_uri: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesState {
  data: Category[];
  loading: boolean;
  error: string | null;
}




