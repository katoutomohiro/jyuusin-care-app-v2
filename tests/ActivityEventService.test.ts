import { describe, it, expect } from 'vitest';
import { ActivityEventService } from '../services/ActivityEventService';
describe('ActivityEventService', () => {
  it('should save and get logs', () => {
    ActivityEventService.saveActivityEvent({ userId: 'u1', activity_start_time: '2025-07-25T08:00', activity_end_time: '2025-07-25T08:30', activity_type: 'rehabilitation', participation_level: 3, mood_during_activity: 'calm', assistance_level: 'partial', achievements: ['歩行'], notes: 'test', id: 'test1', created_by: 'tester', created_at: '2025-07-25T08:00' });
    const logs = ActivityEventService.getLogs('u1');
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].activity_type).toBe('リハビリ');
  });
  it('should return riskLevel from getActivityRisk', async () => {
    const risk = await ActivityEventService.predictActivityRisk({}, []);
    expect(risk.riskLevel).toBeDefined();
  });
});
