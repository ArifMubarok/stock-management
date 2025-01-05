import { Component, OnInit } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { environment } from '../../../../environments/environment';
import { StockRequest } from '../../../../types/stock-request';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

interface ApproveProduct {
  productId: string;
  productName: string;
  productSku: string;
  availableStock: number;
  requestAmount: number;
  approveAmount: number;
}

interface ApproveFormDetail {
  productId: string;
  approvedAmount: number;
}

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
  standalone: false,
})
export class ViewComponent implements OnInit {
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
  modelId: string | null;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  outputRequest!: StockRequest;

  // Form
  approveProduct: ApproveProduct[] = [];
  approveDetail: ApproveFormDetail[] = [];
  reason: string | null = null;
  rejectReason: string | null = null;

  // Modal Approver
  isApproving: boolean = false;
  isOpenApproverModal: boolean = false;

  // Modal Approver
  isRejecting: boolean = false;
  isOpenRejecterModal: boolean = false;

  constructor(private _router: Router, private _route: ActivatedRoute) {
    this.modelId = this._route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getDetailOutputRequest();
  }

  async getDetailOutputRequest() {
    this.isLoading = true;

    try {
      const response = await this._http.get(`${this.modelId}`);
      const data = response.data;

      this.outputRequest = data.data.stockRequest;

      this.approveProduct = this.outputRequest.stockRequestItems.map(
        (item): ApproveProduct => ({
          productId: `${item.productId}`,
          productName: item.productName,
          productSku: item.productSku,
          availableStock: item.product?.newestStock || 0,
          requestAmount: item.amount,
          approveAmount: 0,
        })
      );

      console.log(this.outputRequest, this.approveProduct);
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

  openApproverModal() {
    this.isOpenApproverModal = true;
  }
  closeApproverModal() {
    this.isOpenApproverModal = false;
  }

  openRejecterModal() {
    this.isOpenRejecterModal = true;
  }
  closeRejecterModal() {
    this.isOpenRejecterModal = false;
  }

  async approve() {
    if (this.isApproving) return;

    this.isApproving = true;

    const url = `${this.modelId}/approve`;

    this.approveDetail = this.approveProduct.map((item: ApproveProduct) => ({
      productId: item.productId,
      approvedAmount: item.approveAmount,
    }));

    const body = {
      reason: this.reason,
      detail: this.approveDetail,
    };

    try {
      await this._http.post(url, body);

      await Swal.fire({
        title: 'Output request approved successfully',
        icon: 'success',
        timer: 3000,
        showCloseButton: true,
      });

      this.closeApproverModal();
      this.getDetailOutputRequest();
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
      this.isApproving = false;
    }
  }

  async reject() {
    if (this.isRejecting) return;

    this.isRejecting = true;

    const url = `${this.modelId}/reject`;

    const body = {
      reason: this.rejectReason,
    };

    try {
      await this._http.post(url, body);

      await Swal.fire({
        title: 'Output request rejected successfully',
        icon: 'success',
        timer: 3000,
        showCloseButton: true,
      });

      this.closeRejecterModal();
      this.getDetailOutputRequest();
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
      this.isRejecting = false;
    }
  }
}
