import { Component, OnInit } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

interface ProductRequest {
  productId: string | null;
  productSku: string | null;
  availableStock: number;
  amount: number;
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
  standalone: false,
})
export class CreateComponent implements OnInit {
  // General
  private _http = axios.create({
    baseURL: `${environment.apiUrl}`,
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem(
        environment.apiTokenIdentifier
      )}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  errorMessage: boolean = false;
  isCreating: boolean = false;

  // ng select
  productOptions: any[] = [];
  isProductOptionsLoading: boolean = false;

  // Form
  name: string | null = null;
  email: string | null = null;
  note: string | null = null;
  productRequests: ProductRequest[] = [
    {
      productId: null,
      productSku: null,
      availableStock: 0,
      amount: 0,
    },
  ];

  constructor(private _router: Router) {}

  ngOnInit(): void {
    this.getProductOptions();
  }

  async getProductOptions() {
    try {
      const response = await this._http.get('products');
      const data = response.data;

      this.productOptions = data.data.payload;
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

  addProduct() {
    this.productRequests.push({
      productId: null,
      productSku: null,
      availableStock: 0,
      amount: 0,
    });
  }

  deleteProduct(idx: number) {
    this.productRequests = this.productRequests.filter(
      (_, index) => index !== idx
    );
  }

  onChangeProduct(idx: number) {
    const selectedProduct: ProductRequest | undefined =
      this.productRequests.find((_, index) => index == idx);

    const product = this.productOptions.find(
      (prod) => prod.id == selectedProduct?.productId
    );

    if (selectedProduct) {
      selectedProduct.productSku = product.sku ?? null;
      selectedProduct.availableStock = product.newestStock ?? 0;
    }
  }

  async saveInputRequest() {
    if (this.isCreating) return;

    this.isCreating = true;

    const body: any = {
      name: this.name,
      email: this.email,
      note: this.note,
      detail: this.productRequests,
    };

    try {
      await this._http.post('request-input', body);

      await Swal.fire({
        title: 'Input request submitted successfully',
        icon: 'success',
        timer: 3000,
        showCloseButton: true,
      });

      this._router.navigateByUrl('/application/request-input');
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
      this.isCreating = false;
    }
  }
}
