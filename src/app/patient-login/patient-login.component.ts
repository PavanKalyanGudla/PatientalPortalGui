import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataSharingServceService } from '../service/data-sharing-servce.service';
import { Patient } from '../model/patient';
import { PatientAddress } from '../model/patient-address';
import { PatientInsuranceInfo } from '../model/patient-insurance-info';
import { HttpServiceService } from '../service/http-service.service';
import { Router } from '@angular/router';
import { Doctor } from '../model/doctor';
import { Cart } from '../model/cart';
import { CartOrders } from '../model/cart-orders';

@Component({
  selector: 'app-patient-login',
  templateUrl: './patient-login.component.html',
  styleUrls: ['./patient-login.component.css']
})
export class PatientLoginComponent implements OnInit{

  today: Date = new Date();
  activeFlag : String = "one";
  profileFlag : boolean = false;
  patientObject : Patient = new Patient();
  patientAddressObject : PatientAddress = new PatientAddress();
  patientInsuranceObject : PatientInsuranceInfo = new PatientInsuranceInfo();
  selectedFile: File | null = null;
  profilePicSrc: string | ArrayBuffer | undefined;
  doctorList : Doctor[] = [];
  // doctorListItems : Doctor[] = [];
  doctorListTemp : Doctor[] = [];
  cartCount : number = 0;
  cart: { [key: string]: number } = {};
  cost = 0;
  totalCost = 0;
  cartObj : Cart = new Cart();
  totalPrice : number = 0;
  orders : CartOrders[] = [];
  activeClass : String = "active";
  checkoutFlag : boolean = false;
  pharmacyItems = [
    {
      id: "Claritin",
      price: 45,
    },
    {
      id: "Zyrtec",
      price: 100,
    },
    {
      id: "Sinus",
      price: 45,
    },
    {
      id: "Tylenol",
      price: 100,
    },
    {
      id: "Antibiotic",
      price: 45,
    },
    {
      id: "Advil",
      price: 100,
    },
    {
      id: "Zantac",
      price: 45,
    },
    {
      id: "Aspirin",
      price: 100,
    },
  ];

  constructor(private _dataSharing : DataSharingServceService,
    private _httpService:HttpServiceService,
    private _router : Router,
    private cdr: ChangeDetectorRef){
  }
  
  ngOnInit(){
    let PatientString : string | null = localStorage.getItem("patientObjectData");
    if(PatientString !=null){
      try {
        this.patientObject = JSON.parse(PatientString);
        this.patientAddressObject = this.patientObject.address;
        this.patientInsuranceObject = this.patientObject.insuranceInfo;
        this.getProfilePic();
        this.getCart();
        this.getPatientOrders();
      } catch (e) {
        console.error('Error parsing user data from local storage:', e);
      }
    }
    this.showAllDoctors();
    this._dataSharing.getPatientObject().subscribe((data : Patient)=>{
      this.patientObject = data;
      this.patientAddressObject = data.address;
      this.patientInsuranceObject = data.insuranceInfo;
      this.getProfilePic();
    },(error) => {
      console.error('Error fetching patient data:', error);
    });

    const fileInput1 = document.getElementById('fileInput');
    if(fileInput1){
      fileInput1.addEventListener('change',()=>{
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
          if (window.confirm('Are you sure?, Do you want to change the profile pic.')) {
            this.selectedFile = fileInput.files[0];
            console.log('File selected:', fileInput.files[0].name);
            this.compressProfilePic();
          }
        } else {
          console.log('No file selected');
        }
      });
    }

    this._dataSharing.getCartList().subscribe((data : any) =>{
      this.cart = data;
      this.addToCart();
      this.getCount(this.cart);
    });
  
  }

  
  addToCart(){
    let cartItems : string[]=[];
    for(let i in this.cart){
      cartItems.push(i+" "+this.cart[i]);
    }
    const products : string = cartItems.map(it => it.includes(",") ? `"${it}"`:it).join(",");
    const cartObj = new Cart();
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    const formattedDate: string = this.today.toLocaleDateString('en-GB', options);
    cartObj.patientId = this.patientObject.patientId;
    cartObj.products = products;
    cartObj.added_at = formattedDate;
    this._httpService.addToCart(cartObj).subscribe((data) => {
      console.log(data);
    })

  }

  getCart(){
    this._httpService.getCart(this.patientObject.patientId).subscribe((data) => {
      this.cartObj = data;
      const prod = this.cartObj.products;
      this.cart = {};
      if(prod != undefined || prod != null || prod != ""){
        const cartArray: string[] = prod.split(",");
        for (const e of cartArray) {
          const cart1 = e.split(" ");
          const parsedValue: number = parseFloat(cart1[1]);
          this.cart[cart1[0]] = parsedValue;
        }
        this.getCount(this.cart);
      }
    })
  }

  getCount(data: any){
    this.cartCount = 0;
    for(let i in data){
      this.cartCount += (data[i])?data[i]:0;
    }
  }

  clearCart(){
    const cartObj = new Cart();
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    const formattedDate: string = this.today.toLocaleDateString('en-GB', options);
    cartObj.patientId = this.patientObject.patientId;
    cartObj.cart_id=this.cartObj.cart_id;
    cartObj.added_at = formattedDate;
    this._httpService.addToCart(cartObj).subscribe((data) => {
      console.log(data);
      if(data){
        this._dataSharing.setCartList(this.cart);
        this.getCart();
      }
    })
    this.cart = {};
    this.getCount(this.cart);
  }

  calculateCartCount(){
    this.cartCount = 0;
    for(let i in this.cart){
      this.cartCount += this.cart[i];
      this.cost = this.cart[i] * this.getPrice(i);
    }
  }

  getPrice(id:String) : any{
    for (let j of this.pharmacyItems) {
      if(j.id == id){
        return j.price;
      }
    }
  }
  
  getTotalPrice(){
    this.totalCost = 0;
    for(let i in this.cart){
      this.totalCost = this.totalCost + (this.cart[i] * this.getPrice(i));
    }
    return this.totalCost;
  }

  proceedToPayment(){
    if(Object.keys(this.cart).length == 0){
      alert("No Items in Cart.");
    }else{
      this.checkoutFlag = true;
    }
  }

  checkout(){
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      };
      const formattedDate: string = this.today.toLocaleDateString('en-GB', options);
      let cartItems : string[]=[];
      for(let i in this.cart){
        cartItems.push(i+" "+this.cart[i]);
      }
      const products : string = cartItems.map(it => it.includes(",") ? `"${it}"`:it).join(",");
      let order : CartOrders = new CartOrders();
      order.patientId = this.patientObject.patientId;
      order.total_amount = this.getTotalPrice();
      order.order_status = "Placed";
      order.created_at = formattedDate;
      order.products = products;
      order.cart = this.cartObj;
      this._httpService.placeOrders(order).subscribe((data) => {
        alert(data);
        this.checkoutFlag = false;
        this.getCart();
        this.cart = {};
        this.getCount(this.cart);
      })
  }

  openMenuTab(flag:String){
    this.activeFlag = flag;
    this.activeClass = "";
  }

  SubmitProfilePic(file:File) {
    console.log(file.size);
    if (!file) {
      alert('No file selected.');
      return;
    }
    this._httpService.uploadProfile(this.patientObject.patientId,this.patientAddressObject.password,file).subscribe((data:any)=>{
      alert(data);
      if(data){
        this.getProfilePic();
      }else{
      }
    });
  }
  
  getProfilePic(){
    this._httpService.getProfilePic(this.patientObject.patientId,this.patientAddressObject.password).subscribe((data : any)=>{
      const reader = new FileReader();
      this.profilePicSrc = "";
      reader.onload = () => {
        this.profilePicSrc = reader.result ?? '';
        if(this.profilePicSrc === "data:application/octet-stream;base64,"){
          this.profileFlag = false;
        }else{
          this.profileFlag = true;
        }
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(new Blob([data]));
    })
  }
  
  compressProfilePic() {
    if (this.selectedFile) {
      console.log('Original file size:', this.selectedFile.size, 'bytes');
      const reader = new FileReader();
      reader.onload = (event) => {
        const target = event?.target;
        if (!target) {
          console.error('Event target is null or undefined.');
          return;
        }
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            console.error('Unable to get canvas context.');
            return;
          }
          const maxWidth = 800;
          const maxHeight = 600;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (!blob) {
              console.error('Error creating blob.');
              return;
            }
            const compressedFile = new File([blob], 'compressed_image.jpg', { type: 'image/jpeg' });
            this.selectedFile=compressedFile;
            const compressedSize = this.selectedFile.size;
            this.SubmitProfilePic(compressedFile);
            console.log('Compressed file size:', compressedSize, 'bytes');
            }, 'image/jpeg', 0.3);
        };
        img.src = target.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  showAllDoctors(){
    this._httpService.getAllDoctors().subscribe((data)=>{
      this.doctorList = data;
      this.doctorListTemp = data;
      this._dataSharing.sendDoctorListData(this.doctorList);
    })
  }

  logout(){
    localStorage.removeItem("patientObjectData");
    this._router.navigate(["/"]);
  }

  keyUp(e:any){
    let search = e.target.value;
    if(!search){
      this.doctorList = this.doctorListTemp;
    }
    this.doctorList = this.doctorListTemp.filter(it => {
      return Object.values(it).some(field => {
        return field && field.toString().toLowerCase().includes(search.toLowerCase());
      });
    });
  }

  getPatientOrders(){
    this._httpService.getPatientOrders(this.patientObject.patientId).subscribe((data)=>{
      this.orders = data;
    })
  }

}
