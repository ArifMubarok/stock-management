import { Component, OnInit } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { environment } from '../../../environments/environment';
import { Product } from '../../../types/product';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  standalone: false,
})
export class ProductsComponent implements OnInit {
  private _http = axios.create({
    baseURL: `${environment.apiUrl}/products`,
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem(
        environment.apiTokenIdentifier
      )}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // General
  isLoading: boolean = false;
  errorMessage: string | null = null;

  // Data
  products: Product[] = [];
  totalItems: number = 0;
  page: number = 1;
  perPage: number = 10;

  // Search
  nameSearch: string = '';
  skuSearch: string = '';

  constructor(private _router: Router) {}

  ngOnInit(): void {
    this.getDataProducts();
  }

  search() {
    this.page = 1;
    this.getDataProducts();
  }

  async getDataProducts() {
    if (this.isLoading) return;

    this.isLoading = true;

    try {
      const response = await this._http.get('', {
        params: {
          page: this.page,
          limit: this.perPage,
          name: this.nameSearch,
          sku: this.skuSearch,
        },
      });

      const data = response.data;

      this.products = data.data.payload;
      this.page = data.data.currentPage;
      this.totalItems = data.data.totalAllData;
      this.perPage = data.data.limit;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status == 400) {
          let errorMessage: any = error.response?.data.message;

          if (Array.isArray(errorMessage)) {
            errorMessage = errorMessage.join('\n');
          }

          this.errorMessage = errorMessage;
        }
      }

      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
    } finally {
      this.isLoading = false;
    }
  }

  view(product: Product) {
    this._router.navigateByUrl(`/settings/products/view/${product.id}`);
  }

  async delete(id: number) {
    try {
      const result = await Swal.fire({
        title: 'Are you sure to delete this product ?',
        icon: 'warning',
        confirmButtonText: 'OK',
        showConfirmButton: true,
        showCancelButton: true,
      });

      if (!result.isConfirmed) {
        return;
      }

      await this._http.delete(`${id}`);

      Swal.fire({
        title: 'Product deleted successfully',
        icon: 'success',
        timer: 2000,
      });

      this.getDataProducts();
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
    }
  }

  viewCreate() {
    this._router.navigateByUrl('/settings/products/create');
  }

  selectedPage(page: number) {
    this.page = page;
    this.getDataProducts();
  }
}
