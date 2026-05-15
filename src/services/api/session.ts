import { TOKEN_KEYS } from '../../constants';
import { secureStorage } from '../storage';

export async function hasAccessToken(): Promise<boolean> {
  const token = await secureStorage.getToken(TOKEN_KEYS.ACCESS);
  return Boolean(token);
}
