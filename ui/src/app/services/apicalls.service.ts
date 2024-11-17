import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApicallsService {

  apiUrl = "http://localhost/testApi"

  url = "http://localhost/testApi/api.php";

  constructor(private http: HttpClient) { }


  getallproducts() {
    return this.http.get(this.apiUrl + "/getallproducts.php");
  }

  getallcategories() {
    return this.http.get(this.apiUrl + "/getallcategories.php");
  }

  addProduct(product : any) {
    return this.http.post(this.url, product);
  }

  updateProduct(product : any) {
    return this.http.put(this.url, product);
  }

  searchbyname(name: string) {
    return this.http.get(this.apiUrl + `/searchbyname.php?searchvalue=${name}`);
  }

  deleteproduct(id: any) {
    return this.http.delete(this.url + `?id=${id}`);
  }

  

}
