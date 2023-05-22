import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FilesService } from 'src/app/services/files.service';
import { UserService } from 'src/app/services/user.service';
import { TokenService } from 'src/app/services/token.service';




@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  token:string=''
  imgRta=''

  constructor(
    private authService:AuthService,
    private userService:UserService,
    private filesServices: FilesService,
    private tokenService: TokenService,
  ){}

  ngOnInit(): void {
    const token = this.tokenService.getToken()

    if(token){
      this.authService.getProfile()
          .subscribe()
    }
  }

  createUser(){
    this.userService.create({
      name:'Sebas',
      email: 'sebastian@gmail.com',
      password:'123',
      role:'customer',
    })
    .subscribe( rta =>{})
  }



  downloadPdf() {
    this.filesServices.getFile('my.pdf', 'https://young-sands-07814.herokuapp.com/api/files/dummy.pdf', 'application/pdf')
    .subscribe()
  }

  onLoaded(envet:string){

  }

  onUpload(event: Event){
    const element = event.target as HTMLInputElement
    const file = element.files?.item(0)

    if(file){
      this.filesServices.uploadFile(file)
      .subscribe(rta => {
        this.imgRta = rta.location
      })
    }

  }
}
