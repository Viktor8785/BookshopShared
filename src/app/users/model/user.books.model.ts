import { Timestamp } from "firebase/firestore";
export class UserBooksModel {
    constructor(
        public bookId: string,
        public userId: string,
        public title: string,
        public authorName: string,
        public coverId: string,
        public key: string,
        public viewed: boolean,
        public reserved: boolean,
        public allowed: boolean,
        public ordered: boolean,
        public orderDate: Timestamp | null,
        public received: boolean,
        public receiveDate: Timestamp | null,
        public returned: boolean,
        public returneDate: Timestamp | null
    ) {}
}
