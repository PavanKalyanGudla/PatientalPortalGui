import { Component } from '@angular/core';
import { DataSharingServceService } from '../service/data-sharing-servce.service';
import { HttpClient } from '@angular/common/http';
import { HttpServiceService } from '../service/http-service.service';
import { Patient } from '../model/patient';
import { Cart } from '../model/cart';

@Component({
  selector: 'app-pharmacy',
  templateUrl: './pharmacy.component.html',
  styleUrls: ['./pharmacy.component.css']
})
export class PharmacyComponent {

  cart: { [key: string]: number } = {};
  patientObject : Patient = new Patient();
  
  constructor(private _dataSharing : DataSharingServceService,
    private _httpService : HttpServiceService){}
  
  ngOnInit(){
    let PatientString : string | null = localStorage.getItem("patientObjectData");
    if(PatientString !=null){
      try {
        this.patientObject = JSON.parse(PatientString);
        this.getCart();
      } catch (e) {
        console.error('Error parsing user data from local storage:', e);
      }
    }

  }

  decrement(id:any){
    if(id in this.cart){
      if(this.cart[id] > 0){
        this.cart[id] = this.cart[id]-1;
      }
    }
    this._dataSharing.setCartList(this.cart);
  }

  increment(id:any){
    if(id in this.cart){
      this.cart[id] = this.cart[id]+1;
    }else{
      this.cart[id] = 1;
    }
    this._dataSharing.setCartList(this.cart);
  }

  cartObj : Cart = new Cart();

  getCart(){
    this._httpService.getCart(this.patientObject.patientId).subscribe((data) => {
      this.cartObj = data;
      const prod = this.cartObj.products;
      if(prod != undefined || prod != null || prod != ""){
        const cartArray: string[] = prod.split(",");
        this.cart = {};
        for (const e of cartArray) {
          const cart1 = e.split(" ");
          const parsedValue: number = parseFloat(cart1[1]);
          this.cart[cart1[0]] = parsedValue;
        }
      }
    })
  }

  dispFlag : String = "ALL";
  flagList : String[] = ["ALL", "claritin", "zyrtec", "sinus", "tylenol", "antibiotic", "advil", "zantac", "aspirin"];
  flagListMain: String[] = ["ALL"];

  keyUp(e:any){
    let search = e.target.value;
    if(!search){
      this.flagListMain = [];
      this.flagListMain.push("ALL");
    }else{
      this.flagListMain = [];
      for (let i = 0; i < this.flagList.length; i++) {
        if (this.flagList[i].includes(search.toLowerCase())) {
            this.flagListMain.push(this.flagList[i]);
        }
      }
    }
  }

}
