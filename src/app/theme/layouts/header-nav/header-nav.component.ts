import { Component, OnInit, ViewEncapsulation, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from "../../../auth/_services/user.service";
import { UserProfile } from '../../_models/UserProfile';
import { BreweryService } from '../../../services/brewery.service';

declare let mLayout: any;

@Component({
    selector: "app-header-nav",
    templateUrl: "./header-nav.component.html",
    styleUrls: ['./header-nav.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class HeaderNavComponent implements OnInit, AfterViewInit {

    loginUser: UserProfile;
    userDetail:any
    role:any
    subdomain:any
    brewery_id:any
    website_type:any
    message:any
    flag:any

    constructor(
        private _userService: UserService, 
        private changeDetector: ChangeDetectorRef,
        private _brewery: BreweryService
        ) { }

    ngOnInit() { 
        
        this.userDetail = JSON.parse(localStorage.getItem("userDetail"))
        this.role = this.userDetail.role
        this.subdomain = this.userDetail.brewery.subdomain
        this.brewery_id = this.userDetail.brewery.id
        this.website_type = this.userDetail.brewery.website_type
        //alert("oninit>>>>>"+this.website_type)
    }

    getLoginUser(){
      this._brewery.getLoginUser().subscribe(res=>{
        //localStorage.removeItem("userDetail");
        console.log(res)
        //localStorage.setItem('userDetail', JSON.stringify(res.data));
      },err=>{
        console.log('=====>',err)
      })
    }

    updateWebsiteType(value){
        let data = {
            "breweryid" : this.brewery_id,
            "type" : value
        }
        this._brewery.updateWebsiteType(data).subscribe(
            res => {
              if (res['status'] == true) {
                this.message = res['message']
                this.flag = 'success'
                this.getLoginUser()
                this.ngOnInit()
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

    ngAfterViewInit() {
        mLayout.initHeader();
        // get user information
        if (localStorage.getItem('userDetail')) {
            this.loginUser = JSON.parse(localStorage.getItem('userDetail'));
        }
        this.changeDetector.detectChanges();
    }
}