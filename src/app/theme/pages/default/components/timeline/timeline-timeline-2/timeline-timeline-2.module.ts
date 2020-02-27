import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TimelineTimeline2Component } from './timeline-timeline-2.component';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "",
                "component": TimelineTimeline2Component
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes),
        LayoutModule, FormsModule
    ], exports: [
        RouterModule
    ], declarations: [
        TimelineTimeline2Component
    ]
})
export class TimelineTimeline2Module {



}