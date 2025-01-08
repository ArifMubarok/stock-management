import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
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

    console.log(
      this.totalPage,
      this.totalItems,
      this.perPage,
      this.currentPage
    );
  }
}
