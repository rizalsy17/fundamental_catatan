import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { login } from '../utils/network-data';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loginUser = async (email, password) => {
    const { error, data } = await login({ email, password });
    if (!error) {
      setUser(data);
      localStorage.setItem('accessToken', data.accessToken);
    }
    return { error, data };
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
