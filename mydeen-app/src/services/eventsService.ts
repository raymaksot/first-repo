import { apiDelete, apiGet, apiPost } from './api';

export interface EventItem { _id: string; title: string; startsAt: string; endsAt?: string; location?: string; description?: string; registrationsCount?: number }

export const eventsService = {
  list(): Promise<EventItem[]> { return apiGet('/api/events'); },
  get(id: string): Promise<EventItem> { return apiGet(`/api/events/${id}`); },
  create(input: Partial<EventItem>): Promise<EventItem> { return apiPost('/api/events', input); },
  register(id: string): Promise<{ registered: boolean; registrationsCount: number }> { return apiPost(`/api/events/${id}/register`); },
  cancel(id: string): Promise<{ registered: boolean; registrationsCount: number }> { return apiDelete(`/api/events/${id}/register`); },
};