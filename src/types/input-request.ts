import { Product } from './product';
import { User } from './user';

export interface InputRequest {
  id: number;
  name: string | null;
  email: string | null;
  note: string | null;
  outPurposes: string | null;
  requesterId: number;
  status: StatusRequest;
  type: TypeRequest;
  reason: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  requester: User;
  stockRequestItems: StockRequestItem[];
  pubFormattedCreatedAt: string;
  approverId: number;
  approver: User;
  rejecterId: number;
  rejecter: User;
}

export type StatusRequest = 'PENDING' | 'APPROVED' | 'REJECTED';
export type TypeRequest = 'INPUT' | 'OUTPUT';

export interface StockRequestItem {
  id: number;
  stockRequestId: number;
  productId: number;
  product?: Product;
  productName: string;
  productSku: string;
  productDescription: null | string;
  amount: number;
  approvedAmount: number;
  rejectedAmount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
