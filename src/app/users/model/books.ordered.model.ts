import { Timestamp } from "firebase/firestore";

export class BooksOrderedModel {
    constructor(
        public orderId: string,
        public bookId: string,
        public userId: string,
        public userLogin: string,
        public title: string,
        public authorName: string,
        public ordered: boolean,
        public orderDate: Timestamp | null,
        public received: boolean,
        public receiveDate: Timestamp | null,
        public returned: boolean,
        public returneDate: Timestamp | null
    ) {}
}
