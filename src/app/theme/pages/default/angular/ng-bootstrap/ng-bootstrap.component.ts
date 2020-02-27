import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { OrdersService } from '../../../../../services/orders.service';
import { BreweryService } from '../../../../../services/brewery.service';
import { Helpers } from '../../../../../helpers';

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./ng-bootstrap.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./ng-bootstrap.component.css'],
  providers: [OrdersService]
})
export class NgBootstrapComponent implements OnInit, AfterViewInit {

  userDetail: any
  subdomain: any
  message: any
  flag: any
  website_type: any
  buttonstatus: any = 0
  brewery_id: any

  private currentPage: number;
  private totalItems: number;
  readonly pagination_limit: number = 6;
  isShow = true;
  role: any
  notiList:any = ''
  notiListLength:any

  subdomainStatus:any
  adminnotiList:any = ''
  adminnotiListMessage:any
  adminnotiListLength:any


  constructor(
    private _brewery: BreweryService,
    private _order: OrdersService
  ) { }

  private Orders: any;

  ngAfterViewInit() {
    this.getOrders()
    this.getNotificationList()
  }


  ngOnInit() {
    this.userDetail = JSON.parse(localStorage.getItem("userDetail"))
    this.role = this.userDetail.role
    this.subdomain = this.userDetail.brewery.subdomain
    this.brewery_id = this.userDetail.brewery.id
    this.website_type = this.userDetail.brewery.website_type
    this.subdomainStatus = this.userDetail.brewery.admin_review_status
    if (this.subdomainStatus == 1) {
      this.buttonstatus = 1
    }
  }

  approvedSite(id){
    var data = {
      "brewery_id": id,
      "notification_type": 2
    }
    this._brewery.updateNotificationType(data).subscribe(
      res => {
        if (res['status'] == true) {
          this.notiList = res['data']
          this.message = res['message']
          this.flag = 'warning'
        } else if (res['status'] == false) {
          this.message = res['message']
          this.flag = 'danger'
        }
      }, err => {
        this.message = err['message']
        this.flag = 'danger'
      }
    )
  }

  rejectSite(id){
    var data = {
      "brewery_id": id,
      "notification_type": 1
    }
    this._brewery.updateNotificationType(data).subscribe(
      res => {
        if (res['status'] == true) {
          this.notiList = res['data']
          this.message = res['message']
          this.flag = 'success'
        } else if (res['status'] == false) {
          this.message = res['message']
          this.flag = 'danger'
        }
      }, err => {
        this.message = err['message']
        this.flag = 'danger'
      }
    )
  }

  generateReviewToken() {
    this._brewery.generateReviewToken(this.subdomain).subscribe(
      res => {
        if (res['status'] == true) {
          var page_url = "http://manage.fftb.co.uk/brewerysite/" + this.subdomain + "/?token=" + res['token']
          window.open(page_url)
        } else if (res['status'] == false) {
          this.message = res['message'];
          this.flag = 'danger';
        }
      }, err => {
        this.message = err['message'];
        this.flag = 'danger';
      }
    );
  }

  generateReviewTokenForAdmin(subdomain) {
    this._brewery.generateReviewToken(subdomain).subscribe(
      res => {
        if (res['status'] == true) {
          var page_url = "http://manage.fftb.co.uk/brewerysite/" + subdomain + "/?token=" + res['token']
          window.open(page_url)
        } else if (res['status'] == false) {
          this.message = res['message'];
          this.flag = 'danger';
        }
      }, err => {
        this.message = err['message'];
        this.flag = 'danger';
      }
    );
  }

  showNotification() {
    this.isShow = !this.isShow
    this.getNotificationList()
  }

  requestReviewToAdmin() {

    let formData = {
      'brewery_id': this.brewery_id,
      'notification_text': 'Please review and publish my site',
      'notification_type': '0'
    }

    this._brewery.requestReviewToAdmin(formData).subscribe(
      res => {
        if (res['status'] == true) {
          this.message = res['message']
          this.flag = 'success'
          this.buttonstatus = 1
        } else if (res['status'] == false) {
          this.message = res['message']
          this.flag = 'danger'
        }
      }, err => {
        this.message = err['message']
        this.flag = 'danger'
      }
    )
  }

  getNotificationList() {

    if (this.role == 'brewery') {
      this._brewery.getNotificationList(this.brewery_id).subscribe(
        res => {
          if (res['status'] == true) {
            this.notiList = res['data']
            this.notiListLength = res['data'].length
            // this.message = res['message']
            // this.flag = 'success'
            // this.buttonstatus = 1
          } else if (res['status'] == false) {
            this.message = res['message']
            this.flag = 'danger'
          }
        }, err => {
          this.message = err['message']
          this.flag = 'danger'
        }
      )
    
    } else if (this.role == 'admin') {
      this._brewery.getNotificationList(0).subscribe(
        res => {
          if (res['status'] == true) {
            this.adminnotiList = res['data']
            this.adminnotiListLength = res['data'].length
            this.adminnotiListMessage = res['message']
            
          } else if (res['status'] == false) {
            this.message = res['message']
            this.flag = 'danger'
          }
        }, err => {
          this.message = err['message']
          this.flag = 'danger'
        }
      )
    }

  }

  // list to get orders
  getOrders(page: number = 1) {
    Helpers.setLoading(true);
    this._order.get(page, this.pagination_limit).subscribe(data => {
      this.Orders = data.data.data;
      this.currentPage = data.data.current_page;
      this.totalItems = data.data.total;
      Helpers.setLoading(false);
    }, err => {
      Helpers.setLoading(false);
    })
  }

  /**
   * Calculate Order total
   */
  orderTotal(order: Object): number {
    let total = parseFloat(order['shippingCharge']);

    // add order-items price in total
    for (let item of order['items']) {
      total += parseFloat(item.price) * parseInt(item.quantity);
    }

    return total;
  }

  /**
   * Show only last 6 characters of OrderUUID
   */
  showLastSixCharOnly(orderUUID: string): string {
    return orderUUID.substr(-8);
  }
}