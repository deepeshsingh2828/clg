/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ user, children }) => {
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const socket = io('http://localhost:5000');
    socketRef.current = socket;

    socket.emit('setup', user);
    socket.on('connected', () => console.log('Socket connected for notifications'));

    socket.on('contact_request_update', (data) => {
      const msg = data.status === 'approved'
        ? `✅ Your request to view ${data.alumniName}'s contact details was approved!`
        : `❌ Your request for ${data.alumniName} was rejected. ${data.adminMessage ? `Reason: "${data.adminMessage}"` : ''}`;

      setNotifications(prev => [
        { id: Date.now(), msg, status: data.status, read: false, time: new Date() },
        ...prev
      ]);
    });

    return () => socket.disconnect();
  }, [user]);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const clearAll = () => setNotifications([]);

  return (
    <NotificationContext.Provider value={{ notifications, markAllRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};
