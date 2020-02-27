import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EditOurProcessComponent } from './edit-our-process.component';
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
                "component": EditOurProcessComponent
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
        EditOurProcessComponent
    ]
})
export class EditOurProcessModule {



}