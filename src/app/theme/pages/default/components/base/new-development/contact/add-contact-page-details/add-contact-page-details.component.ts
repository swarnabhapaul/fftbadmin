//import { Component, OnInit } from '@angular/core';
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
  selector: 'app-add-contact-page-details',
  templateUrl: "./add-contact-page-details.component.html",
  encapsulation: ViewEncapsulation.None,
  styles: []
})
export class AddContactPageDetailsComponent implements OnInit {

  @ViewChild('alertImage',
    { read: ViewContainerRef }) alertImage: ViewContainerRef;

  readonly MIN_FILE_SIZE_IN_BYTE: number = 1000;
  readonly MAX_FILE_SIZE_IN_BYTE: number = 27000;
  readonly ALLOW_FILE_EXT: Array<String> = ['jpg', 'jpeg', 'png'];
  readonly IMG_DIR: string = 'contactus';//

  private blogLogo: string;
  private blogContent: string;
  private bname: string;
  private userDetail: any;

  private loading: boolean = false;
  private blogId: number;
  private model: any = {
    editid: "",
    text: "",
    address: "",
    image: "",
    phone: "",
    email: "",
    time: "",
    ifream: "",
    facebook_link: "",
    instagram_link: "",
    twitter_link: "",
    pinterest_link: "",
    footer_about: ""
  }
  contactForm: any;
  message: any;
  flag: any;
  conData: any;
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

  name = new FormControl('');

  ngOnInit() {

    this.contactForm = this.fb.group({
      editid: new FormControl(),
      content: new FormControl(),
      address: new FormControl(),
      image: new FormControl(),
      phone: new FormControl(),
      email: new FormControl(),
      time: new FormControl(),
      iframe: new FormControl(),
      facebook_link: new FormControl(),
      instagram_link: new FormControl(),
      twitter_link: new FormControl(),
      pinterest_link: new FormControl(),
      footer_about: new FormControl()
    });

    this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
    this.bname = this.userDetail.brewery.subdomain;
    this.texteditor();

    this._brewery.getContactPageDetails(this.bname).subscribe(
      res => {
        this.conButton = "Update";
        this.conData = res.data[0];
        this.blogLogo = 'http://api.fftb.co.uk/image/contactus/' + this.conData.id;
        $('#my-summernote').summernote('code', this.conData.text);
        this.contactForm.controls['editid'].setValue(this.conData.id)
        this.contactForm.controls['phone'].setValue(this.conData.phone)
        this.contactForm.controls['email'].setValue(this.conData.email)
        this.contactForm.controls['time'].setValue(this.conData.time)
        this.contactForm.get('address').setValue(this.conData.address)
        this.contactForm.get('iframe').setValue(this.conData.iframe)
        this.contactForm.controls['facebook_link'].setValue(this.conData.facebook_link)
        this.contactForm.controls['instagram_link'].setValue(this.conData.instagram_link)
        this.contactForm.controls['twitter_link'].setValue(this.conData.twitter_link)
        this.contactForm.controls['pinterest_link'].setValue(this.conData.pinterest_link)
      }, err => {
        console.log(err);
        this.message = err['message'];
      }
    );


  }

  texteditor() {
    $('#my-summernote ,#footer_about').summernote({
      minHeight: 400,
      placeholder: 'Compose an epic...',
      'en-US': {
        font: {
          bold: 'Bold',
          italic: 'Italic',
          underline: 'Underline',
          clear: 'Remove Font Style',
          height: 'Line Height',
          name: 'Font Family',
          strikethrough: 'Strikethrough',
          subscript: 'Subscript',
          superscript: 'Superscript',
          size: 'Font Size'
        },
        image: {
          image: 'Picture',
          insert: 'Insert Image',
          resizeFull: 'Resize Full',
          resizeHalf: 'Resize Half',
          resizeQuarter: 'Resize Quarter',
          floatLeft: 'Float Left',
          floatRight: 'Float Right',
          floatNone: 'Float None',
          shapeRounded: 'Shape: Rounded',
          shapeCircle: 'Shape: Circle',
          shapeThumbnail: 'Shape: Thumbnail',
          shapeNone: 'Shape: None',
          dragImageHere: 'Drag image or text here',
          dropImage: 'Drop image or Text',
          selectFromFiles: 'Select from files',
          maximumFileSize: 'Maximum file size',
          maximumFileSizeError: 'Maximum file size exceeded.',
          url: 'Image URL',
          remove: 'Remove Image',
          original: 'Original'
        },

        link: {
          link: 'Link',
          insert: 'Insert Link',
          unlink: 'Unlink',
          edit: 'Edit',
          textToDisplay: 'Text to display',
          url: 'To what URL should this link go?',
          openInNewWindow: 'Open in new window'
        },

        hr: {
          insert: 'Insert Horizontal Rule'
        },
        style: {
          style: 'Style',
          p: 'Normal',
          blockquote: 'Quote',
          pre: 'Code',
          h1: 'Header 1',
          h2: 'Header 2',
          h3: 'Header 3',
          h4: 'Header 4',
          h5: 'Header 5',
          h6: 'Header 6'
        },

        options: {
          help: 'Help',
          fullscreen: 'Full Screen',
          codeview: 'Code View'
        },

        color: {
          recent: 'Recent Color',
          more: 'More Color',
          background: 'Background Color',
          foreground: 'Foreground Color',
          transparent: 'Transparent',
          setTransparent: 'Set transparent',
          reset: 'Reset',
          resetToDefault: 'Reset to default'
        },
        shortcut: {
          shortcuts: 'Keyboard shortcuts',
          close: 'Close',
          textFormatting: 'Text formatting',
          action: 'Action',
          paragraphFormatting: 'Paragraph formatting',
          documentStyle: 'Document Style',
          extraKeys: 'Extra keys'
        },

        history: {
          undo: 'Undo',
          redo: 'Redo'
        },
        specialChar: {
          specialChar: 'SPECIAL CHARACTERS',
          select: 'Select Special characters'
        }
      }
    });

  }

  ngAfterViewInit() {
    this._script.loadScripts('app-add-contact-page-details',
      ['assets/demo/default/custom/components/base/blockui.js']);

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
      return this._alertService.error(`Image size must be between 400 * 300 px`);

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

    console.log(val)
    val['text'] = $('#my-summernote').val()
    val['footer_about'] = $('#footer_about').val()
    val['image'] = this.model.image

    if (val.editid == "") {
      this._brewery.addContactPageDetails(val, this.bname).subscribe(
        res => {
          if (res['status'] == true) {
            this.message = res['message'];
            this.flag = 'success';
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
    } else {
      this._brewery.updateContactPageDetails(val, this.bname).subscribe(
        res => {
          if (res['status'] == true) {
            this.message = res['message'];
            this.flag = 'success';
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

    this.ngOnInit();
  }



}
