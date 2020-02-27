import { Component, OnInit, ViewEncapsulation, AfterViewInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { Helpers } from '../../../../../../../../helpers';
import { ScriptLoaderService } from '../../../../../../../../_services/script-loader.service';
import { AdminService } from '../../../../../../../../services/admin.service';
import { CommonService } from '../../../../../../../../services/common.service';
import { AlertComponent } from '../../../../../../../../auth/_directives/alert.component';
import { AlertService } from '../../../../../../../../auth/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

declare let $: any;

@Component({
  selector: 'app-add-mainbanner',
  templateUrl: "./add-mainbanner.component.html",
  encapsulation: ViewEncapsulation.None,
  styles: []
})
export class AddMainbannerComponent implements OnInit {

  @ViewChild('alertBlog',
    { read: ViewContainerRef }) alertBlog: ViewContainerRef;

  @ViewChild('alertbesideImage',
    { read: ViewContainerRef }) alertbesideImage: ViewContainerRef;

  @ViewChild('alertbackgroundImage',
    { read: ViewContainerRef }) alertbackgroundImage: ViewContainerRef;

  readonly MIN_FILE_SIZE_IN_BYTE_BESIDE: number = 13000;
  readonly MAX_FILE_SIZE_IN_BYTE_BESIDE: number = 320000;

  readonly MIN_FILE_SIZE_IN_BYTE_BACKGROUND: number = 512000;
  readonly MAX_FILE_SIZE_IN_BYTE_BACKGROUND: number = 1331200;

  readonly IMG_DIR_BESIDE: string = 'mainsitebanner';
  readonly IMG_DIR_BACKGROUND: string = 'mainsitebanner2';

  readonly ALLOW_FILE_EXT: Array<String> = ['jpg', 'jpeg', 'png'];

  private besideLogo: string;
  private backgroundLogo: string;
  private blogContent: string;
  private loading: boolean = false;
  private blogId: number;
  private model: any = {
    banner_backgound_image: null,
    banner_beside_image: null,
    banner_heading: false,
    banner_description: false
  }
  mainbannerForm: any;
  message: any;
  flag: any;

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
    this.texteditor();
    this.mainbannerForm = this.fb.group({
      banner_backgound_image: '',
      banner_beside_image: '',
      banner_heading: '',
      banner_description: ''
    });
  }

  texteditor() {
    $('#my-summernote').summernote({
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
    this._script.loadScripts('app-add-mainbanner', ['assets/demo/default/custom/components/base/blockui.js']);
  }

  showAlert(target) {
    this[target].clear();
    let factory = this.cfr.resolveComponentFactory(AlertComponent);
    let ref = this[target].createComponent(factory);
    ref.changeDetectorRef.detectChanges();
  }

  uploadbackgroundImg(event) {
    const file: File = event.target.files[0];
    // check if file is not empty 
    if (!file || !file.size) {
      return false;
    }
    // alert(file.size);
    console.log(file.size + ">" + this.MIN_FILE_SIZE_IN_BYTE_BACKGROUND);
    // check for file size
    if ((file.size < this.MIN_FILE_SIZE_IN_BYTE_BACKGROUND) || (file.size > this.MAX_FILE_SIZE_IN_BYTE_BACKGROUND)) {
      this.showAlert('alertbackgroundImage');
      return this._alertService.error(`Image size must be between 1300 * 500`);
    }

    let ext = /(?:\.([^.]+))?$/.exec(file.name)[1];

    // check for file extension
    if (!(this.ALLOW_FILE_EXT).includes(ext)) {
      let allowExt = (this.ALLOW_FILE_EXT).join(', ');
      this.showAlert('alertbackgroundImage');
      return this._alertService.error(`Allow image extension: ${allowExt}`);
    }

    // check for allow extension
    let reader = new FileReader();
    reader.onload = (e: any) => {
      // show loader
      Helpers.setLoading(true);
      // upload avatar img on server
      this._common.uploadImg(file, this.IMG_DIR_BACKGROUND).subscribe(data => {
        // hide loader
        Helpers.setLoading(false)

        this.backgroundLogo = e.target.result;
        this.model.banner_backgound_image = data.data[0];

        console.log(this.backgroundLogo+'--------------'+this.model.banner_backgound_image)

        // show success notification
        this.showAlert('alertbackgroundImage');
        this._alertService.success(data.message, true);

      }, error => {
        // hide loader
        Helpers.setLoading(false)
        // show login error
        this.showAlert('alertbackgroundImage');
        this._alertService.error(JSON.stringify(JSON.parse(error._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
      })
    }
    reader.readAsDataURL(file);
  }

  uploadbesideImg(event) {
    const file: File = event.target.files[0];
    // check if file is not empty 
    if (!file || !file.size) {
      return false;
    }
    // alert(file.size);
    console.log(file.size + ">" + this.MIN_FILE_SIZE_IN_BYTE_BESIDE);
    // check for file size
    if ((file.size < this.MIN_FILE_SIZE_IN_BYTE_BESIDE) || (file.size > this.MAX_FILE_SIZE_IN_BYTE_BESIDE)) {
      this.showAlert('alertbesideImage');
      return this._alertService.error(`Image size must be between 150 * 400`);
    }

    let ext = /(?:\.([^.]+))?$/.exec(file.name)[1];

    // check for file extension
    if (!(this.ALLOW_FILE_EXT).includes(ext)) {
      let allowExt = (this.ALLOW_FILE_EXT).join(', ');
      this.showAlert('alertbesideImage');
      return this._alertService.error(`Allow image extension: ${allowExt}`);
    }

    // check for allow extension
    let reader = new FileReader();
    reader.onload = (e: any) => {
      // show loader
      Helpers.setLoading(true);
      // upload avatar img on server
      this._common.uploadImg(file, this.IMG_DIR_BESIDE).subscribe(data => {
        // hide loader
        Helpers.setLoading(false)

        this.besideLogo = e.target.result;
        this.model.banner_beside_image = data.data[0];

        //console.log(this.besideLogo+'============'+this.model.banner_beside_image)

        // show success notification
        this.showAlert('alertbesideImage');
        this._alertService.success(data.message, true);

      }, error => {
        // hide loader
        Helpers.setLoading(false)
        // show login error
        this.showAlert('alertbesideImage');
        this._alertService.error(JSON.stringify(JSON.parse(error._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
      })
    }
    reader.readAsDataURL(file);
  }

  onSubmit() {

    let formData = new FormData();
    this.blogContent = $('#my-summernote').val();

    formData.append('banner_heading', this.model.banner_heading)

    formData.append('banner_description',
      this.mainbannerForm.patchValue({
        banner_description: this.blogContent
      })
    )

    formData.append('banner_backgound_image',
      this.mainbannerForm.patchValue({
        banner_backgound_image: this.model.banner_backgound_image
      })
    )

    formData.append('banner_beside_image',
      this.mainbannerForm.patchValue({
        banner_beside_image: this.model.banner_beside_image
      })
    )

    this._admin.addMainBanner(this.mainbannerForm.value).subscribe(
      res => {
        if (res['status'] == true) {
          this.message = res['message'];
          this.flag = 'success';
        } else if (res['status'] == false) {
          this.message = res['message'];
          this.flag = 'danger';
        }
        $('#my-summernote').summernote('code', '');
        this.besideLogo = '';
        this.backgroundLogo = '';
        this.mainbannerForm.reset();
      }, err => {
        console.log(err);
        this.message = err['message'];
        this.flag = 'danger';
      }
    );

  }

}
