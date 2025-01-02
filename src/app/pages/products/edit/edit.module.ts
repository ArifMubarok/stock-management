import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from './edit.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: EditComponent,
  },
];

@NgModule({
  declarations: [EditComponent],
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule],
})
export class EditModule {}
