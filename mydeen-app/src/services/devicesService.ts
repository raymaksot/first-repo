import { apiPost } from './api';

export const devicesService = {
  async register(token: string, platform?: string): Promise<void> {
    await apiPost('/api/devices/register', { token, platform });
  },
};