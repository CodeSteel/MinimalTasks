import {faker} from "@faker-js/faker";
import {Ticket, TicketPriority, TicketStatus} from "../models/Ticket.ts";
import {createFakeUser} from "./FakeUserUtils.ts";

export function createFakeTicket(): Ticket {
    return {
        id: faker.string.uuid(),
        subject: faker.word.words(3),
        description: faker.word.words(100),
        status: faker.helpers.enumValue(TicketStatus),
        priority: faker.helpers.enumValue(TicketPriority),
        createdAt: faker.date.recent().toDateString(),
        owner: createFakeUser(),
        assignee: createFakeUser()
    };
}