/* dev stub */
import * as React from "react";
export function useLocalStorage<T>(key: string, initialValue: T): [T, (v: T) => void] {
  return [initialValue, () => {}];
}
export const LocalStorageService = {
  get: (key: string) => null,
  set: (key: string, value: any) => {},
  remove: (key: string) => {},
  getAll: () => ([]),
};
