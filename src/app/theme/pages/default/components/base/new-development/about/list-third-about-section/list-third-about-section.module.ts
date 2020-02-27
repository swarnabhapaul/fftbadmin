import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ListThirdAboutSectionComponent } from './list-third-about-section.component';
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
                "component": ListThirdAboutSectionComponent
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
        ListThirdAboutSectionComponent
    ]
})
export class ListThirdAboutSectionModule {



}
