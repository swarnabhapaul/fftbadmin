import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AddContactPageDetailsComponent } from './add-contact-page-details.component';
import { LayoutModule } from '../../../../../../../layouts/layout.module';
import { DefaultComponent } from '../../../../../default.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "",
                "component": AddContactPageDetailsComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule, ReactiveFormsModule
    ], exports: [
        RouterModule
    ], declarations: [
        AddContactPageDetailsComponent
    ]
})
export class AddContactPageDetailsModule {



}