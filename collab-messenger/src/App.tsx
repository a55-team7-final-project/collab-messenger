import './App.css'
import { FC, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase-setup';
import { getUserData, getUserByHandle } from './services/user-services';
import Register from './Views/Register/Register';
import Home from './Views/Home/Home';
import Sidebar from './components/SideBar/Sidebar';
// import Footer from './components/Footer/Footer';
import { User } from './types/types';
import { User as FirebaseUser } from 'firebase/auth';
import { AppContext } from './context/AppContext';
import Loading from './Views/Loading/Loading';
import Login from './Views/Login/Login';
import GroupDetailed from './components/Group Components/GroupDetailed/GroupDetailed';
import UserPage from './components/User Page/UserPage';
import ChannelDetailed from './components/Channel Components/ChannelDetailed/ChannelDetailed';
import AllGroups from './components/Group Components/AllGroups/AllGroups';
import CreateGroup from './components/Group Components/CreateGroup/CreateGroup';
import Users from './components/User Page/UsersSearch';
import UserChatDetailed from './components/Individual Components/IndividualDetailed/UserChatDetailed';
import EditProfile from './components/User Page/EditProfile';
import AllChats from './components/Individual Components/AllChats/AllChats';

interface AppContextInterface {
  user: FirebaseUser | null;
  userData: User | null;
  groups: any[];
  chats: any[];
  setContext?: React.Dispatch<React.SetStateAction<AppContextInterface>>;
}

const App: FC = () => {
  const [appContext, setContext] = useState<AppContextInterface>({
    user: null,
    userData: null,
    groups: [],
    chats: [],
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
              groups: [],
              chats: [],
            });
          }
          setShowLoading(false);
        });
    } else {
      setShowLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.displayName) {
      getUserByHandle(user.displayName)
        .then((userData) => {
          if (userData) {
            setContext({
              user,
              userData,
              groups: [],
              chats: [],
            });
          }
          setShowLoading(false);
        });
    } else {
      setShowLoading(false);
    }
  }, [user, user?.displayName]);


  if ((loading && !appContext.userData && !appContext.user) || showLoading) {
    return <Loading />;
  }

  return (
    <AppContext.Provider value={{ ...appContext, setContext }}>
      <BrowserRouter>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/groups" element={<AllGroups />} />
          <Route path="/groups/create" element={<CreateGroup />} />
          <Route path="/groups/:groupId" element={<GroupDetailed />} />
          <Route path="/chats" element={<AllChats />} />
          <Route path="/chats/:chatId" element={<UserChatDetailed />} />
          <Route path="/users" element={<Users />} />
          <Route path="/groups/:groupId/channels/:channelId" element={<ChannelDetailed />} />
          <Route path="/profile" element={<UserPage userId={appContext.user?.uid || ''} />} />
          <Route path="/profile/edit" element={<EditProfile />} />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default App
