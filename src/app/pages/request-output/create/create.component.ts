import { Component, OnInit } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
  private _http = axios.create({
    baseURL: environment.apiUrl,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // Form
  name: string | null = null;
  email: string | null = null;
  note: string | null = null;
  purpose: string | null = null;
  productRequests: ProductRequest[] = [
    {
      productId: null,
      productSku: null,
      availableStock: 0,
      amount: 0,
    },
  ];

  // ng select
  productOptions: any[] = [];
  isProductOptionsLoading: boolean = false;

  // General
  isCreating: boolean = false;
  errorMessage: string | null = null;

  constructor(private _router: Router) {}

  ngOnInit(): void {
    this.getProductOptions();
  }

  async save() {
    const body = {
      name: this.name,
      email: this.email,
      note: this.note,
      purpose: this.purpose,
      detail: this.productRequests,
    };

    this.isCreating = true;

    try {
      await this._http.post('request-output', body);

      await Swal.fire({
        title: 'Output request submitted successfully',
        icon: 'success',
        timer: 3000,
        showCloseButton: true,
      });
      this.resetForm();
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
      this.isCreating = false;
    }
  }

  resetForm() {
    this.name = null;
    this.email = null;
    this.note = null;
    this.purpose = null;
    this.productRequests = [
      {
        productId: null,
        productSku: null,
        availableStock: 0,
        amount: 0,
      },
    ];
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
      selectedProduct.productSku = product?.sku || null;
      selectedProduct.availableStock = product?.newestStock || 0;
    }
  }
  onSearchProduct(event: any) {
    const searchQuery = event?.term || null;
    this.getProductOptions(searchQuery);
  }
  onOpenProductOptions(item: ProductRequest) {
    if (!item.productId) {
      this.getProductOptions();
    }
  }

  async getProductOptions(keyword: string = '') {
    this.isProductOptionsLoading = true;

    try {
      const response = await this._http.get(
        'request-output/get-product-options',
        { params: { keyword } }
      );
      const data = response.data;

      this.productOptions = data.data;
    } catch (error) {
      console.log(error);
      let errorMessage: string = 'Something went wrong. Please try again later';
      if (error instanceof AxiosError) {
        if (error.status == 400) {
          errorMessage = error.response?.data.message;

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
      this.isProductOptionsLoading = false;
    }
  }
}
