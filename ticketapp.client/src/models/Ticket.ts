import {User} from "./User.ts";
import {Message} from "./Message.ts";

export enum TicketStatus
{
    Open = 0,
    Closed = 1,
    None = 2
}

export enum TicketPriority
{
    Low = 0,
    Medium = 1,
    High = 2,
    None = 3
}

export interface Ticket {
    id: string,
    subject: string,
    status: TicketStatus,
    priority: TicketPriority,
    createdAt: string,
    owner?: User,
    assignee: User | null,
    messages: Message[]
}
