import { Component, OnInit, ViewEncapsulation, AfterViewInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { Helpers } from '../../../../../../../../helpers';
import { ScriptLoaderService } from '../../../../../../../../_services/script-loader.service';
import { BreweryService } from '../../../../../../../../services/brewery.service';
import { CommonService } from '../../../../../../../../services/common.service';
import { AlertComponent } from '../../../../../../../../auth/_directives/alert.component';
import { AlertService } from '../../../../../../../../auth/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { componentFactoryName } from '@angular/compiler';

@Component({
  selector: 'app-list-third-about-section',
  templateUrl: './list-third-about-section.component.html',
  styles: []
})
export class ListThirdAboutSectionComponent implements OnInit {

  private subdomainID: number;
  private userDetail: any;
  private aboutData: any;
  private message: any;
  subdomain: any;

  constructor(
    private _script: ScriptLoaderService,
    private _brewery: BreweryService,
    private _alertService: AlertService,
    private cfr: ComponentFactoryResolver,
    private _common: CommonService,
    private _route: ActivatedRoute,
    private _router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    setTimeout(function () {
      this.message = "";
      this.flag = "";
      $(".alert").hide();
    }, 1000);

    this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
    this.subdomainID = this.userDetail.brewery.id;
    this.subdomain = this.userDetail.brewery.subdomain;

    this._brewery.getAboutPageDetails(this.subdomain, '3').subscribe(
      res => {
        this.aboutData = res.data;
      }, err => {
        console.log(err);
        this.message = err['message'];
      }
    );
  }

  deleteStory(id) {

    alert(id);
    // this._brewery.deleteOurStoryById(id).subscribe(
    //     res => {
    //         this.ngOnInit();
    //     }, err => {
    //         console.log(err);
    //         this.message = err['message'];
    //     }
    // );

  }


}
