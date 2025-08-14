import { apiDelete, apiGet, apiPost, apiPut } from './apiClient';

export type ParentType = 'article' | 'qaAnswer';

export interface CommentDto {
  _id: string;
  userId: string;
  parentType: ParentType;
  parentId: string;
  text: string;
  likesCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Paginated<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

export const commentsService = {
  async list(parentType: ParentType, parentId: string, page = 1, limit = 20): Promise<Paginated<CommentDto>> {
    return apiGet(`/api/comments`, { params: { parentType, parentId, page, limit } });
  },
  async create(input: { parentType: ParentType; parentId: string; text: string }): Promise<CommentDto> {
    return apiPost(`/api/comments`, input);
  },
  async update(id: string, text: string): Promise<CommentDto> {
    return apiPut(`/api/comments/${id}`, { text });
  },
  async remove(id: string): Promise<{ success: boolean }> {
    return apiDelete(`/api/comments/${id}`);
  },
  async like(id: string): Promise<{ liked: boolean; likesCount: number }> {
    return apiPost(`/api/comments/${id}/like`);
  },
  async unlike(id: string): Promise<{ liked: boolean; likesCount: number }> {
    return apiPost(`/api/comments/${id}/unlike`);
  },
  async toggleLike(parentType: 'article' | 'qaAnswer' | 'comment', parentId: string): Promise<{ liked: boolean; likesCount: number }> {
    return apiPost(`/api/likes/toggle`, { parentType, parentId });
  },
};