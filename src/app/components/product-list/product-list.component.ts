import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {


  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  //new properties for pagination;
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: any = 25;

  // @ts-ignore
  previousKeyword: string = null;


  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe( () => {
      this.listProducts();
    } );
  }

  listProducts() {
  this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProduct();
    }
    else {
      this.handleListProducts()
    }
  }

  handleListProducts() {
    //check id is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      // @ts-ignore
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    }
    else {
      this.currentCategoryId = 1;
    }
    //
    //
    //

    if (this.previousCategoryId != this.currentCategoryId) {
        this.thePageNumber = 1;
    }
    this.previousCategoryId= this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`)

    this.productService.getProductListPaginate( this.thePageNumber -1,
                                                        this.thePageSize,
                                                        this.currentCategoryId)
                                                        .subscribe(this.processResult());
  }
   processResult() {
    // @ts-ignore
    return data => {
      this.products = data._embedded.products;
      console.log(data._embedded.products)
      this.thePageNumber = data.page.number + 1;
      console.log(data.page.number + 1)
      this.thePageSize = data.page.size;
      console.log(data.page.size)
      this.theTotalElements = data.page.totalElements;
      console.log("totalElement: "+data.page.totalElements)
    }
  }
   handleSearchProduct() {
    // @ts-ignore
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    if(this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;
     console.log(`keyword = ${theKeyword}, thePageNumber = ${this.thePageNumber}`);
     this.productService.searchProductListPaginate(this.thePageNumber - 1,
       this.thePageSize,
       theKeyword).subscribe(this.processResult());

    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
        console.log(this.products)
      }
    )

  }

  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }


  addToCart(theProduct: Product) {

    console.log(`adding to cart: ${theProduct.name}, ${theProduct.unit_price}`);

    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }
}
