# Copilot Instructions for Jyushin Care App

## Overview
The Jyushin Care App (重心ケアアプリ) is a specialized React TypeScript application for managing care of individuals with severe physical and intellectual disabilities at Jyushin multi-functional facilities. It serves both life care (生活介護) and after-school day services (重心型放課後等デイサービス).

## Architecture
### Core Structure
- **Pages** (`src/pages/`): Main application screens, with `StructuredDailyLogPage.tsx` being the central care logging interface
- **Contexts** (`src/contexts/`): Global state management via React Context API
  - `DataContext.tsx`: Manages 24 users (14 life care + 10 day service) with complete medical profiles
  - `AuthContext.tsx`: User authentication and permissions
  - `NotificationContext.tsx`: Real-time alerts and emergency notifications
- **Services** (`services/`): 40+ specialized service modules (both .js and .ts versions exist)
- **Types** (`src/types.ts`): 900+ lines of comprehensive TypeScript definitions for care domain

### Key Domain Entities
```typescript
// Core care event types from types.ts
SeizureEvent, ExpressionEvent, HydrationEvent, ActivityEvent, 
TubeFeedingEvent, PositioningEvent, ExcretionEvent, SkinOralCareForm
```

## Development Workflows
### Build & Development
- **Primary**: `npm run dev` (port 3003, error logging minimized)
- **Silent mode**: `npm run dev:ultra-silent` (zero console output)
- **Testing**: `vitest` with basic reporter, critical tests in `tests/` directory
- **Error suppression**: Extensive VS Code settings optimized to eliminate WebSocket/extension errors

### Project Philosophy (src/PROJECT_SOUL.md)
This project follows a specific philosophy: **"AI handles data/analysis (left brain) so humans can focus on compassionate care (right brain)"**. All features must reduce cognitive load for caregivers.

## Project-Specific Conventions
### Data Management Pattern
```tsx
// Standard data context usage pattern
const { users, getUserById } = useData();
const user = getUserById(userId);
```

### Event Logging Pattern
```tsx
// Care event structure (StructuredDailyLogPage.tsx)
const handleSaveEvent = async (eventData: any) => {
  const newEvent = {
    id: Date.now().toString(),
    user_id: user.id,
    event_type: activeEventType,
    created_at: new Date().toISOString(),
    ...eventData
  };
  // Save to localStorage with today's count updates
};
```

### Service Architecture
- Dual .js/.ts files exist for many services (migration in progress)
- Services follow naming: `[Domain]Service.ts` (e.g., `MedicationManagementService.ts`)
- AI services: `AIPredictionService.ts`, `AIAnomalyDetectionService.ts`

### Development Environment
- **Port**: Always 3003 (configured in vite.config.ts)
- **HMR disabled**: Performance optimized for care facility environment
- **Error suppression**: Extensive system to minimize console noise for focus
- **Offline-first**: LocalStorage-based data persistence

## Critical Integration Points
### Care Event Types (15 types)
From `StructuredDailyLogPage.tsx`:
```typescript
// Primary care logging events
'seizure', 'expression', 'hydration', 'positioning', 'activity', 
'excretion', 'skin_oral_care', 'illness', 'sleep', 'cough_choke', 
'tube_feeding', 'medication', 'vitals', 'behavioral', 'communication'
```

### User Profile Structure
24 real user profiles in `DataContext.tsx` with complete medical care arrays:
```typescript
medicalCare: [MedicalCare.TUBE_FEEDING, MedicalCare.SUCTION]
serviceType: [ServiceType.LIFE_CARE | ServiceType.DAY_SERVICE]
```

### Form Component Pattern
Specialized form components in `src/components/forms/`:
```tsx
<SeizureForm onSave={handleSaveEvent} />
<ExpressionForm onSave={handleSaveEvent} />
// Each form handles specific care event validation and submission
```

## AI-Specific Development Guidelines

### Medical Care Specialization
```typescript
// Always check medical care requirements
const hasSeizureHistory = user.medicalCare.includes(MedicalCare.SEIZURE_MEDICATION);
const requiresSuctioning = user.medicalCare.includes(MedicalCare.SUCTION);
const needsTubeFeeding = user.medicalCare.includes(MedicalCare.TUBE_FEEDING);
```

### Cognitive Load Reduction Patterns
```typescript
// Use large, clear UI components
const EmergencyButton = ({ onClick }: { onClick: () => void }) => (
  <button 
    className="bg-red-500 text-white text-2xl p-6 rounded-lg min-h-[80px] min-w-[200px]"
    onClick={onClick}
    aria-label="緊急時対応ボタン"
  >
    🚨 緊急対応
  </button>
);
```

### AI Integration Patterns
```typescript
// Seizure prediction
const seizureRisk = await AIPredictionService.predictSeizureRisk(user, recentLogs);
if (seizureRisk.riskLevel === 'high') {
  addNotification({
    type: 'warning',
    message: '発作リスクが高まっています',
    urgency: 'high'
  });
}
```

## Testing Strategy
- **Unit tests**: Service layer testing with Vitest
- **Critical path tests**: User management, daily logging, staff functionality
- **Integration tests**: `tests/integration.test.ts`
- **Silent mode**: Tests run with `--reporter=basic` to minimize output

## Essential Resources
- **AI Coding Patterns**: `.github/ai-coding-patterns.md` - Specialized patterns for care domain
- **Development Guide**: `.github/ai-development-guide.md` - Comprehensive development guidelines
- **Project Philosophy**: `PROJECT_SOUL.md` - Core values and principles

## Critical Requirements
1. **Respect for Human Dignity**: Every feature must prioritize user dignity and quality of life
2. **Caregiver Support**: Reduce cognitive load, not increase it
3. **Medical Safety**: Always validate medical data and provide appropriate alerts
4. **Family Communication**: Enable clear, compassionate communication with families
5. **Legal Compliance**: Adhere to disability support legislation (障害者総合支援法)

## Notes
- All features must align with reducing caregiver cognitive load
- Real user data (anonymized) drives development decisions
- Error suppression is intentional for focus in care environment
- Dual language support (Japanese primary, English technical terms)
- This is a socially critical system - prioritize human welfare over technical perfection
