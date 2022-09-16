import * as React from "react";
import { atom, useRecoilState } from "recoil";
import { v1 } from 'uuid';

import useStorage from "@/cache/storage/user";

export interface UserSchema {
  id: string;
  username: string;
  roles: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export const userDataDefault: UserSchema = {
  id: '',
  username: '',
  roles: [],
  createdAt: '',
  updatedAt: '',
}

const User = atom<UserSchema>({
  key: `user-${Date.now}-${v1()}`,
  default: userDataDefault
});

export default function useUser() {
  const [isInitial, setIsInitial] = React.useState(true);
  const [isLoadedUser, setIsLoadedUser] = React.useState(false);
  const [user, setUser] = useRecoilState(User);

  const {
    load,
    save,
    remove,
  } = useStorage();

  React.useEffect(() => {
    const timeout = (() => setTimeout(() => {
      if (!isLoadedUser) {
        const data = load();

        if (data) {
          setUser(data);
        } else {
          setUser(userDataDefault);
        }
      }

      setIsInitial(false);
      setIsLoadedUser(true);
    }))();

    return () => clearTimeout(timeout);
  }, [isLoadedUser, load, setUser, user]);

  return {
    get: () => isInitial === true ? userDataDefault : user,
    set: (newUser: UserSchema) => {
      save(newUser);
      setUser(newUser);
    },
    update: (newUser: Partial<UserSchema>) => {
      const updated = { ...user, ...newUser };
      save(updated);
      setUser(updated);
    },
    remove: () => {
      remove();
      setUser(userDataDefault);
    }
  } as const;
}
