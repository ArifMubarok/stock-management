import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios, { AxiosError } from 'axios';
import { environment } from '../../../../environments/environment';
import { Product } from '../../../../types/product';
import {
  StatusRequest,
  StockRequestItem,
  TypeRequest,
} from '../../../../types/stock-request';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
  standalone: false,
})
export class ViewComponent implements OnInit {
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
  modelId: string | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  // Data
  product!: Product;

  constructor(private _router: Router, private _route: ActivatedRoute) {
    this.modelId = this._route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getProductDetail();
  }

  viewEdit() {
    this._router.navigateByUrl(`/settings/products/edit/${this.modelId}`);
  }

  async getProductDetail() {
    this.isLoading = true;

    try {
      const response = await this._http.get(`${this.modelId}`);
      const data = response.data;

      this.product = data.data;
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
      this.isLoading = false;
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

  getTypeLabel(type: TypeRequest) {
    let label: string = '';

    if (type === 'INPUT') {
      label = 'Input';
    } else if (type === 'OUTPUT') {
      label = 'Output';
    }
    return label;
  }

  getTypeClass(type: TypeRequest) {
    let typeClass: string = 'px-2 py-1 border border-solid rounded-full ';

    if (type === 'INPUT') {
      typeClass += 'bg-green-100 text-green-800 border-green-600 ';
    } else if (type === 'OUTPUT') {
      typeClass += 'bg-red-100 text-red-800 border-red-600 ';
    }
    return typeClass;
  }

  viewDetail(history: StockRequestItem) {
    console.log(history);

    if (history.stockRequest.type == 'INPUT') {
      this._router.navigateByUrl(
        `/application/request-input/view/${history.stockRequestId}`
      );
    } else if (history.stockRequest.type == 'OUTPUT') {
      this._router.navigateByUrl(
        `/application/request-output/view/${history.stockRequestId}`
      );
    }
  }
}
