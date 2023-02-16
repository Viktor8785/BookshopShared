export interface Params {
    ['q']: string,
    ['fields']: string,
    ['offset']: number,
    ['limit']: number
}

export class Params implements Params{
   
    constructor(
        public q: string,
        public fields: string,
        public offset: number,
        public limit: number
    ){};
}
