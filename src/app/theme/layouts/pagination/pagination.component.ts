import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

    constructor() { }

    // get number of rows/items from response
    @Input() totalItems: number;

    // get current page to display
    @Input() currentPage: number;

    //   set pagination limit
    @Input() pagination_limit: number;

    @Output() childEvent = new EventEmitter<any>();

    // pager object
    pager: any = {};

    ngOnInit() { }


    /**
     * method to genertae page counter to design dynamic pagination
     * 
     * @param counter 
     * 
     * @returns array
     */
    getPager() {

        let totalItems = this.totalItems;
        let currentPage = this.currentPage;
        let pageSize = this.pagination_limit;

        // calculate total pages
        let totalPages = Math.ceil(totalItems / pageSize);

        // ensure current page isn't out of range
        if (currentPage < 1) {
            currentPage = 1;
        } else if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        let startPage: number, endPage: number;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

    /**
     * metod to refresh and get data from another page
     * @param page 
     */
    changePage(page: number = 1) {
        if (page !== this.currentPage)
            this.childEvent.emit(page);
    }

}