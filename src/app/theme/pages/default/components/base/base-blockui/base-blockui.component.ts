import { Component, OnInit, ViewEncapsulation, AfterViewInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { Helpers } from '../../../../../../helpers';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { BreweryService } from '../../../../../../services/brewery.service';
import { CommonService } from '../../../../../../services/common.service';
import { AlertComponent } from '../../../../../../auth/_directives/alert.component';
import { AlertService } from '../../../../../../auth/_services';
import { ActivatedRoute, Router } from '@angular/router';

declare let $: any;
@Component({
    selector: "app-base-blockui",
    templateUrl: "./base-blockui.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class BaseBlockuiComponent implements OnInit, AfterViewInit {

    @ViewChild('alertBlog',
        { read: ViewContainerRef }) alertBlog: ViewContainerRef;

    readonly MIN_FILE_SIZE_IN_BYTE: number = 1024;
    readonly MAX_FILE_SIZE_IN_BYTE: number = 102400;
    readonly ALLOW_FILE_EXT: Array<String> = ['jpg', 'jpeg', 'png'];
    readonly IMG_DIR: string = 'blog';
    private blogLogo: string;
    private loading: boolean = false;
    private blogId: number;

    private model: any = {
        title: null,
        content: null,
        status: false,
        image: null
    }

    constructor(
        private _script: ScriptLoaderService,
        private _brewery: BreweryService,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver,
        private _common: CommonService,
        private _route: ActivatedRoute,
        private _router: Router,
    ) { }

    ngOnInit() {
        this.texteditor();
        this.clickOnSubmit();

        // check if blogId exists
        if (this._route.snapshot.params.blogId) {
            this.blogId = this._route.snapshot.params.blogId;
            // fetch blog information
            this.getBlog(this.blogId);
        }
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
            /*  minHeight: 200,
             placeholder: 'Write here ...',
             focus: false,
             airMode: false,
             fontNames: ['Roboto', 'Calibri', 'Times New Roman', 'Arial'],
             fontNamesIgnoreCheck: ['Roboto', 'Calibri'],
             dialogsInBody: true,
             dialogsFade: true,
             disableDragAndDrop: false,
             toolbar: [
               // [groupName, [list of button]]
               ['style', ['bold', 'italic', 'underline', 'clear']],
               ['para', ['style', 'ul', 'ol', 'paragraph']],
               ['fontsize', ['fontsize']],
               ['font', ['strikethrough', 'superscript', 'subscript']],
               ['height', ['height']],
               ['misc', ['undo', 'redo', 'print', 'help', 'fullscreen']]
             ],
             popover: {
               air: [
                 ['color', ['color']],
                 ['font', ['bold', 'underline', 'clear']]
               ]
             },
             print: {
               //'stylesheetUrl': 'url_of_stylesheet_for_printing'
             } */
        });

    }

    ngAfterViewInit() {
        this._script.loadScripts('app-base-blockui',
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

        // check for file size
        if ((file.size < this.MIN_FILE_SIZE_IN_BYTE) && (file.size > this.MAX_FILE_SIZE_IN_BYTE)) {
            this.showAlert('alertBlog');
            return this._alertService.error(`Image size must be between ${this.MIN_FILE_SIZE_IN_BYTE / 1024} KB and ${this.MAX_FILE_SIZE_IN_BYTE / 1024} KB`);
        }

        let ext = /(?:\.([^.]+))?$/.exec(file.name)[1];

        // check for file extension
        if (!(this.ALLOW_FILE_EXT).includes(ext)) {
            let allowExt = (this.ALLOW_FILE_EXT).join(', ');
            this.showAlert('alertBlog');
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
                this.showAlert('alertBlog');
                this._alertService.success(data.message, true);

            }, error => {
                // hide loader
                Helpers.setLoading(false)
                // show login error
                this.showAlert('alertBlog');
                this._alertService.error(JSON.stringify(JSON.parse(error._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
            })
        }
        reader.readAsDataURL(file);
    }

    toggleStatus() {
        this.model.status = !this.model.status;
    }

    clickOnSubmit() {
        document.getElementById('m_submit_blog').addEventListener('click', (e) => {
            this.model.content = $('#my-summernote').val();
            let form = $(e.target).closest('form');
            form.validate({
                rules: {
                    title: {
                        required: true,
                        maxlength: 255
                    },
                    content: {
                        required: true
                    },
                    status: {
                        required: true
                    },
                    image: {
                        maxlength: 255
                    }
                }
            })

            // check for form validation
            if (!form.valid()) {
                e.preventDefault();
                return;
            }

            this.submitBlog();
        });
    }

    /**
     * Submit blog
     */
    submitBlog() {
        // save blog data
        this.loading = true;
        Helpers.setLoading(true);

        let blog;

        let values = this.model;

        Object.keys(values).forEach((key) => (values[key] == null) && delete values[key]);

        // check for blogId exists
        if (this.blogId) {
            blog = this._brewery.updateBlog(this.blogId, values);
        } else {
            blog = this._brewery.saveBlog(values);
        }

        blog.subscribe(data => {
            this.blogId = data.data.blogId;
            this.showAlert('alertBlog');
            this._alertService.success(data.message, true);
            Helpers.setLoading(false);
            this.loading = false;
        }, err => {
            this.showAlert('alertBlog');
            this._alertService.error(JSON.stringify(JSON.parse(err._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
            Helpers.setLoading(false);
            this.loading = false;
        })
    }

    // get blog information
    getBlog(blogId: number) {
        Helpers.setLoading(true);
        this._brewery.getBlog(blogId).subscribe(data => {
            data = data.data;

            this.blogLogo = data.logo;
            this.model.title = data.title;
            this.model.status = data.status;
            this.model.content = data.content;
            $('#my-summernote').summernote('code', data.content);

            console.log(this.model.content)

            Helpers.setLoading(false);
        }, error => {
            Helpers.setLoading(false);
            this.showAlert('alertBlog');
            this._alertService.error(JSON.stringify(JSON.parse(error._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
        })
    }

    deleteBlog(blogId: number) {
        Helpers.setLoading(true);
        this._brewery.deleteBlog(blogId).subscribe(data => {
            this._router.navigate(['/brewery/blogs']);
            Helpers.setLoading(false);
        }, err => {
            this.showAlert('alertBlog');
            this._alertService.error(JSON.stringify(JSON.parse(err._body).errors).replace(/[^a-zA-Z:.\s]/g, ''));
            Helpers.setLoading(false);
        })
    }
}