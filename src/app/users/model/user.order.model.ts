import { Timestamp } from "firebase/firestore";

export class UserOrderModel {
    constructor(
        public orderId: string,
        public userId: string,
        public userName: string,
        public userEmail: string,
        public userZipCode: string,
        public userCountry: string,
        public userCity: string,
        public userAddress: string,
        public sentEmail: boolean,
        public sentEmailDate: Timestamp | null,
        public orderDate: Timestamp | null,
        public received: boolean,
        public receiveDate: Timestamp | null,
        public returned: boolean,
        public returneDate: Timestamp | null
    ) {}
}
