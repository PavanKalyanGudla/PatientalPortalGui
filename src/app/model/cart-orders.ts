import { Cart } from "./cart";

export class CartOrders {
    order_id !: number;
    patientId !:String;
    total_amount !: number;
    order_status !:String ;
    created_at !:String;
    products !: String;
    cart : Cart = new Cart;
}
