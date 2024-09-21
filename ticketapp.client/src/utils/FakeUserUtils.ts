import {faker} from "@faker-js/faker";
import {User} from "../models/User.ts";

export function createFakeUser(): User {
    return {
        id: faker.string.uuid(),
        userName: faker.internet.userName(),
        email: faker.internet.email()
    };
}