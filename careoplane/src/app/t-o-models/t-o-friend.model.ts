import { User } from '../models/user.model';

export class TOFriend{
    constructor(
        public id: number = 0,
        public friendA: User = null,
        public friendB: User = null,
        public status: string = null
    ){}
}