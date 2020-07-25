export class Admin {
    constructor(
        public username: string,
        public email: string,
        public password: string,
        public type: string,
        public company: any = ''
    ) {}
}