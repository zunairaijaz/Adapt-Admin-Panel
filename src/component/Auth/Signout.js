import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

const Signout = () => {
  // Use useEffect to perform the removal and redirection when the component mounts
  useEffect(() => {
    // Remove the 'admin' item from localStorage
    localStorage.removeItem('admin');
  }, []);

  return <Redirect to="/signin" />;
};

export default Signout;
