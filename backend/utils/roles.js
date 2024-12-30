import { Participant, EventCoordinator, Admin } from '../models/Users.model.js';


export const roles = {
    participant: Participant,
    event_coordinator: EventCoordinator,
    admin: Admin,
};