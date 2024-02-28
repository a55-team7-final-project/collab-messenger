import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} Collab Messenger / Team 7</p>
    </footer>
  );
};

export default Footer;