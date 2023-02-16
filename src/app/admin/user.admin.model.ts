export class UserAdminModel {
    
    constructor(
        public userId: string,
        public userName: string,
        public userEmail: string,
        public userEmailWait: boolean | null,
        public userReceiveWait: boolean | null,
        public userReturneWait: boolean | null,
        public userBlocked?: boolean
    ) {}
}
