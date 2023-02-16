import { Timestamp } from "firebase/firestore";
export class UserModel {
    
    constructor(
        public userId: string,
        public userLogin: string,
        public userNickname: string,
        public userName: string,
        public userEmail: string,
        public userBirthDate: Timestamp,
        public userZipCode: string,
        public userCountry: string,
        public userCity: string,
        public userAddress: string,
        public userBlocked?: boolean
    ) {}
}
