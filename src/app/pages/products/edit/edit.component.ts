import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios, { AxiosError } from 'axios';
import { environment } from '../../../../environments/environment';
import { Product } from '../../../../types/product';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
  standalone: false,
})
export class EditComponent implements OnInit {
  // General
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
  errorMessage: string | null = null;
  isUpdating: boolean = false;
  modelId: string | null;

  // form
  name: string | null = null;
  sku: string | null = null;
  description: string | null = null;
  initialStock: number = 0;
  latestInputStock: number = 0;
  latestOutputStock: number = 0;
  newestStock: number = 0;

  constructor(private _router: Router, private _route: ActivatedRoute) {
    this.modelId = this._route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getProductDetail();
  }

  async getProductDetail() {
    try {
      const response = await this._http.get(`${this.modelId}`);
      const data = response.data;
      const product: Product = data.data;

      this.name = product.name;
      this.sku = product.sku;
      this.description = product.description;
      this.initialStock = product.initialStock;
      this.latestInputStock = product.latestInputStock;
      this.latestOutputStock = product.latestOutputStock;
      this.newestStock = product.newestStock;
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
    }
  }

  async saveProduct() {
    if (this.isUpdating) return;

    const url = `${this.modelId}`;

    const body = {
      name: this.name,
      sku: this.sku,
      description: this.description,
      initialStock: this.initialStock,
      latestInputStock: this.latestInputStock,
      latestOutputStock: this.latestOutputStock,
      newestStock: this.newestStock,
    };

    try {
      await this._http.patch(url, body);

      await Swal.fire({
        icon: 'success',
        title: 'Products updated successfully',
        timer: 1000,
      });
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
      this.isUpdating = false;
    }
  }
}
