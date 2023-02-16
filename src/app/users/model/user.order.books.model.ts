export class UserOrderBooksModel {
    
    constructor(
        public orderId: string,
        public bookId: string,
        public userId: string,
        public title: string,
        public authorName: string,
    ) {}
}
