import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-new-test-component',
    template: `
    <p>
      new-test-component works!
    </p>
  `,
    styles: []
})
export class NewTestComponentComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

}
