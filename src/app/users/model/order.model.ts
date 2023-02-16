import { Timestamp } from "firebase/firestore";

export class OrderModel {
    constructor(
        public orderId: string,
        public userId: string,
        public userLogin: string,
        public sentEmail: boolean,
        public sentEmailDate: Timestamp | null,
        public orderDate: Timestamp | null,
        public received: boolean,
        public receiveDate: Timestamp | null,
        public returned: boolean,
        public returneDate: Timestamp | null
    ) {}
}
