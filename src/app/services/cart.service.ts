import { Injectable } from '@angular/core';
import {CartItem} from "../common/cart-item";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem) {
    let alreadyExistsInCart: boolean = false;
    // @ts-ignore
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      // @ts-ignore
      existingCartItem = this.cartItems.find(tempCart => tempCart.id === theCartItem.id);
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if (alreadyExistsInCart) {
      existingCartItem.quantity++;
    }
    else {
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();
  }

   computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;


    for(let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
      totalQuantityValue += currentCartItem.quantity
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);

  }

   logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log(`Contents of the cart`);

    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.unitPrice * tempCartItem.quantity;
      console.log(`name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity}, unitPrice: ${tempCartItem.unitPrice}, totalPrice: ${totalPriceValue}, totalQuantity: ${totalQuantityValue}, subTotalPrice: ${subTotalPrice}`);
    }

     console.log(`totalPrice: ${totalPriceValue.toFixed(2)}`);
   }
}
