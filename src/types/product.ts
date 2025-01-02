export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string | null;
  initialStock: number;
  latestInputStock: number;
  latestOutputStock: number;
  newestStock: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  pubFormattedCreatedAt: string;
}
