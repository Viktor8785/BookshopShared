export class EventData {
    constructor(
        public name: string,
        public body?: string,
        public imgsrc?: string,
        public title?: string,
        public author?: string,
        public key?: string,
        public selectedPage?: number,
        public totalPages?: number,
        public offset?: number
    ){};
}
