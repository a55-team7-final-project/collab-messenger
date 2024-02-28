import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase-setup';
import { AppContext } from '../../context/AppContext';
import { Button, Grid, Input } from '@chakra-ui/react';
import { MdNotificationsActive, MdOutlineDiversity2 } from 'react-icons/md';

const Header: React.FC = () => {
  const { user, setContext } = useContext(AppContext);
  const navigate = useNavigate();

  const logOut = async () => {
    await auth.signOut();
    if (setContext) {
      setContext({ user: null, userData: null });
    }
    navigate('/home');
  }

  return (
    <header>
      <div> 
        {user ? (
          <Grid templateColumns="1fr auto auto auto" mt={'20px'} justifyContent="flex-end" justifyItems="end" alignItems="center" mr='50px' mb='20px'>
            <Input
              type="text"
              name="search"
              w="600px"
              id="search"
              placeholder="Search..."
            />
            <MdOutlineDiversity2 color='gray' size='23px' style={{ marginLeft: '25px', marginRight: '15px' }} />
            <MdNotificationsActive color='gray' size='23px' style={{ marginLeft: '15px' }} />
            <Button onClick={logOut} border="1px" color="blue" w="80px" ml='50px'>Logout</Button>
          </Grid>
        ) : (
          <>
            <Link to="/register"><Button>Register</Button></Link>
            <Link to="/login"><Button>Login</Button></Link>
          </>
        )}
      </div> 
    </header>
  );
};

export default Header;