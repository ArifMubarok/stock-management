import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  collapseShow: string = 'hidden';

  constructor(private _router: Router) {}

  toggleCollapseShow(classes: any) {
    this.collapseShow = classes;
  }

  logout() {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure want to logout',
      text: 'You will redirect to login page!',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.isConfirmed) {
        window.localStorage.removeItem(environment.apiTokenIdentifier);
        this._router.navigateByUrl('/login');
      }
    });
  }
}
