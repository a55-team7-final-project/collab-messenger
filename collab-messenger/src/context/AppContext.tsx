import { createContext, Dispatch, SetStateAction } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { User, Channel, Meeting } from '../types/types';

interface AppContextInterface {
    user: FirebaseUser | null;
    userData: User | null;
    userLoading: boolean;
    channels: Channel[];
    meetings: Meeting[];
    setContext?: Dispatch<SetStateAction<AppContextInterface>>;
  }
  
  export const AppContext = createContext<AppContextInterface>({
    user: null,
    userData: null,
    userLoading: true,
    channels: [],
    meetings: [],
    setContext: () => {},
  });
