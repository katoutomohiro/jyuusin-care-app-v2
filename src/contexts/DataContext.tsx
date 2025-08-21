import React, { createContext, useContext, useMemo, useState } from "react";

export type User = { id: string; name: string };
export type DailyLog = any;

export type DataContextType = {
  users: User[];
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;

  dailyLogsByUser: Record<string, DailyLog[]>;
  addDailyLog: (userId: string, log: DailyLog) => void;

  getUserById: (id: string) => User | undefined;
  addUser: (u: User) => void;
  removeUser: (id: string) => void;
  updateUser: (u: User) => void;
};

const Ctx = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([
    { id: "u1", name: "田中太郎" },
    { id: "u2", name: "I・K" },
    { id: "u3", name: "S・M" },
    { id: "u4", name: "N・M" },
  ]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [dailyLogsByUser, setDailyLogsByUser] = useState<Record<string, DailyLog[]>>({});

  const addDailyLog = (uid: string, log: DailyLog) =>
    setDailyLogsByUser((prev) => ({ ...prev, [uid]: [...(prev[uid] ?? []), log] }));

  const getUserById = (id: string) => users.find((u) => u.id === id);
  const addUser = (u: User) => setUsers((prev) => [...prev, u]);
  const removeUser = (id: string) => setUsers((prev) => prev.filter((u) => u.id !== id));
  const updateUser = (u: User) => setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, ...u } : x)));

  const value = useMemo(
    () => ({
      users,
      selectedUserId,
      setSelectedUserId,
      dailyLogsByUser,
      addDailyLog,
      getUserById,
      addUser,
      removeUser,
      updateUser,
    }),
    [users, selectedUserId, dailyLogsByUser]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useData() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useData must be used within a DataProvider");
  return v;
}
