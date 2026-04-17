import React, { useState, useEffect, useRef } from 'react';

import { io } from 'socket.io-client';
import { Send, UserCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ENDPOINT = "https://clg.onrender.com";
let socket;

const Chat = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const activeChat = "Global Network"; // Simulated active user, ideally an ID
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    
    // In a real app we'd join a specific chat room ID
    socket.emit("join chat", "global");

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      setMessages([...messages, newMessageReceived]);
    });
  });

  const sendMessage = async (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      if (newMessage) {
        setNewMessage(""); // Optimistically clear input
        const messageObject = {
          content: newMessage,
          sender: { _id: user._id, name: user.name, avatar: user.avatar },
          chat: "global", // Simulated global room logic
          createdAt: new Date().toISOString()
        };
        
        setMessages([...messages, messageObject]);
        // Normally we'd post to DB here, but for demo we just emit generic
        socket.emit("new message", messageObject);
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-6xl mx-auto h-[80vh] flex gap-6 pt-4">
      
      {/* Sidebar for conversations */}
      <div className="hidden md:flex flex-col w-80 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <h2 className="font-bold text-slate-800 dark:text-white">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Mock Contact list */}
          <div className="p-3">
             <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-slate-800 cursor-pointer">
               <div className="relative">
                 <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white"><UserCircle2 /></div>
                 <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800"></div>
               </div>
               <div>
                 <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Global Network</h4>
                 <p className="text-xs text-slate-500 line-clamp-1">Public space for all alumni & students</p>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
        
        {/* Chat header */}
        <div className="h-16 border-b border-gray-100 dark:border-slate-800 flex items-center px-6 bg-slate-50 dark:bg-slate-900/50 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white shadow-md">
              <UserCircle2 />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 dark:text-white leading-tight">{activeChat}</h2>
              <p className="text-xs text-emerald-500 font-medium">Online • {socketConnected ? 'Connected' : 'Connecting...'}</p>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 dark:bg-slate-900 space-y-4">
          <div className="text-center p-4">
            <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">Today</span>
          </div>

          {messages.map((m, i) => {
             const isMe = m.sender._id === user._id;
             return (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                 key={i} 
                 className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}
               >
                 <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                   {!isMe && <span className="text-xs text-slate-400 mb-1 ml-1">{m.sender.name}</span>}
                   <div 
                     className={`px-4 py-3 rounded-2xl ${
                        isMe 
                        ? 'bg-blue-600 text-white rounded-br-sm shadow-md' 
                        : 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-sm shadow-sm'
                     }`}
                   >
                     {m.content}
                   </div>
                   <span className="text-[10px] text-slate-400 mt-1">{new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                 </div>
               </motion.div>
             )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shrink-0">
          <div className="flex gap-2">
            <input 
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={sendMessage}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 border border-transparent dark:border-slate-700 border-gray-200 outline-none rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
            />
            <button 
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl shadow-md transition-colors flex items-center justify-center cursor-pointer"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Chat;
