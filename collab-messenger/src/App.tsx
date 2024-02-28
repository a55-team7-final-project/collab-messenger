import './App.css'
import { FC, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase-setup';
import { getUserData } from './services/user-services';
import Register from './Views/Register/Register';
import { User } from './types/types';
import { User as FirebaseUser } from 'firebase/auth';
import { AppContext } from './content/AppContext';
import Loading from './Views/Loading/Loading';
import Login from './Views/Login/Login';

interface AppContextInterface {
  user: FirebaseUser | null;
  userData: User | null;
  setContext?: React.Dispatch<React.SetStateAction<AppContextInterface>>;
}

const App: FC = () => {
  const [appContext, setContext] = useState<AppContextInterface>({
    user: null,
    userData: null,
  });

  const [user, loading] = useAuthState(auth);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUserData(user.uid)
        .then((userData) => {
          if (userData) {
            setContext({
              user,
              userData,
            });
          }
          setShowLoading(false);
        });
    } else {
      setShowLoading(false);
    }
  }, [user]);


  if ((loading && !appContext.userData && !appContext.user) || showLoading) {
    return <Loading />;
  }

  return (
    <AppContext.Provider value={{ ...appContext, setContext }}>
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Login />} />
            </Routes>
        </BrowserRouter>
    </AppContext.Provider>
);

};

export default App
