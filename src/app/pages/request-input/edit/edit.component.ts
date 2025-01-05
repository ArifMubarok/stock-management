import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios, { AxiosError } from 'axios';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';

interface ProductRequest {
  productId: string | null;
  productSku: string | null;
  availableStock: number;
  amount: number;
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
  standalone: false,
})
export class EditComponent implements OnInit {
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
  errorMessage: string | null = null;
  isUpdating: boolean = false;
  modelId: string | null = null;
  settingUp: boolean = false;
  successSetup: boolean = false;

  // ng select
  productOptions: any[] = [];
  isProductOptionsLoading: boolean = false;

  // Form
  name: string | null = null;
  email: string | null = null;
  note: string | null = null;
  productRequests: ProductRequest[] = [];

  constructor(private _router: Router, private _route: ActivatedRoute) {
    this.modelId = this._route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getProductOptions();
    this.getDetailInputRequest();
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

  async getDetailInputRequest() {
    try {
      const response = await this._http.get(`request-input/${this.modelId}`);
      const data = response.data;

      console.log(data);
      this.name = data.data.stockRequest.name;
      this.email = data.data.stockRequest.email;
      this.note = data.data.stockRequest.note;
      this.productRequests = data.data.stockRequest.stockRequestItems.map(
        (item: any): ProductRequest => {
          return {
            productId: item.productId,
            productSku: item.productSku,
            availableStock: item.product.newestStock,
            amount: item.amount,
          };
        }
      );

      this.successSetup = true;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status == 400) {
          let errorMessage: any = error.response?.data.message;

          if (Array.isArray(errorMessage)) {
            errorMessage = errorMessage.join(', ');
          }

          this.errorMessage = errorMessage;
        }
      }

      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
    } finally {
      this.settingUp = false;
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
    if (this.isUpdating) return;

    this.isUpdating = true;

    const body: any = {
      name: this.name,
      email: this.email,
      note: this.note,
      detail: this.productRequests,
    };

    try {
      await this._http.patch(`request-input/${this.modelId}`, body);

      await Swal.fire({
        title: 'Input request updated successfully',
        icon: 'success',
        timer: 3000,
        showCloseButton: true,
      });

      this._router.navigateByUrl(
        `/application/request-input/view/${this.modelId}`
      );
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
      this.isUpdating = false;
    }
  }
}
