import { useNavigate } from "react-router-dom";
import { setSelectedUserId } from "../store/selection";

export function useGoDailyLogInput() {
  const nav = useNavigate();
  return (userId: string) => {
  console.debug('[tile->input]', userId);
    setSelectedUserId(userId);
    nav("/daily-log/input");
  };
}
