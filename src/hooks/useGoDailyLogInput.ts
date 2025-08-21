import { useNavigate } from "react-router-dom";
import { useData } from "../contexts/DataContext";

export function useGoDailyLogInput() {
  const nav = useNavigate();
  const { setSelectedUserId } = useData();
  return (userId: string) => {
    setSelectedUserId(userId);
    nav("/daily-log/input");
  };
}
