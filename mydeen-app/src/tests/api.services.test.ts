import { commentsService } from '@/services/commentsService';

describe('Service shapes', () => {
  it('comments service has required methods', () => {
    expect(typeof commentsService.list).toBe('function');
    expect(typeof commentsService.create).toBe('function');
  });
});