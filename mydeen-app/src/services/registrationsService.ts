import { apiDelete, apiPost } from './api';

export const registrationsService = {
  registerToEvent(eventId: string) { return apiPost(`/api/events/${eventId}/register`); },
  cancelEventRegistration(eventId: string) { return apiDelete(`/api/events/${eventId}/register`); },
};