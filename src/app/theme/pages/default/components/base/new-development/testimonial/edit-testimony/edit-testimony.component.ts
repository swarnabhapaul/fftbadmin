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
    selector: 'app-edit-testimony',
    templateUrl: './edit-testimony.component.html',
    styles: []
})
export class EditTestimonyComponent implements OnInit {

    @ViewChild('alertBlog', { read: ViewContainerRef }) alertBlog: ViewContainerRef;

    private testimonialContent: any;
    private userDetail: any;

    private loading: boolean = false;
    private blogId: number;
    private subdomainID: any;
    private testimonialData: any;

    private model: any = {
        organisation_name: null,
        comment: null,
        author: null,
        role: null
    }
    testimonialForm: any;
    message: any;
    flag: any;
    getid: any;

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

        this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
        this.subdomainID = this.userDetail.brewery.id;
        this.getid = this._route.snapshot.paramMap.get('testimonialId');

        this.texteditor();
        this.testimonialForm = this.fb.group({
            organisation_name: '',
            comment: '',
            author: '',
            role: ''
        });

        // ========================================

        this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
        this.subdomainID = this.userDetail.brewery.id;

        this._brewery.getOurTestimonialById(this.getid).subscribe(
            res => {
                this.testimonialData = res.data[0];
                this.model.organisation_name = this.testimonialData.organisation_name;
                this.model.author = this.testimonialData.author;
                this.model.role = this.testimonialData.role;
                this.model.comment = this.testimonialData.comment;
                $('#my-summernote').summernote('code', this.testimonialData.comment);
                //console.log(this.testimonialData);
            }, err => {
                console.log(err);
                this.message = err['message'];
            }
        );

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
        this._script.loadScripts('app-add-testimony',
            ['assets/demo/default/custom/components/base/blockui.js']);

    }


    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    /**
     * Method to edit testimonial image
     */
    onSubmit() {
        let formData = new FormData();
        this.testimonialContent = $('#my-summernote').val();

        formData.append('comment', this.testimonialForm.patchValue({ comment: this.testimonialContent }));
        formData.append('organisation_name', this.testimonialForm.patchValue({ organisation_name: this.model.organisation_name }));
        formData.append('author', this.testimonialForm.patchValue({ author: this.model.author }));
        formData.append('role', this.testimonialForm.patchValue({ role: this.model.role }));

        this._brewery.updateOurTestimonial(this.testimonialForm.value, this.getid).subscribe(
            res => {
                if (res['status'] == true) {
                    this.message = res['message'];
                    this.flag = 'success';
                } else if (res['status'] == false) {
                    this.message = res['message'];
                    this.flag = 'danger';
                }
                this.ngOnInit();
            }, err => {
                console.log(err);
                this.message = err['message'];
                this.flag = 'danger';
            }
        );
    }

}
