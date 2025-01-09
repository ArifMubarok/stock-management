import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RequestInputComponent } from './request-input.component';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../components/pagination/pagination.component';

const routes: Routes = [
  {
    path: '',
    component: RequestInputComponent,
  },
  {
    path: 'create',
    loadChildren: () =>
      import('./create/create.module').then((m) => m.CreateModule),
  },
  {
    path: 'view/:id',
    loadChildren: () => import('./view/view.module').then((m) => m.ViewModule),
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./edit/edit.module').then((m) => m.EditModule),
  },
];

@NgModule({
  declarations: [RequestInputComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    PaginationComponent,
  ],
})
export class RequestInputModule {}
