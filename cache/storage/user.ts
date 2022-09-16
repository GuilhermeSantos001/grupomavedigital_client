import { UserSchema } from "@/atom/user";

const DATA_KEY = 'user';

export default function useStorage() {
  const
    load = (): UserSchema | never => {
      const data = localStorage.getItem(DATA_KEY);
      return data ? JSON.parse(data) : null;
    },
    save = (data: UserSchema): void => {
      localStorage.setItem(DATA_KEY, JSON.stringify(data));
    },
    remove = (): void => {
      localStorage.removeItem(DATA_KEY);
    }

  return {
    load,
    save,
    remove,
  } as const
}
