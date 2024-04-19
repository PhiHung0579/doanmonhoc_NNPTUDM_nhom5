import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.apiUrl;
  constructor(private htppClient: HttpClient) { }

  signup(data: any) {
    return this.htppClient.post(this.url +
      "/user/signup", data, {
      headers: new HttpHeaders().set('Contect-Type', "application/json")
    })
  }

  forgotPassword(data: any) {
    return this.htppClient.post(this.url +
      "/user/forgotPassword", data, {
      headers: new HttpHeaders().set('Contect-Type', "application/json")
    })
  }

  login(data: any) {
    return this.htppClient.post(this.url +
      "/user/login", data, {
      headers: new HttpHeaders().set('Contect-Type', "application/json")
    })
  }

checkToken(){
  return this.htppClient.get(this.url+"/user/checkToken");
  
}

}
