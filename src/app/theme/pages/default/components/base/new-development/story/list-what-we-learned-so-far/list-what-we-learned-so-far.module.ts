import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ListWhatWeLearnedSoFarComponent } from './list-what-we-learned-so-far.component';
import { LayoutModule } from '../../../../../../../layouts/layout.module';
import { DefaultComponent } from '../../../../../default.component';
import { FormsModule } from '@angular/forms';


const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "",
                "component": ListWhatWeLearnedSoFarComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule
    ], exports: [
        RouterModule
    ], declarations: [
        ListWhatWeLearnedSoFarComponent
    ]
})
export class ListWhatWeLearnedSoFarModule {



}