import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent implements OnInit {
  @Input({ required: true }) totalItems: number = 0;
  @Input({ required: true }) perPage!: number;
  @Input({ required: true }) currentPage!: number;
  @Output() selectedPage: EventEmitter<number> = new EventEmitter<number>();

  totalPage: number = 0;
  pages: number[] = [];

  constructor() {}

  ngOnInit(): void {
    this.totalPage = Math.ceil(this.totalItems / this.perPage);

    this.pages = this.initPages(this.currentPage, this.totalPage);
  }

  initPages(currentPage: number, lastPage: number): number[] {
    if (lastPage <= 10) {
      const pages = [];
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }

      return pages;
    }

    if (currentPage >= 10) {
      if (currentPage >= lastPage - 4) {
        return [1, -1, lastPage - 5, lastPage - 4, lastPage - 3, lastPage - 2, lastPage - 1, lastPage];
      } else {
        return [1, -1, currentPage - 3, currentPage - 2, currentPage -1, currentPage, currentPage + 1, currentPage + 2, currentPage + 3, -1, lastPage];
      }
    }

    if (isNaN(lastPage)) {
      return [1]
    }

    return [1, 2, 3, 4, 5, 6, 7, 8, -1, lastPage];
  }

  selectPage(page: number) {
    if (page <= 0 ) {
      return;
    }

    this.selectedPage.emit(page);
  }
}
