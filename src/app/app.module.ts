import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme/theme.component';
import { LayoutModule } from './theme/layouts/layout.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScriptLoaderService } from "./_services/script-loader.service";
import { ThemeRoutingModule } from "./theme/theme-routing.module";
import { AuthModule } from "./auth/auth.module";
import { AdminService } from './services/admin.service';
import { BreweryService } from './services/brewery.service';
import { CommonService } from './services/common.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { AddWhychooseComponent } from './theme/pages/default/components/base/new-development/mainsite-whychoose/add-whychoose/add-whychoose.component';
//import { ListWhychooseComponent } from './theme/pages/default/components/base/new-development/mainsite-whychoose/list-whychoose/list-whychoose.component';
//import { UpdateWhychooseComponent } from './theme/pages/default/components/base/new-development/mainsite-whychoose/update-whychoose/update-whychoose.component';
//import { UpdateMainbannerComponent } from './theme/pages/default/components/base/new-development/mainsite-banner/update-mainbanner/update-mainbanner.component';
//import { ListMainbannerComponent } from './theme/pages/default/components/base/new-development/mainsite-banner/list-mainbanner/list-mainbanner.component';
//import { AddMainbannerComponent } from './theme/pages/default/components/base/new-development/mainsite-banner/add-mainbanner/add-mainbanner.component';

@NgModule({
    declarations: [
        AppComponent,
        ThemeComponent
    ],
    imports: [
        LayoutModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        AuthModule,
        ThemeRoutingModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [ScriptLoaderService, BreweryService, CommonService, AdminService],
    bootstrap: [AppComponent]
})
export class AppModule {

}