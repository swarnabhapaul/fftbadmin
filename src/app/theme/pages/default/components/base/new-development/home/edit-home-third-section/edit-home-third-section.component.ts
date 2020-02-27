import { Component, OnInit, ViewEncapsulation, AfterViewInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { Helpers } from '../../../../../../../../helpers';
import { ScriptLoaderService } from '../../../../../../../../_services/script-loader.service';
import { BreweryService } from '../../../../../../../../services/brewery.service';
import { CommonService } from '../../../../../../../../services/common.service';
import { AlertComponent } from '../../../../../../../../auth/_directives/alert.component';
import { AlertService } from '../../../../../../../../auth/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AnonymousSubject } from 'rxjs';

declare let $: any;

@Component({
    selector: 'app-edit-home-third-section',
    templateUrl: './edit-home-third-section.component.html',
    styles: []
})
export class EditHomeThirdSectionComponent implements OnInit {
    @ViewChild('alertMessage',{ read: ViewContainerRef }) alertMessage: ViewContainerRef;
    @ViewChild('alertImage',{ read: ViewContainerRef }) alertImage: ViewContainerRef;
    @ViewChild('alertImage2', { read: ViewContainerRef }) alertImage2: ViewContainerRef;
    readonly MIN_FILE_SIZE_IN_BYTE: number = 1000;
    readonly MAX_FILE_SIZE_IN_BYTE: number = 87000;
    readonly MIN_FILE_SIZE_IN_BYTE_SHORT: number = 3000;
    readonly MAX_FILE_SIZE_IN_BYTE_SHORT: number = 50000;
    readonly ALLOW_FILE_EXT: Array<String> = ['jpg', 'jpeg', 'png'];
    readonly IMG_DIR: string = 'homecms';//
    readonly IMG_DIR_2: string = 'homecms2';//
    private _fristImage: string;
    private _secImage: string;
    private fristImage: string;
    private secImage: string;
    private description: string;
    private bname: string;
    private userDetail: any;
    private loading: boolean = false;
    private blogId: number;
    private thirdsectionForm: any;
    private model: any = {
      title: null,
      short_title: null,
      description: null,
      small_image: null,
      large_image: null
    }
    message: any;
    flag: any;
    getid: any;
    subdomainID: any;
    storyData: any;

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
        this.message = "";
        this.description = '';
        this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
        this.bname = this.userDetail.brewery.subdomain;
        this.getid = this._route.snapshot.paramMap.get('Id');
        this.texteditor();
        this.thirdsectionForm = this.fb.group({
            title: '',
            short_title: '',
            description: '',
            small_image: '',
            large_image: ''
        });

        // ========================================

        this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
        this.subdomainID = this.userDetail.brewery.id;

        this._brewery.getHomeThirdSectionById(this.getid).subscribe(
            res => {
                this.storyData = res.data[0];
                this.fristImage = this.storyData.small_image;
                this.secImage = this.storyData.large_image;
                this._fristImage = 'http://api.fftb.co.uk/image/homecms/' + this.storyData.id;
                this._secImage = 'http://api.fftb.co.uk/image/homecms2/' + this.storyData.id;
                this.model.title = this.storyData.title;
                this.model.short_title = this.storyData.short_title;
                this.model.description = this.storyData.description;
                $('#my-description').summernote('code', this.storyData.description);
            }, err => {
                this.message = err['message'];
            }
        );

    }

    texteditor() {
        $('#my-description').summernote({
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
        this._script.loadScripts('app-edit-home-third-section',
            ['assets/demo/default/custom/components/base/blockui.js']);

    }


    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    /**
     * Method to upload big image
     */
    uploadBigImg(event) {

        const file: File = event.target.files[0];
        // check if file is not empty 
        if (!file || !file.size) {
            return false;
        }
        // alert(file.size);
        console.log(file.size + ">" + this.MIN_FILE_SIZE_IN_BYTE);
        // check for file size
        if ((file.size < this.MIN_FILE_SIZE_IN_BYTE) || (file.size > this.MAX_FILE_SIZE_IN_BYTE)) {
            this.showAlert('alertImage2');
            return this._alertService.error(`Image size must be between 385 * 385 px`);
            //return this._alertService.error(`Image size must be between ${this.MIN_FILE_SIZE_IN_BYTE / 1024} KB and ${this.MAX_FILE_SIZE_IN_BYTE / 1024} KB`);
        }

        let ext = /(?:\.([^.]+))?$/.exec(file.name)[1];

        // check for file extension
        if (!(this.ALLOW_FILE_EXT).includes(ext)) {
            let allowExt = (this.ALLOW_FILE_EXT).join(', ');
            this.showAlert('alertImage2');
            return this._alertService.error(`Allow image extension: ${allowExt}`);
        }

        // check for allow extension
        let reader = new FileReader();
        reader.onload = (e: any) => {
            // show loader
            Helpers.setLoading(true);
            // upload avatar img on server
            this._common.uploadImg(file, this.IMG_DIR_2).subscribe(data => {
                // hide loader
                Helpers.setLoading(false)

                this._fristImage = e.target.result;
                this.fristImage = data.data[0];

                // show success notification
                this.showAlert('alertImage2');
                this._alertService.success(data.message, true);

            }, error => {
                // hide loader
                Helpers.setLoading(false)
                // show login error
                this.showAlert('alertImage2');
                this._alertService.error(JSON.stringify(JSON.parse(error._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
            })
        }
        reader.readAsDataURL(file);
    }

    /**
     * Method to upload small image
     */
    uploadSmallImg(event) {

        const file: File = event.target.files[0];
        // check if file is not empty 
        if (!file || !file.size) {
            return false;
        }
        // alert(file.size);
        console.log(file.size + ">>>>" + this.MIN_FILE_SIZE_IN_BYTE_SHORT);
        // check for file size
        if ((file.size < this.MIN_FILE_SIZE_IN_BYTE_SHORT) || (file.size > this.MAX_FILE_SIZE_IN_BYTE_SHORT)) {
            this.showAlert('alertImage');
            return this._alertService.error(`Image size must be between 150 * 140 px`);
            //return this._alertService.error(`Image size must be between ${this.MIN_FILE_SIZE_IN_BYTE_SHORT / 1024} KB and ${this.MAX_FILE_SIZE_IN_BYTE / 1024} KB`);
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

                this._secImage = e.target.result;
                this.secImage = data.data[0];

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
     * Method to edit thirdsection
     */
    onSubmit() {
        let formData = new FormData();
        this.description = $('#my-description').val();
        formData.append('description', this.thirdsectionForm.patchValue({ description: this.description }));
        formData.append('short_title', this.thirdsectionForm.patchValue({ short_title: this.model.short_title }));
        formData.append('title', this.thirdsectionForm.patchValue({ title: this.model.title }));
        formData.append('small_image', this.thirdsectionForm.patchValue({ small_image: this.fristImage }));
        formData.append('large_image', this.thirdsectionForm.patchValue({ large_image: this.secImage }));
        this._brewery.updateHomeThirdSection(this.thirdsectionForm.value, this.getid).subscribe(
            res => {
                if (res['status'] == true) {
                    this.message = 'Data update successfully done.';
                    this.flag = 'success123';
                } else if (res['status'] == false) {
                    this.message = res['message'];
                    this.flag = 'danger';
                }
                this.showAlert('alertMessage');
                this._alertService.success(this.message, true);
                this.ngOnInit();

            }, err => {
                console.log(err);
                this.message = err['message'];
                this.flag = 'danger';
            }
        );
    }
}
