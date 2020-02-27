import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, RoleGuard } from "../auth/_guards";


const routes: Routes = [{
    "path": "",
    "component": ThemeComponent,
    "canActivate": [AuthGuard],
    "children": [{
        "path": "index",
        "loadChildren": "./pages/default/angular/ng-bootstrap/ng-bootstrap.module#NgBootstrapModule"
    }, {
        "path": "orders",
        "loadChildren": "./pages/default/angular/ng-bootstrap/ng-bootstrap.module#NgBootstrapModule"
    },
    {
        "path": "profile",
        "loadChildren": "./pages/default/crud/wizard/wizard-wizard-1/wizard-wizard-1.module#WizardWizard1Module"
    },
    {
        "path": "profile/Add_address",
        "loadChildren": "./pages/default/crud/wizard/AddAddress/add-address.module#AddAddressModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery', 'admin'] }
    },
    {
        "path": "profile/edit",
        "loadChildren": "./pages/default/angular/primeng/primeng.module#PrimengModule"
    },
    {
        "path": "orders/:orderUUID",
        "loadChildren": "./pages/default/snippets/invoices/invoices-invoice-2/invoices-invoice-2.module#InvoicesInvoice2Module"
    },
    {
        "path": "faq",
        "loadChildren": "./pages/default/snippets/faq/faq-faq-1/faq-faq-1.module#FaqFaq1Module"
    },
    {
        "path": "brewery/products",
        "loadChildren": "./pages/default/crud/datatables/basic/basic-scrollable/basic-scrollable.module#BasicScrollableModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery', 'admin'] }
    },
    {
        "path": "users/brewery",
        "loadChildren": "./pages/default/crud/datatables/extensions/add-brewery/add-brewery.module#AddBreweryModule",
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
    },
    {
        "path": "brewery/products/new",
        "loadChildren": "./pages/default/crud/datatables/extensions/extensions-buttons/extensions-buttons.module#ExtensionsButtonsModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery', 'admin'] }
    },
    {
        "path": "brewery/products/:productId",
        "loadChildren": "./pages/default/crud/datatables/extensions/extensions-buttons/extensions-buttons.module#ExtensionsButtonsModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery', 'admin'] }
    },
    {
        "path": "brewery/orders",
        "loadChildren": "./pages/default/crud/datatables/basic/basic-paginations/basic-paginations.module#BasicPaginationsModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery', 'admin'] }
    },
    {
        "path": "brewery/payments",
        "loadChildren": "./pages/default/crud/metronic-datatable/api/api-events/api-events.module#ApiEventsModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery', 'admin'] }
    },
    {
        "path": "brewery/managers",
        "loadChildren": "./pages/default/crud/metronic-datatable/api/api-methods/api-methods.module#ApiMethodsModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    },
    {
        "path": "breweries/:breweryId/managers",
        "loadChildren": "./pages/default/crud/metronic-datatable/api/api-methods/api-methods.module#ApiMethodsModule",
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
    },
    {
        "path": "brewery",
        "loadChildren": "./pages/default/crud/datatables/extensions/extensions-colreorder/extensions-colreorder.module#ExtensionsColreorderModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    },
    {
        "path": "breweries/:breweryId",
        "loadChildren": "./pages/default/crud/datatables/extensions/extensions-colreorder/extensions-colreorder.module#ExtensionsColreorderModule",
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
    },
    {
        "path": "brewery/blogs",
        "loadChildren": "./pages/default/components/base/tabs/tabs-bootstrap/tabs-bootstrap.module#TabsBootstrapModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery', 'admin'] }
    },
    {
        "path": "brewery/blogs/:blogId",
        "loadChildren": "./pages/default/components/base/base-blockui/base-blockui.module#BaseBlockuiModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery', 'admin'] }
    }, {
        "path": "brewery/blogs/new",
        "loadChildren": "./pages/default/components/base/base-blockui/base-blockui.module#BaseBlockuiModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    },
    {
        "path": "admin/breweries",
        "loadChildren": "./pages/default/crud/datatables/basic/basic-basic/basic-basic.module#BasicBasicModule",
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
    }, {
        "path": "brewery/remove",
        "loadChildren": "./pages/default/components/timeline/timeline-timeline-2/timeline-timeline-2.module#TimelineTimeline2Module",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }

        ///////////////////////////// New Developement ////////////////////////
        ////////////////////// Banner ////////////


        , {
        "path": "brewery/add-banner",
        "loadChildren": "./pages/default/components/base/new-development/brewery-banner/add-banner/add-banner.module#AddBannerModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }, {
        "path": "brewery/banner",
        "loadChildren": "./pages/default/components/base/new-development/brewery-banner/banner/banner.module#BannerModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }, {
        "path": "brewery/edit-banner/:bannerId",
        "loadChildren": "./pages/default/components/base/new-development/brewery-banner/edit-banner/edit-banner.module#EditBannerModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }
        ///////////////////// Process ///////////////
        , {
        "path": "brewery/add-our-process",
        "loadChildren": "./pages/default/components/base/new-development/process/add-our-process/add-our-process.module#AddOurProcessModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }, {
        "path": "brewery/our-process",
        "loadChildren": "./pages/default/components/base/new-development/process/our-process/our-process.module#OurProcessModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }, {
        "path": "brewery/edit-our-process/:processId",
        "loadChildren": "./pages/default/components/base/new-development/process/edit-our-process/edit-our-process.module#EditOurProcessModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }
        ///////////////////// Story ///////////////
        , {
        "path": "brewery/add-our-story",
        "loadChildren": "./pages/default/components/base/new-development/story/add-our-story/add-our-story.module#AddOurStoryModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }, {
        "path": "brewery/our-story",
        "loadChildren": "./pages/default/components/base/new-development/story/our-story/our-story.module#OurStoryModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }, {
        "path": "brewery/edit-our-story/:storyId",
        "loadChildren": "./pages/default/components/base/new-development/story/edit-our-story/edit-our-story.module#EditOurStoryModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }
        ///////////////////// Subscriber ///////////////
        , {
        "path": "brewery/send-subscriber",
        "loadChildren": "./pages/default/components/base/new-development/subscriber/send-subscriber/send-subscriber.module#SendSubscriberModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }, {
        "path": "brewery/subscriber-list",
        "loadChildren": "./pages/default/components/base/new-development/subscriber/subscriber-list/subscriber-list.module#SubscriberListModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }
        ///////////////////// Our Team ///////////////
        , {
        "path": "brewery/add-our-team",
        "loadChildren": "./pages/default/components/base/new-development/team/add-our-team/add-our-team.module#AddOurTeamModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }, {
        "path": "brewery/our-team",
        "loadChildren": "./pages/default/components/base/new-development/team/our-team/our-team.module#OurTeamModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }, {
        "path": "brewery/edit-our-team/:teamId",
        "loadChildren": "./pages/default/components/base/new-development/team/edit-our-team/edit-our-team.module#EditOurTeamModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }
        ///////////////////// Our Testimonial ///////////////
        , {
        "path": "brewery/add-testimonial",
        "loadChildren": "./pages/default/components/base/new-development/testimonial/add-testimony/add-testimony.module#AddTestimonyModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }, {
        "path": "brewery/testimonial",
        "loadChildren": "./pages/default/components/base/new-development/testimonial/testimony/testimony.module#TestimonyModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }, {
        "path": "brewery/edit-testimonial/:testimonialId",
        "loadChildren": "./pages/default/components/base/new-development/testimonial/edit-testimony/edit-testimony.module#EditTestimonyModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }
        ///////////////////// Contact page ///////////////
        , {
        "path": "brewery/contact",
        "loadChildren": "./pages/default/components/base/new-development/contact/contact/contact.module#ContactModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }, {
        "path": "brewery/add-contact-page-details",
        "loadChildren": "./pages/default/components/base/new-development/contact/add-contact-page-details/add-contact-page-details.module#AddContactPageDetailsModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    },
    ///////////////////// About page ///////////////
    {
        "path": "brewery/second-about-section",
        "loadChildren": "./pages/default/components/base/new-development/about/second-about-section/second-about-section.module#SecondAboutSectionModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }, {
        "path": "brewery/edit-third-about-section/:Id",
        "loadChildren": "./pages/default/components/base/new-development/about/edit-third-about-section/edit-third-about-section.module#EditThirdAboutSectionModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }, {
        "path": "brewery/add-third-about-section",
        "loadChildren": "./pages/default/components/base/new-development/about/add-third-about-section/add-third-about-section.module#AddThirdAboutSectionModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }, {
        "path": "brewery/list-third-about-section",
        "loadChildren": "./pages/default/components/base/new-development/about/list-third-about-section/list-third-about-section.module#ListThirdAboutSectionModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    },
    ///////////////////// Home page ///////////////
    {
        "path": "brewery/add-our-passion",
        "loadChildren": "./pages/default/components/base/new-development/home/add-home-our-passion/add-home-our-passion.module#AddHomeOurPassionModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }, {
        "path": "brewery/edit-our-passion/:Id",
        "loadChildren": "./pages/default/components/base/new-development/home/edit-home-our-passion/edit-home-our-passion.module#EditHomeOurPassionModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }, {
        "path": "brewery/list-our-passion",
        "loadChildren": "./pages/default/components/base/new-development/home/list-home-our-passion/list-home-our-passion.module#ListHomeOurPassionModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }, {
        "path": "brewery/add-what-we-learned-so-far",
        "loadChildren": "./pages/default/components/base/new-development/story/add-what-we-learned-so-far/add-what-we-learned-so-far.module#AddWhatWeLearnedSoFarModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }, {
        "path": "brewery/edit-what-we-learned-so-far/:Id",
        "loadChildren": "./pages/default/components/base/new-development/story/edit-what-we-learned-so-far/edit-what-we-learned-so-far.module#EditWhatWeLearnedSoFarModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }
        , {
        "path": "brewery/list-what-we-learned-so-far",
        "loadChildren": "./pages/default/components/base/new-development/story/list-what-we-learned-so-far/list-what-we-learned-so-far.module#ListWhatWeLearnedSoFarModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }
        , {
        "path": "brewery/add-home-third-section",
        "loadChildren": "./pages/default/components/base/new-development/home/add-home-third-section/add-home-third-section.module#AddHomeThirdSectionModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }
        , {
        "path": "brewery/edit-home-third-section/:Id",
        "loadChildren": "./pages/default/components/base/new-development/home/edit-home-third-section/edit-home-third-section.module#EditHomeThirdSectionModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    }
        , {
        "path": "brewery/list-home-third-section",
        "loadChildren": "./pages/default/components/base/new-development/home/list-home-third-section/list-home-third-section.module#ListHomeThirdSectionModule",
        canActivate: [RoleGuard],
        data: { roles: ['brewery'] }
    },

    //////////////////////// Main site ///////////////////////////////

    //////////////////////// Banner ///////////////////////////////

    {
        "path": "admin/add-mainsite-banner",
        "loadChildren": "./pages/default/components/base/new-development/mainsite-banner/add-mainbanner/add-mainbanner.module#AddMainbannerModule",
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
    }, {
        "path": "admin/list-mainsite-banner",
        "loadChildren": "./pages/default/components/base/new-development/mainsite-banner/list-mainbanner/list-mainbanner.module#ListMainbannerModule",
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
    }, {
        "path": "admin/update-mainsite-banner/:Id",
        "loadChildren": "./pages/default/components/base/new-development/mainsite-banner/update-mainbanner/update-mainbanner.module#UpdateMainbannerModule",
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
    },
    //////////////////////// Banner ///////////////////////////////
    {
        "path": "admin/add-whychoose",
        "loadChildren": "./pages/default/components/base/new-development/mainsite-whychoose/add-whychoose/add-whychoose.module#AddWhychooseModule",
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
    }, 
    {
        "path": "admin/list-whychoose",
        "loadChildren": "./pages/default/components/base/new-development/mainsite-whychoose/list-whychoose/list-whychoose.module#ListWhychooseModule",
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
    }
    , {
        "path": "admin/update-whychoose/:Id",
        "loadChildren": "./pages/default/components/base/new-development/mainsite-whychoose/update-whychoose/update-whychoose.module#UpdateWhychooseModule",
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
    }

    ]
}]



@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ThemeRoutingModule { }