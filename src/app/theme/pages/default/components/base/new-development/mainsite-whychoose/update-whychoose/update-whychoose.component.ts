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
  selector: 'app-update-whychoose',
  templateUrl: './update-whychoose.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: []
})
export class UpdateWhychooseComponent implements OnInit {

  @ViewChild('alertBlog',
    { read: ViewContainerRef }) alertBlog: ViewContainerRef;

  @ViewChild('alertImage',
    { read: ViewContainerRef }) alertImage: ViewContainerRef;

  readonly MIN_FILE_SIZE_IN_BYTE_WHYCHOOSE: number = 108;
  readonly MAX_FILE_SIZE_IN_BYTE_WHYCHOOSE: number = 60960;

  readonly IMG_DIR_WHYCHOOSE: string = 'whychoose';

  readonly ALLOW_FILE_EXT: Array<String> = ['jpg', 'jpeg', 'png'];

  private whychooseLogo: string;
  private shortContent: string;
  private longContent: string;

  private loading: boolean = false;
  private blogId: number;
  private model: any = {
    id: false,
    why_choose_image: null,
    why_choose_heading: false,
    why_choose_short_description: false,
    why_choose_long_description: false
  }
  whychooseForm: any;
  message: any;
  flag: any;
  getid: any;
  whychooseData: any

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

    this.getid = this._route.snapshot.paramMap.get('Id');
    this.model.id = this.getid;
    this._admin.getWhyChooseById(this.getid).subscribe(
      res => {
        this.whychooseData = res.data[0];
        this.whychooseLogo = 'http://api.fftb.co.uk/image/whychoose/' + this.whychooseData.id;
        this.model.why_choose_image = this.whychooseData.why_choose_image;
        this.model.why_choose_heading = this.whychooseData.why_choose_heading;
        this.model.why_choose_short_description = this.whychooseData.why_choose_short_description;
        this.model.why_choose_long_description = this.whychooseData.why_choose_long_description;
        $('#my-summernote-short').summernote('code', this.whychooseData.why_choose_short_description);
        $('#my-summernote-long').summernote('code', this.whychooseData.why_choose_long_description);
      }, err => {
        console.log(err);
        this.message = err['message'];
      }
    );

    this.texteditor();
    this.whychooseForm = this.fb.group({
      id: this.getid,
      why_choose_image: '',
      why_choose_heading: '',
      why_choose_short_description: '',
      why_choose_long_description: ''
    });
  }

  texteditor() {
    $('#my-summernote-long').summernote({
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

    $('#my-summernote-short').summernote({
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
    this._script.loadScripts('app-add-whychoose', ['assets/demo/default/custom/components/base/blockui.js']);
  }

  showAlert(target) {
    this[target].clear();
    let factory = this.cfr.resolveComponentFactory(AlertComponent);
    let ref = this[target].createComponent(factory);
    ref.changeDetectorRef.detectChanges();
  }

  uploadwhychooseImg(event) {
    const file: File = event.target.files[0];
    // check if file is not empty 
    if (!file || !file.size) {
      return false;
    }
    // alert(file.size);
    console.log(this.MAX_FILE_SIZE_IN_BYTE_WHYCHOOSE + "<" + file.size + ">" + this.MIN_FILE_SIZE_IN_BYTE_WHYCHOOSE);
    // check for file size
    if ((file.size < this.MIN_FILE_SIZE_IN_BYTE_WHYCHOOSE) || (file.size > this.MAX_FILE_SIZE_IN_BYTE_WHYCHOOSE)) {
      this.showAlert('alertImage');
      return this._alertService.error(`Image size must be between 40 * 40`);
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
      this._common.uploadImg(file, this.IMG_DIR_WHYCHOOSE).subscribe(data => {
        // hide loader
        Helpers.setLoading(false)

        this.whychooseLogo = e.target.result;
        this.model.why_choose_image = data.data[0];


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


  onSubmit() {

    let formData = new FormData();
    this.shortContent = $('#my-summernote-short').val()
    this.longContent = $('#my-summernote-long').val()

    alert("why_choose_heading===> " + this.model.why_choose_heading)

    formData.append('id', this.getid)

   // formData.append('why_choose_heading', this.model.why_choose_heading)

    formData.append('why_choose_heading',
      this.whychooseForm.patchValue({
        why_choose_heading: this.model.why_choose_heading
      })
    )

    formData.append('why_choose_short_description',
      this.whychooseForm.patchValue({
        why_choose_short_description: this.shortContent
      })
    )

    formData.append('why_choose_long_description',
      this.whychooseForm.patchValue({
        why_choose_long_description: this.longContent
      })
    )

    formData.append('why_choose_image',
      this.whychooseForm.patchValue({
        why_choose_image: this.model.why_choose_image
      })
    )
    console.log('==============>', formData.get("why_choose_heading"))
    console.log('==============>', this.whychooseForm.value)
    // this._admin.updateWhyChoose(this.whychooseForm.value).subscribe(
    //   res => {
    //     if (res['status'] == true) {
    //       this.message = res['message'];
    //       this.flag = 'success';
    //     } else if (res['status'] == false) {
    //       this.message = res['message'];
    //       this.flag = 'danger';
    //     }
    //     $('#my-summernote-short').summernote('code', '');
    //     $('#my-summernote-long').summernote('code', '');

    //     this.whychooseLogo = '';
    //     this.whychooseForm.reset();
    //   }, err => {
    //     console.log(err);
    //     this.message = err['message'];
    //     this.flag = 'danger';
    //   }
    // );

  }



}
