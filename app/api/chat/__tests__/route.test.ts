/**
 * @jest-environment node
 */
import { POST } from '../route';
import { globalRateLimiter } from '../../../../lib/rateLimiter';

jest.mock('../../../../lib/rateLimiter', () => ({
  globalRateLimiter: {
    canProceed: jest.fn(),
  },
}));

describe('POST /api/chat', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns 429 if rate limited', async () => {
    (globalRateLimiter.canProceed as jest.Mock).mockReturnValue(false);
    const req = new Request('http://localhost/api/chat', { method: 'POST' });
    const res = await POST(req);
    expect(res.status).toBe(429);
  });

  it('returns 400 for invalid body format', async () => {
    (globalRateLimiter.canProceed as jest.Mock).mockReturnValue(true);
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ notMessages: true }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns mock response if no API key is provided and user asks about restrooms', async () => {
    (globalRateLimiter.canProceed as jest.Mock).mockReturnValue(true);
    process.env.AI_PIPE_KEY = '';
    
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'where is the restroom?' }] }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toContain('Restrooms are located');
  });

  it('returns mock response if no API key is provided and user asks about parking', async () => {
    (globalRateLimiter.canProceed as jest.Mock).mockReturnValue(true);
    process.env.AI_PIPE_KEY = '';
    
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'parking availability' }] }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toContain('Stadium parking lots P1-P4');
  });
});
