import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators'

import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';


@Component({
  selector: 'app-category',
  template: `<app-products [productId]="productId" [products]="products" (loadMore)="onLoadMore()"></app-products>`,
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  limit=10
  offset=0
  products: Product[] =[]
  categoryId: string | null = null
  productId: string | null = null

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          this.categoryId = params.get('id')
          if(this.categoryId){
            return this.productsService.getByCategory(this.categoryId, this.limit, this.offset)
          }
          return []
        })
      )
      .subscribe(data =>{
          this.products = data
      })

      this.route.queryParamMap.subscribe(params => {
        this.productId = params.get('product')
    })
  }

  onLoadMore(){
    if(this.categoryId){
      this.productsService.getByCategory(this.categoryId, this.limit,this.offset)
        .subscribe(data => {
          this.products = this.products.concat(data)
          this.offset += this.limit
        })
      }
  }

}
