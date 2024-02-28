import { createContext, Dispatch, SetStateAction } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '../types/types';

interface AppContextInterface {
    user: FirebaseUser | null;
    userData: User | null;
    setContext?: Dispatch<SetStateAction<AppContextInterface>>;
  }
  
  export const AppContext = createContext<AppContextInterface>({
    user: null,
    userData: null,
    setContext: () => {},
  });
