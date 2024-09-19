import Layout from "@/components/Layout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { ThemeProvider } from "@/components/theme-provider";
import { useAppStore } from "./store";
import apiClient from "./lib/api-client";
import { GET_USER_INFO } from "./utilites/constant";
import { useEffect, useState } from "react";
const PrivateRoutes = ({ children }) => {
  const { userInfo } = useAppStore();
  const authenticated = !!userInfo;
  return authenticated ? children : <Navigate to="/auth" />;
};
const AuthRoutes = ({ children }) => {
  const { userInfo } = useAppStore();
  const authenticated = !!userInfo;
  return authenticated ? <Navigate to="/chat" /> : children;
};
const App = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });
        console.log(res);
        if (res.status === 200 && res.data.id) {
          setUserInfo(res.data);
        } else {
          setUserInfo(null);
        }
      } catch (error) {
        console.log(error);
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };
    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route
              path="/auth"
              element={
                <AuthRoutes>
                  <Auth />
                </AuthRoutes>
              }
            />
            <Route
              path="/chat"
              element={
                <PrivateRoutes>
                  <Chat />
                </PrivateRoutes>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoutes>
                  <Profile />
                </PrivateRoutes>
              }
            />
            <Route path="*" element={<Navigate to="/auth" />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
