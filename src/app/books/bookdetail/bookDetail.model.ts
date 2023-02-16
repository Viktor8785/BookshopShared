export class BookDetail {
    constructor(
        public places: string[] | null,
        public subjects: string[] | null,
        public people: string[] | null,
        public times: string[] | null,
        public description: {type: string, value: string} | null,
        public sentence: {type: string, value: string} | null
    ){};
}
