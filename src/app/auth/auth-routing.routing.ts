import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';

import { CompleteRegistrationComponent } from './complete-registration.component';
import { ResetPasswordComponent } from './reset-password.component';
import { VerifyEmailComponent } from './verify-email.component';

const routes: Routes = [
    { path: '', component: AuthComponent },
    { path: 'verify-email/:token', component: VerifyEmailComponent },
    { path: 'complete-registration/:token', component: CompleteRegistrationComponent },
    { path: 'reset-password/:token', component: ResetPasswordComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {
}