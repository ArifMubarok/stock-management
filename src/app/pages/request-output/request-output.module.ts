import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RequestOutputComponent } from './request-output.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: RequestOutputComponent,
  },
  {
    path: 'view/:id',
    loadChildren: () => import('./view/view.module').then((m) => m.ViewModule),
  },
];

@NgModule({
  declarations: [RequestOutputComponent],
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule],
})
export class RequestOutputModule {}
