import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IUser } from 'app/types/IUser';
import { ROUTES } from 'app/utils/static';
import { storageManager } from 'app/utils/StorageManager';

const userKey = 'authUser';

const useUser = () => {
  const [user, setUser] = useState<IUser | null>(storageManager.get(userKey));

  const navigate = useNavigate();

  const login = (user: IUser) => {
    setUser(user);
    storageManager.set(userKey, user);
    navigate(ROUTES.MOVIES);
  };

  const logout = () => {
    setUser(null);
    storageManager.clear(userKey);
    navigate(ROUTES.LOGIN);
  };

  const refresh = (user: IUser) => {
    setUser(user);
    storageManager.set(userKey, user);
  };

  return {
    user,
    login,
    logout,
    setUser,
    refresh,
  };
};

export default useUser;
