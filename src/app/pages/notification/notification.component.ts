import { Component, OnInit } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { environment } from '../../../environments/environment';
import { Notification } from '../../../types/notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  standalone: false,
})
export class NotificationComponent implements OnInit {
  private _http = axios.create({
    baseURL: `${environment.apiUrl}/notifications`,
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
  notifications: Notification[] = [];
  totalItems: number = 0;
  page: number = 1;

  isOpenModalNotif: boolean = false;
  notifTitle: string | null = null;
  notifMessage: string | null = null;

  constructor() {}

  ngOnInit(): void {
    this.getNotifications();
  }

  async getNotifications() {
    if (this.isLoading) return;

    this.isLoading = true;

    try {
      const response = await this._http.get('', {
        params: { page: this.page },
      });

      const data = response.data;
      console.log(data);

      this.notifications = data.data.payload;
      this.page = data.data.currentPage;
      this.totalItems = data.data.totalAllData;
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

  openNotifModal() {
    this.isOpenModalNotif = true;
  }
  closeNotifModal() {
    this.isOpenModalNotif = false;
  }

  async view(notif: Notification) {
    try {
      const response = await this._http.get(`${notif.id}`);
      const data = response.data;

      this.notifTitle = data.data.notif.title;
      this.notifMessage = data.data.notif.message;
      this.openNotifModal();

      await this._http.post(`${notif.id}/read`);
      this.getNotifications();
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
    }
  }
}
