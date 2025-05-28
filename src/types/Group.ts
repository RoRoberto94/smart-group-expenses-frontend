import type { User } from './User';


export interface Group {
    id: number;
    name: string;
    owner: User;
    members: User[];
    created_at: string;
}
