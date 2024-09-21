import {User} from "./User.ts";

export interface Message
{
    id: string,
    owner?: User, 
    createdAt: string,
    body: string
}