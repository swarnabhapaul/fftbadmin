import { Component, OnInit, ViewEncapsulation, AfterViewInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { Helpers } from '../../../../../../../../helpers';
import { ScriptLoaderService } from '../../../../../../../../_services/script-loader.service';
import { BreweryService } from '../../../../../../../../services/brewery.service';
import { CommonService } from '../../../../../../../../services/common.service';
import { AlertComponent } from '../../../../../../../../auth/_directives/alert.component';
import { AlertService } from '../../../../../../../../auth/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';


declare let $: any;

@Component({
  selector: 'app-add-third-about-section',
  templateUrl: "./add-third-about-section.component.html",
  encapsulation: ViewEncapsulation.None,
  styles: []
})
export class AddThirdAboutSectionComponent implements OnInit {

  @ViewChild('alertImage', { read: ViewContainerRef }) alertImage: ViewContainerRef;

  readonly MIN_FILE_SIZE_IN_BYTE: number = 100;
  readonly MAX_FILE_SIZE_IN_BYTE: number = 3090;
  readonly ALLOW_FILE_EXT: Array<String> = ['jpg', 'jpeg', 'png'];
  readonly IMG_DIR: string = 'about';//

  private blogLogo: string;
  private blogContent: string;
  private bname: string;
  private userDetail: any;

  private loading: boolean = false;
  private blogId: number;
  private model: any = {
    section: 3,
    heading: "",
    count: "",
    image: ""
  }
  aboutForm: any;
  message: any = "";
  flag: any = "";
  conData: any = "";
  conButton: any = "Save";

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

    this.aboutForm = this.fb.group({
      section: 3,
      heading: new FormControl(),
      count: new FormControl(),
      image: new FormControl()
    });

    this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
    this.bname = this.userDetail.brewery.subdomain;
  }

  showAlert(target) {
    this[target].clear();
    let factory = this.cfr.resolveComponentFactory(AlertComponent);
    let ref = this[target].createComponent(factory);
    ref.changeDetectorRef.detectChanges();
  }

  /**
   * Method to upload image
   */
  uploadImg(event) {
    const file: File = event.target.files[0];
    // check if file is not empty 
    if (!file || !file.size) {
      return false;
    }
    // alert(file.size);
    console.log(file.size + ">" + this.MIN_FILE_SIZE_IN_BYTE);
    // check for file size
    if ((file.size < this.MIN_FILE_SIZE_IN_BYTE) || (file.size > this.MAX_FILE_SIZE_IN_BYTE)) {
      this.showAlert('alertImage');
      //return this._alertService.error(`Image size must be between ${this.MIN_FILE_SIZE_IN_BYTE / 1024} KB and ${this.MAX_FILE_SIZE_IN_BYTE / 1024} KB`);
      return this._alertService.error(`Image size must be between 30 * 48 px`);

    }

    let ext = /(?:\.([^.]+))?$/.exec(file.name)[1];

    // check for file extension
    if (!(this.ALLOW_FILE_EXT).includes(ext)) {
      let allowExt = (this.ALLOW_FILE_EXT).join(', ');
      this.showAlert('alertImage');
      return this._alertService.error(`Allow image extension: ${allowExt}`);
    }

    // check for allow extension
    let reader = new FileReader();
    reader.onload = (e: any) => {
      // show loader
      Helpers.setLoading(true);
      // upload avatar img on server
      this._common.uploadImg(file, this.IMG_DIR).subscribe(data => {
        // hide loader
        Helpers.setLoading(false)

        this.blogLogo = e.target.result;
        this.model.image = data.data[0];

        // show success notification
        this.showAlert('alertImage');
        this._alertService.success(data.message, true);

      }, error => {
        // hide loader
        Helpers.setLoading(false)
        // show login error
        this.showAlert('alertImage');
        this._alertService.error(JSON.stringify(JSON.parse(error._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
      })
    }
    reader.readAsDataURL(file);
  }

  /**
   * Method to add banner image
   */

  onSubmit(val) {

    val['image'] = this.model.image;

    this._brewery.addAboutPageDetails(val, this.bname).subscribe(
      res => {
        if (res['status'] == true) {
          this.message = res['message'];
          this.flag = 'success';
          this.ngOnInit();
        } else if (res['status'] == false) {
          this.message = res['message'];
          this.flag = 'danger';
        }
      }, err => {
        console.log(err);
        this.message = err['message'];
        this.flag = 'danger';
      }
    );



  }

}
