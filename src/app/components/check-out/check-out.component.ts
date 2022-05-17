import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ShopFormService} from "../../services/shop-form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit {


  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonth: number[] = [];


  // @ts-ignore
  checkoutFormGroup: FormGroup;

  countries: Country[] = [];
  shippingAddressStates: State[] =[];
  billingAddressStates: State[] =[];


  constructor(private formBuilder: FormBuilder, private shopForm: ShopFormService ) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipcode: ['']
      }),
      billingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipcode: ['']
      }),
      creditCardAddress: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });
    const startMonth: number = new Date().getMonth() + 1;
    console.log(startMonth);
    this.shopForm.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log(JSON.stringify(data));
        this.creditCardMonth = data;
      }
    )

    this.shopForm.getCreditCardYear().subscribe(
      data => {
        console.log(JSON.stringify(data));
        this.creditCardYears = data;
      }
    );
    this.shopForm.getCountries().subscribe(
      data => {
        console.log("retrieved countries: "+ JSON.stringify(data));
        this.countries = data;
      }
    );

  }
onSubmit() {
  // @ts-ignore
  console.log(this.checkoutFormGroup.get('customer')?.value);
  console.log(this.checkoutFormGroup.get('customer')?.value.email);
  console.log(this.checkoutFormGroup.get('shippingAddress')?.value);
  console.log(this.checkoutFormGroup.get('creditCardAddress')?.value);
  }



  copyShippingAddressToNillingAddress($event: Event) {
    // @ts-ignore
    if ($event.target.checked) {
      // @ts-ignore
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);
      this.billingAddressStates = this.shippingAddressStates
    }
    else {
      // @ts-ignore
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYear() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCardAddress');
    const currentYear: number = new Date().getFullYear();
    const selectYear: number = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number;

    if (currentYear == selectYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }
    this.shopForm.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonth = data;
      }
    )
  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    this.shopForm.getStates(countryCode).subscribe(
      data => {
        if (formGroupName == 'shippingAddress') {
          this.shippingAddressStates =data;
        }
        else {
          this.billingAddressStates = data;
        }

        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }
}
