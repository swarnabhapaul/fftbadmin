import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Helpers } from '../../../../../../../helpers';
import { BreweryService } from '../../../../../../../services/brewery.service';

@Component({
    selector: "app-tabs-bootstrap",
    templateUrl: "./tabs-bootstrap.component.html",
    styleUrls: ['./tabs-bootstrap.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class TabsBootstrapComponent implements OnInit {

    constructor(private _brewery: BreweryService) { }

    private status: boolean = true;
    private blogs: any;
    private currentPage: number;
    private totalItems: number;
    readonly pagination_limit: number = 10;
    private userRole: string;

    ngOnInit() {
        this.getBlogList();
        this.userRole = (JSON.parse(localStorage.userDetail)).role;
    }

    getBlogList(page: number = 1) {
        Helpers.setLoading(true);
        this._brewery.listBlogs(page, this.pagination_limit, this.status).subscribe(data => {
            this.blogs = data.data.data;
            this.currentPage = data.data.current_page;
            this.totalItems = data.data.total;

            Helpers.setLoading(false);
        }, err => {
            Helpers.setLoading(false);
        })
    }

    changeStatus(status: boolean, elem) {
        this.status = status;
        $(elem).closest('.btn-group').find('label').removeClass('status-active');
        $(elem).addClass('status-active');
        this.getBlogList();
    }

    updateBlogStatus(blogId: number, currentStatus: boolean) {
        Helpers.setLoading(true);
        this._brewery.updateBlogStatus(blogId, !currentStatus).subscribe(data => {
            Helpers.setLoading(false);
            this.getBlogList();
        }, err => {
            Helpers.setLoading(false);
        })
    }
}