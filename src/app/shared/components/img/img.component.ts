import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.scss']
})
export class ImgComponent implements OnInit , OnChanges, AfterViewInit, OnDestroy{

  img!:string

  @Input('img')
  set changeImg(newImg: string){
    this.img = newImg
    //ejecutar codigo solo cuando cambio la imagen

  }

  @Output() loaded = new EventEmitter<string>()
  imgDefault="./assets/default.jpg"

  //before render: no correr cosas asincronas, se corre solo una vez
  constructor() { }

  //before and during render: actualizar los cambios en los inputs, corre muchas veces (cada vez que actualicemos los inputs)
  ngOnChanges(changes: SimpleChanges): void {

  }

  //before render: si podemos correr cosas async - fetch - promise -- corre una sola vez
  ngOnInit(): void {
  }

  //After render:, handler children, manejar hijos, trigger
  ngAfterViewInit(): void {

  }

  //cuando se elimina el componente, deja de existir en la interfaz
  ngOnDestroy(): void {

  }

  imgError(){
    this.img =this.imgDefault
  }

  imgLoaded(){
    this.loaded.emit(this.img)
  }

}
