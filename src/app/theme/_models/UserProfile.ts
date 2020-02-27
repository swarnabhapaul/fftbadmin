export class UserProfile {
    id: number;
    email: string;
    role: string;
    profile: {
        firstName: string,
        lastName: string,
        phone: number,
        address: {
            premisis: string,
            postCode: string,
            city: string
        },
        phone_verified: boolean,
        email_verified: boolean,
        brainTreeStatus: string,
        avatar: string,
        name: string,
        card: {
            expirationMonth: number,
            expirationYear: number,
            last4: number,
            cardType: string,
            imageUrl: string,
            expirationDate: string,
            maskedNumber: string
        }
    };
    brewery: {
        address: {
            premisis: string,
            postCode: string,
            city: string
        },
        id: number,
        lat: string,
        long: string,
        logo: string,
        name: string,
        subdomain: string
    };
    manager: {
        admin: boolean
    };
    address: [{
        type: string,
        premisis: string,
        postCode: string,
        city: string
    }]
}