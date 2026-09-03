import React, { useEffect, useState } from "react";
import Home from "./Components/Home";
import Dashboard from "./Components/Dashboard";
import Auth from "./Components/Auth";
import Chatpage from "./Components/Chatpage";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const ProtectedRoute = ({ children, loading, loggedin }) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!loggedin) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const App = () => {
  const [loading, setloading] = useState(true);
  const [loggedin, setloggedin] = useState(false);
  const [user, setuser] = useState(null);
  const [chats, setchats] = useState([]);

  const url = import.meta.env.VITE_APP_URL;

  const checkAuth = async () => {
    try {
      const response = await fetch(`${url}/api/v1/check-auth`, {
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        setuser(data.user);
        setloggedin(true);
      } else {
        setuser(null);
        setloggedin(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setuser(null);
      setloggedin(false);
    } finally {
      setloading(false);
    }
  };

  const fetchchats = async () => {
    try {
      const response = await fetch(`${url}/api/v1/getchats`, {
        method: "GET",
        credentials: "include"
      });

      const data = await response.json();

      if (response.ok) {
        setchats(data.chats || []);
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (loggedin) {
      fetchchats();
    }
  }, [loggedin]);

  return (
    <div>
      <Toaster />
      <Routes>
  <Route path="/" element={loading ? <div className="min-h-screen flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-[#03045E]/20 border-t-[#03045E] rounded-full animate-spin"></div>
  </div> : loggedin ? <Navigate to="/dashboard" replace /> : <Home user={user} loggedin={loggedin}/>} />

  <Route path="/auth" element={<Auth setloggedin={setloggedin} setuser={setuser} />} />

  <Route path="/dashboard" element={<ProtectedRoute loading={loading} loggedin={loggedin}><Dashboard chats={chats} setchats={setchats} user={user} /></ProtectedRoute>} />

  <Route path="/chat/:chatId" element={<ProtectedRoute loading={loading} loggedin={loggedin}><Chatpage /></ProtectedRoute>} />

</Routes>
    </div>
  );
};

export default App;