import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { CreateProductDTO, Product, UpdateProductDTO } from 'src/app/models/product.model';
import { catchError, map, retry, switchMap } from 'rxjs/operators';
import {  environment } from '../../environments/environment'
import { throwError, zip } from 'rxjs';
import { checkTime } from '../interceptors/time.interceptor'


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = `${environment.API_URL}/api`

  constructor(private http:HttpClient) { }

  getByCategory(categoryId:string, limit?:number, offset?:number){

    console.log("apiUrl",this.apiUrl)
    let params = new HttpParams()
    if(limit && offset){
      params = params.set('limit', limit)
      params = params.set('offset', offset)
    }

    return this.http.get<Product[]>(`${this.apiUrl}/categories/${categoryId}/products`, {params})
  }

  getAllProducts(limit?:number, offset?:number){
    let params = new HttpParams()
    if(limit && offset){
      params = params.set('limit', limit)
      params = params.set('offset', offset)
    }
    return this.http.get<Product[]>(`${this.apiUrl}/products`, {params, context:checkTime()})
              .pipe(
                retry(3),
                map(products => products.map(item =>{
                  return {
                    ...item,
                    taxes: .19 * item.price
                  }
                }))
              );
  }

  getProduct(id: string){
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`)
            .pipe(
              switchMap((product) => this.update(product.id, {title:'change'})),
              switchMap((product) => this.update(product.id, {description:'change'})),
            )
              .pipe(
                  catchError((error: HttpErrorResponse) =>{
                    if(error.status===500){
                      return throwError('Algo esta fallando en el server')
                    }
                    if(error.status===404){
                      return throwError('El producto no existe')
                    }
                    return throwError('Ups algo salio mal')
                  })
              )
  }

  getProductsByPage(limit:number, offset:number){
    return this.http.get<Product[]>(`${this.apiUrl}/products`, {
      params: {limit, offset}
      })
      .pipe(
        retry(3),
        map(products => products.map(item =>{
          return {
            ...item,
            taxes: .19 * item.price
          }
        }))
      );;

  }

  getOne(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) {
          return throwError('Algo esta fallando en el server');
        }
        if (error.status === HttpStatusCode.NotFound) {
          return throwError('El producto no existe');
        }
        if (error.status === HttpStatusCode.Unauthorized) {
          return throwError('No estas permitido');
        }
        return throwError('Ups algo salio mal');
      })
    )
  }

  create(dto: CreateProductDTO){
    return this.http.post<Product>(`${this.apiUrl}/products`, dto)
  }

  update(id:string,dto:any){
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`,dto)
  }

  delete(id:string){
    return this.http.delete<boolean>(`${this.apiUrl}/products/${id}`)
  }

  fetchReadAndUpdate(id:string, dto: UpdateProductDTO){
    return  zip(
      this.getProduct(id),
      this.update(id, dto)
    )
  }

}
