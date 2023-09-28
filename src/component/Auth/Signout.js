import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

const SignOut = () => {
  // Use useEffect to perform the removal and redirection when the component mounts
  useEffect(() => {
    // Remove the 'admin' item from localStorage
    localStorage.removeItem('admin');
  }, []);

  return <Redirect to="/" />;
};

export default SignOut;
