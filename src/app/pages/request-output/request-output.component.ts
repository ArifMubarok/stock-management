import { Component, OnInit } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { StatusRequest, StockRequest } from '../../../types/stock-request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-output',
  templateUrl: './request-output.component.html',
  styleUrl: './request-output.component.scss',
  standalone: false,
})
export class RequestOutputComponent implements OnInit {
  // General
  private _http = axios.create({
    baseURL: `${environment.apiUrl}/request-output`,
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
  outputRequests: StockRequest[] = [];
  page: number = 1;
  totalItems: number = 0;

  // Filter
  name: string | null = null;
  email: string | null = null;

  constructor(private _router: Router) {}

  ngOnInit(): void {
    this.getOutputRequests();
  }

  viewCreate() {
    this._router.navigateByUrl('/application/request-input/create');
  }

  view(inputRequest: any) {
    this._router.navigateByUrl(
      `/application/request-output/view/${inputRequest.id}`
    );
  }

  async getOutputRequests() {
    this.isLoading = true;

    const params: any = {
      page: this.page,
    };

    try {
      const response = await this._http.get('', { params });
      const data = response.data;

      this.outputRequests = data.data.payload;
      this.page = data.data.currentPage;
      this.totalItems = data.data.totalAllData;
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

  async delete(id: number) {
    try {
      const result = await Swal.fire({
        title: 'Are you sure to delete this input request ?',
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
        title: 'Input request deleted successfully',
        icon: 'success',
        timer: 2000,
      });

      this.getOutputRequests();
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
}
