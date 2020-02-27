import { Component, OnInit, ViewEncapsulation, AfterViewInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { Helpers } from '../../../../../../../../helpers';
import { ScriptLoaderService } from '../../../../../../../../_services/script-loader.service';
import { AdminService } from '../../../../../../../../services/admin.service';
import { CommonService } from '../../../../../../../../services/common.service';
import { AlertComponent } from '../../../../../../../../auth/_directives/alert.component';
import { AlertService } from '../../../../../../../../auth/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { componentFactoryName } from '@angular/compiler';


declare let $: any;

@Component({
    selector: 'app-list-mainbanner',
    templateUrl: './list-mainbanner.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: []
})

export class ListMainbannerComponent implements OnInit {

  private mainbannerData: any;
  private message: any;


  constructor(
      private _script: ScriptLoaderService,
      private _admin: AdminService,
      private _alertService: AlertService,
      private cfr: ComponentFactoryResolver,
      private _common: CommonService,
      private _route: ActivatedRoute,
      private _router: Router,
      private fb: FormBuilder
  ) { }

  ngOnInit() {
      this._admin.getMainBannerDetails().subscribe(
          res => {
              this.mainbannerData = res.data;
          }, err => {
              console.log(err);
              this.message = err['message'];
          }
      );
  }

  deleteBanner(id) {
      this._admin.deleteMainBannerById(id).subscribe(
          res => {
              this.ngOnInit();
          }, err => {
              console.log(err);
              this.message = err['message'];
          }
      );
  }

  updateBannerStatus(id) {
    this._admin.updateMainBannerStatus(id).subscribe(
        res => {
            this.ngOnInit();
        }, err => {
            console.log(err);
            this.message = err['message'];
        }
    );
}


}
