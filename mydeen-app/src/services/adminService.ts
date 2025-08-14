import { apiDelete, apiGet, apiPost } from './api';

export const adminService = {
  dashboard(): Promise<{ pendingComments: number; groups: number; events: number }> { return apiGet('/api/admin/dashboard'); },
  approveComment(id: string) { return apiPost(`/api/admin/comments/${id}/approve`); },
  deleteComment(id: string) { return apiDelete(`/api/admin/comments/${id}`); },
};