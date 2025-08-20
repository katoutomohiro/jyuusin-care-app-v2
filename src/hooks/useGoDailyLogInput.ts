import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

export function useGoDailyLogInput() {
  const nav = useNavigate();
  const data = useData() as any;
  return (userId: string) => {
    if (data && typeof data.setSelectedUserId === 'function') {
      data.setSelectedUserId(userId);
    } else {
      try {
        localStorage.setItem('selectedUserId', userId);
      } catch (e) {
        // ignore
      }
    }
    nav('/daily-log/input');
  };
}
