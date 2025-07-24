import { describe, it, expect } from 'vitest';
import { SeizureEventService } from '../services/SeizureEventService';
describe('SeizureEventService', () => {
  it('should save and get logs', () => {
    SeizureEventService.saveLog({ user_id: 'u1', event_timestamp: '2025-07-25T08:00', seizure_type: 'tonic', duration: '30s', notes: 'test' });
    const logs = SeizureEventService.getLogs('u1');
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].seizure_type).toBe('tonic');
  });
  it('should return riskLevel from getSeizureRisk', async () => {
    const risk = await SeizureEventService.getSeizureRisk({}, []);
    expect(risk.riskLevel).toBeDefined();
  });
});
