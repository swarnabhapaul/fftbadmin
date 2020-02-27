import { Component, OnInit, ViewEncapsulation, AfterViewInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { BreweryService } from "../../../../../../services/brewery.service"
import { FormsModule, NgForm } from '@angular/forms';

@Component({
    selector: "add-address",
    templateUrl: "./add-address.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AddAddressComponent implements OnInit {

    addressType: Array<any>
    constructor(private beweryservice: BreweryService) {

    }

    ngOnInit() {
        this.addressType = [
            {
                id: 1,
                name: "Shipping"
            },
            {
                id: 2,
                name: "Billing"
            },
            {
                id: 3,
                name: "Both"
            }
        ]
    }

    submitAddress(f: NgForm) {
        console.log(f.value)

        let data = {}
        if (f.value.addressTypeof == 3) {

            data = {
                ...f.value,
                "user_id": JSON.parse(localStorage.getItem("userDetail")).id,
                "type": "billing",
            }


            for (let i = 0; i < 2; i++) {

                if (i == 1) {
                    data = {
                        ...data,
                        "type": "shipping"
                    }
                }
                console.log(data)
                this.beweryservice.addAddress(data).subscribe(data => {
                    console.log(data)
                },
                    error => {

                        console.log(error)
                    })
            }
        }
        else {
            if (f.value.addressTypeof == 2) {
                data = {
                    ...f.value,
                    "user_id": JSON.parse(localStorage.getItem("userDetail")).id,
                    "type": "billing",
                }
            }
            else {
                data = {
                    ...f.value,
                    "user_id": JSON.parse(localStorage.getItem("userDetail")).id,
                    "type": "shipping",
                }
            }

            console.log(data)
            this.beweryservice.addAddress(data).subscribe(data => {
                console.log(data)
            },
                error => {

                    console.log(error)
                })
        }



    }
}