import { Component, OnInit } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { StatusRequest, StockRequest } from '../../../types/stock-request';
import { Product } from '../../../types/product';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: false,
})
export class DashboardComponent implements OnInit {
  private _http = axios.create({
    baseURL: environment.apiUrl,
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem(
        environment.apiTokenIdentifier
      )}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  isLoading: boolean = false;

  // Data
  totalProduct: number = 0;
  totalInputRequest: number = 0;
  totalOutputRequest: number = 0;

  // Table data
  limit: number = 5;
  isLoadingOutputRequest: boolean = false;
  isLoadingInputRequest: boolean = false;
  isLoadingProduct: boolean = false;
  outputRequests: StockRequest[] = [];
  inputRequests: StockRequest[] = [];
  products: Product[] = [];

  ngOnInit(): void {
    this.getDataDashboard();
    this.getInputRequests();
    this.getOutputRequests();
    this.getProducts();
  }

  async getDataDashboard() {
    if (this.isLoading) return;

    this.isLoading = true;

    try {
      const response = await this._http.get('dashboard');

      const data = response.data;

      this.totalProduct = data.totalProduct;
      this.totalInputRequest = data.totalInputRequest;
      this.totalOutputRequest = data.totalOutputRequest;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status == 400) {
          let errorMessage: any = error.response?.data.message;

          if (Array.isArray(errorMessage)) {
            errorMessage = errorMessage.join('\n');
          }

          Swal.fire({
            title: errorMessage,
            icon: 'error',
            timer: 3000,
          });
        }
      }
    } finally {
      this.isLoading = false;
    }
  }

  async getOutputRequests() {
    this.isLoadingOutputRequest = true;

    const params: any = {
      limit: this.limit,
    };

    try {
      const response = await this._http.get('request-output', { params });
      const data = response.data;

      this.outputRequests = data.data.payload;
    } catch (error) {
      let errorMessage: string = 'Something went wrong. Please try again later';
      if (error instanceof AxiosError) {
        if (error.status == 400) {
          errorMessage = error.response?.data.message;

          if (Array.isArray(errorMessage)) {
            errorMessage = errorMessage.join(', ');
          }
        }
      }
      Swal.fire({
        title: errorMessage,
        icon: 'error',
        timer: 3000,
      });
    } finally {
      this.isLoadingOutputRequest = false;
    }
  }

  getStatusLabel(status: StatusRequest) {
    let label: string = '';

    if (status === 'PENDING') {
      label = 'Pending';
    } else if (status === 'APPROVED') {
      label = 'Approved';
    } else if (status === 'REJECTED') {
      label = 'Rejected';
    }
    return label;
  }

  getClassStatus(status: StatusRequest) {
    let statusClass: string = 'px-2 py-1 border border-solid rounded-full ';

    if (status === 'PENDING') {
      statusClass += 'bg-yellow-100 text-yellow-800 border-yellow-600 ';
    } else if (status === 'APPROVED') {
      statusClass += 'bg-green-100 text-green-800 border-green-600 ';
    } else if (status === 'REJECTED') {
      statusClass += 'bg-red-100 text-red-800 border-red-600 ';
    }
    return statusClass;
  }

  async getInputRequests() {
    this.isLoading = true;

    const params: any = {
      limit: this.limit,
    };

    try {
      const response = await this._http.get('request-input', { params });
      const data = response.data;

      this.inputRequests = data.data.payload;
    } catch (error) {
      let errorMessage: string = 'Something went wrong. Please try again later';
      if (error instanceof AxiosError) {
        if (error.status == 400) {
          errorMessage = error.response?.data.message;

          if (Array.isArray(errorMessage)) {
            errorMessage = errorMessage.join(', ');
          }
        }
      }
      Swal.fire({
        title: errorMessage,
        icon: 'error',
        timer: 3000,
      });
    } finally {
      this.isLoading = false;
    }
  }

  async getProducts() {
    this.isLoadingProduct = true;

    try {
      const response = await this._http.get('products', {
        params: {
          limit: this.limit,
        },
      });

      const data = response.data;

      this.products = data.data.payload;
    } catch (error) {
      let errorMessage: string = 'Something went wrong. Please try again later';
      if (error instanceof AxiosError) {
        if (error.status == 400) {
          errorMessage = error.response?.data.message;

          if (Array.isArray(errorMessage)) {
            errorMessage = errorMessage.join('\n');
          }
        }
      }

      Swal.fire({
        title: errorMessage,
        icon: 'error',
        timer: 3000,
      });
    } finally {
      this.isLoadingProduct = false;
    }
  }
}
