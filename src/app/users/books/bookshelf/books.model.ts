export class Books {
    constructor(
        public isbn: string | null,
        public title: string,
        public authorName: string,
        public coverId: string,
        public key: string
    ){};
}
