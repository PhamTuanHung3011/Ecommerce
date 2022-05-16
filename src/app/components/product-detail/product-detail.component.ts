import { Component, OnInit } from '@angular/core';
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../../services/product.service";
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  // @ts-ignore
  product: Product = new Product();

  constructor(private router: ActivatedRoute,
              private productService: ProductService,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.router.paramMap.subscribe( () =>{
      this.handleProductDetail()
    })

  }

  private handleProductDetail() {
    // @ts-ignore
    const theProductId: number = +this.router.snapshot.paramMap.get("id");

    this.productService.getProduct(theProductId).subscribe(
      data => {
        console.log(data)
        this.product = data;
      }
    )
  }

  addToCart(product: Product) {
    const theCartItem = new CartItem(product);
    this.cartService.addToCart(theCartItem);
  }
}
