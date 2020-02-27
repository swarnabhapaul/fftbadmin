import { Injectable } from '@angular/core';

import { Http, Response, RequestOptions, Headers } from "@angular/http";

@Injectable()
export class BreweryService {

    constructor(private http: Http) { }

    readonly BACKEND_URL = "http://api.fftb.co.uk";
    // get brewery detail
    get(breweryId: number = null) {
        let url = this.BACKEND_URL + '/brewery';
        // check for role
        if (JSON.parse(localStorage.userDetail).role === 'admin') {
            url = this.BACKEND_URL + '/admin/breweries/' + breweryId;
        }

        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    }

    addAddress(data) {
        let url = this.BACKEND_URL + '/add-delivery-address';
        return this.http.post(url, data, this.jwt()).map((response: Response) => response.json());



    }

    // get brewery managers
    getManagers(breweryId: number = null) {
        let url = this.BACKEND_URL + '/brewery/managers';
        // check for role
        if (JSON.parse(localStorage.userDetail).role === 'admin') {
            url = this.BACKEND_URL + '/admin/breweries/' + breweryId + '/managers';
        }

        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    }

    // send invitation to user for associate accounts
    sendInvitation(email: string, breweryId: number = null) {
        let url = this.BACKEND_URL + '/brewery/invitation';
        // check for role
        if (JSON.parse(localStorage.userDetail).role === 'admin') {
            url = this.BACKEND_URL + '/admin/breweries/' + breweryId + '/invitation';
        }

        return this.http.post(url, JSON.stringify({ email: email }), this.jwt()).map((response: Response) => response.json());
    }

    // remove invitation
    removeInvitation(email: string, breweryId: number = null) {
        let url = this.BACKEND_URL + '/brewery/invitation';
        // check for role
        if (JSON.parse(localStorage.userDetail).role === 'admin') {
            url = this.BACKEND_URL + '/admin/breweries/' + breweryId + '/invitation';
        }

        return this.http.delete(url, this.jwt({ email: email })).map((response: Response) => response.json());
    }

    // update brewery values
    update(values: Object, breweryId: number = null) {
        let url = this.BACKEND_URL + '/brewery';
        // check for role
        if (JSON.parse(localStorage.userDetail).role === 'admin') {
            url = this.BACKEND_URL + '/admin/breweries/' + breweryId;
        }
        return this.http.put(url, JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    listProducts(page: number, paginate: number) {
        let url = new URL(this.BACKEND_URL + '/brewery/products');
        url.searchParams.append('page', page.toString());
        url.searchParams.append('paginate', paginate.toString());

        return this.http.get(url.href, this.jwt()).map((response: Response) => response.json());
    }

    saveProduct(values: Object) {
        return this.http.post(this.BACKEND_URL + '/brewery/products', JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    updateProduct(productId: number, values: Object) {
        return this.http.put(this.BACKEND_URL + '/brewery/products/' + productId, JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    deleteProduct(productId: number) {
        return this.http.delete(this.BACKEND_URL + '/brewery/products/' + productId, this.jwt()).map((response: Response) => response.json());
    }

    getProductById(productId: number) {
        return this.http.get(this.BACKEND_URL + '/brewery/products/' + productId, this.jwt()).map((response: Response) => response.json());
    }

    listBlogs(page: number, paginate: number, status: boolean) {
        let url = new URL(this.BACKEND_URL + '/brewery/blogs');
        url.searchParams.append('page', page.toString());
        url.searchParams.append('paginate', paginate.toString());
        url.searchParams.append('status', status ? '1' : '0');

        return this.http.get(url.href, this.jwt()).map((response: Response) => response.json());
    }

    saveBlog(values: Object) {
        return this.http.post(this.BACKEND_URL + '/brewery/blogs', JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    updateBlog(blogId: number, values: Object) {
        return this.http.put(this.BACKEND_URL + '/brewery/blogs/' + blogId, JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    updateBlogStatus(blogId: number, status: boolean) {
        return this.http.put(this.BACKEND_URL + '/brewery/blogs/' + blogId + '/status', JSON.stringify({ status: status }), this.jwt()).map((response: Response) => response.json());
    }

    deleteBlog(blogId: number) {
        return this.http.delete(this.BACKEND_URL + '/brewery/blogs/' + blogId, this.jwt()).map((response: Response) => response.json());
    }

    getBlog(blogId: number) {
        return this.http.get(this.BACKEND_URL + '/brewery/blogs/' + blogId, this.jwt()).map((response: Response) => response.json());
    }

    listBreweries(page: number, paginate: number) {
        let url = new URL(this.BACKEND_URL + '/admin/breweries');
        url.searchParams.append('page', page.toString());
        url.searchParams.append('paginate', paginate.toString());

        return this.http.get(url.href, this.jwt()).map((response: Response) => response.json());
    }

    updateProductStatus(productId: number, status: boolean) {
        return this.http.put(this.BACKEND_URL + '/brewery/products/' + productId + '/status', JSON.stringify({ status: status }), this.jwt()).map((response: Response) => response.json());
    }

    deleteBrewery(password: string) {
        return this.http.delete(this.BACKEND_URL + '/brewery', this.jwt({ password: password })).map((response: Response) => response.json());
    }

    deleteBreweryByAdmin(breweryId: number) {
        return this.http.delete(this.BACKEND_URL + '/admin/breweries/' + breweryId, this.jwt()).map((response: Response) => response.json());
    }

    addBrewery(values: Object) {
        return this.http.post(this.BACKEND_URL + '/users/brewery', JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }


    // ===================== Banner ==============================
    addBrewerySiteBanner(values: Object, bname: string) {
        return this.http.post(this.BACKEND_URL + '/create-banner/' + bname, JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }
    getBannerById(breweryId: number) {
        return this.http.get(this.BACKEND_URL + '/banner/' + breweryId, this.jwt()).map((response: Response) => response.json());
    }

    getBannerDetails(bannerId: number) {
        return this.http.get(this.BACKEND_URL + '/get_banner_by_id/' + bannerId, this.jwt()).map((response: Response) => response.json());
    }

    updateBanner(values: Object, bannerId: string) {
        return this.http.post(this.BACKEND_URL + '/update-banner/' + bannerId, JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    deleteOurBannerById(bId: number) {
        return this.http.get(this.BACKEND_URL + '/delete-banner/' + bId, this.jwt()).map((response: Response) => response.json());
    }
    // ========================= Team ==========================

    addOurTeam(values: Object, bname: string) {
        return this.http.post(this.BACKEND_URL + '/create-ourteam/' + bname, JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    getOurTeamList(bId: number, teamId: any) {
        return this.http.get(this.BACKEND_URL + '/ourteam/' + bId + '/' + teamId, this.jwt()).map((response: Response) => response.json());
    }

    getOurTeamDetailsById(tId: number) {
        return this.http.get(this.BACKEND_URL + '/get_ourteam_by_id/' + tId, this.jwt()).map((response: Response) => response.json());
    }

    deleteOurTeamById(tId: number) {
        return this.http.get(this.BACKEND_URL + '/delete_ourteam/' + tId, this.jwt()).map((response: Response) => response.json());
    }

    updateOurTeam(values: Object, teamId: string) {
        return this.http.post(this.BACKEND_URL + '/update_ourteam/' + teamId, JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    // ========================= Our Process ==========================

    addOurProcess(values: Object, bname: string) {
        return this.http.post(this.BACKEND_URL + '/create-ourprocess/' + bname, JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    updateOurProcess(values: Object, processId: string) {
        return this.http.post(this.BACKEND_URL + '/update_ourprocess/' + processId, JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    getOurProcessList(bId: number, processId: any) {
        return this.http.get(this.BACKEND_URL + '/ourprocess/' + bId + '/' + processId, this.jwt()).map((response: Response) => response.json());
    }

    deleteOurProcessById(bId: number) {
        return this.http.get(this.BACKEND_URL + '/delete-ourprocess/' + bId, this.jwt()).map((response: Response) => response.json());
    }

    // ========================= Our Story ==========================

    addOurStory(values: Object, bname: string) {
        return this.http.post(this.BACKEND_URL + '/create-ourstory/' + bname, JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    getOurStoryList(bId: number) {
        return this.http.get(this.BACKEND_URL + '/ourstory/' + bId, this.jwt()).map((response: Response) => response.json());
    }

    getOurStoryById(storyId: number) {
        return this.http.get(this.BACKEND_URL + '/get_ourstory_by_id/' + storyId, this.jwt()).map((response: Response) => response.json());
    }

    updateOurStory(values: Object, storyId: string) {
        return this.http.post(this.BACKEND_URL + '/update_ourstory/' + storyId, JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    deleteOurStoryById(oId: number) {
        return this.http.get(this.BACKEND_URL + '/delete_ourstory/' + oId, this.jwt()).map((response: Response) => response.json());
    }

    // ========================= Our testimonial ==========================

    addOurTestimonial(values: Object, bname: string) {
        return this.http.post(this.BACKEND_URL + '/create-testimonial/' + bname, JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    getOurTestimonialList(subdomainname: number) {
        return this.http.get(this.BACKEND_URL + '/testimonial-list/' + subdomainname, this.jwt()).map((response: Response) => response.json());
    }

    getOurTestimonialById(storyId: number) {
        return this.http.get(this.BACKEND_URL + '/single-testimonial/' + storyId, this.jwt()).map((response: Response) => response.json());
    }

    updateOurTestimonial(values: Object, storyId: string) {
        return this.http.post(this.BACKEND_URL + '/update-testimonial/' + storyId, JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    deleteOurTestimonialById(tId: number) {
        return this.http.get(this.BACKEND_URL + '/delete_testimonial/' + tId, this.jwt()).map((response: Response) => response.json());
    }
    // ========================= Subscriber ==========================

    sendSubscriber(values: Object, bId: number) {
        return this.http.post(this.BACKEND_URL + '/email-send/' + bId, JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    getSubscriberList(bId: number) {
        return this.http.get(this.BACKEND_URL + '/subscribe/' + + bId, this.jwt()).map((response: Response) => response.json());
    }

    updateSubscriber(sId: number) {
        return this.http.post(this.BACKEND_URL + '/update-subscribe/' + sId, this.jwt()).map((response: Response) => response.json());
    }
    // ===================== Contact Details ==========================

    getContactList(subdomainname: string) {
        return this.http.get(this.BACKEND_URL + '/contact-list/' + subdomainname, this.jwt()).map((response: Response) => response.json());
    }

    getContactPageDetails(subdomainname: string) {
        return this.http.get(this.BACKEND_URL + '/contact-cms/' + subdomainname, this.jwt()).map((response: Response) => response.json());
    }

    addContactPageDetails(values, bname: string) {
        return this.http.post(this.BACKEND_URL + '/create-contact-cms/' + bname, JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }


    updateContactPageDetails(values: Object, bname: string) {
        return this.http.post(this.BACKEND_URL + '/update-contact-cms/' + bname, JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }
    // ======================== About us cms ======================
    getAboutThirdSectionById(subdomainname: string, Id: string) {
        return this.http.get(this.BACKEND_URL + '/get-about-cms-data/' + subdomainname + '/' + Id, this.jwt()).map((response: Response) => response.json());
    }

    getAboutPageDetails(subdomainname: string, section: string) {
        return this.http.get(this.BACKEND_URL + '/about-cms/' + subdomainname + '/' + section, this.jwt()).map((response: Response) => response.json());
    }

    addAboutPageDetails(values, bname: string) {
        return this.http.post(this.BACKEND_URL + '/create-about-cms/' + bname, JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }


    updateAboutPageDetails(values: Object, bname: string) {
        return this.http.post(this.BACKEND_URL + '/update-about-cms/' + bname, JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    // ========================= Our Passion ==========================

    addOurPassion(values: Object, bname: string) {
        return this.http.post(this.BACKEND_URL + '/create-our-passion/' + bname, JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    getOurPassionDetails(subdomainname: string) {
        return this.http.get(this.BACKEND_URL + '/our-passion-list/' + subdomainname, this.jwt()).map((response: Response) => response.json());
    }

    updateOurPassionDetails(values: Object, id: number) {
        return this.http.post(this.BACKEND_URL + '/update-our-passion/' + id, JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }


    // ========================= what we learned ==========================

    addWhatWeLearned(values: Object, bname: string) {
        return this.http.post(this.BACKEND_URL + '/create-what-we-learned/' + bname, JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    getWhatWeLearnedDetails(subdomain: string) {
        return this.http.get(this.BACKEND_URL + '/what-we-learned-list/' + subdomain, this.jwt()).map((response: Response) => response.json());
    }

    getWhatWeLearnedDetailsById(subdomain: string, id: number) {
        return this.http.get(this.BACKEND_URL + '/what-we-learned-data/' + subdomain + '/' + id, this.jwt()).map((response: Response) => response.json());
    }

    updateWhatWeLearnedDetails(values: Object, id: number, subdomain: string) {
        return this.http.post(this.BACKEND_URL + '/update-what-we-learned/' + subdomain + '/' + id, JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    deleteWhatWeLearned(Id: number) {
        return this.http.get(this.BACKEND_URL + '/delete-what-we-learned/' + Id, this.jwt()).map((response: Response) => response.json());
    }

    // ========================= Home Third Section ==========================

    addHomeThirdSection(values: Object, subdomain: string) {
        return this.http.post(this.BACKEND_URL + '/add-home-cms/' + subdomain, JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    getHomeThirdSectionBySubdomain(subdomain: string) {
        return this.http.get(this.BACKEND_URL + '/home-cms-list/' + subdomain, this.jwt()).map((response: Response) => response.json());
    }

    getHomeThirdSectionById(Id: number) {
        return this.http.get(this.BACKEND_URL + '/get-home-cms-by-id/' + Id, this.jwt()).map((response: Response) => response.json());
    }

    updateHomeThirdSection (values: Object, Id: number) {
        return this.http.post(this.BACKEND_URL + '/update-home-cms/' + Id, JSON.stringify(values), this.jwt()).map((response: Response) => response.json());
    }

    deleteHomeThirdSectionById(Id: number) {
        return this.http.get(this.BACKEND_URL + '/delete-home-cms/' + Id, this.jwt()).map((response: Response) => response.json());
    }
    // ======================= Generate Review Token ==========================
    generateReviewToken(subdomain: string) {
        return this.http.get(this.BACKEND_URL + '/review-token/' + subdomain, this.jwt()).map((response: Response) => response.json());
    }
    
    requestReviewToAdmin (values) {
        //console.log(values.get('brewery_id'))
        return this.http.post(this.BACKEND_URL + '/insert-notification',JSON.stringify(values) , this.jwt()).map((response: Response) => response.json());
    }

    getNotificationList(id: number) {
        return this.http.get(this.BACKEND_URL + '/notification-list/' + id, this.jwt()).map((response: Response) => response.json());
    }

    updateWebsiteType(values) {
        return this.http.post(this.BACKEND_URL + '/update-website-type',JSON.stringify(values) , this.jwt()).map((response: Response) => response.json());
    }

    updateNotificationType(values) {
        return this.http.post(this.BACKEND_URL + '/update-notification-type',JSON.stringify(values) , this.jwt()).map((response: Response) => response.json());
    }

    getLoginUser() {
        return this.http.get(this.BACKEND_URL + '/users', this.jwt()).map((response: Response) => response.json());
    }

    // =========================================================

    private jwt(body: Object = null): RequestOptions {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let headers = new Headers({ 'Authorization': currentUser.token_type + ' ' + currentUser.access_token, 'Content-Type': 'application/json' });
        return new RequestOptions({ headers: headers, body: body });
    }
    
}
