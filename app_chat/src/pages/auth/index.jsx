import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { SIGNUP_ROUTE, SIGNIN_ROUTE } from "../../utilites/constant";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
const Auth = () => {
  // zustand
  const { userInfo, setUserInfo, setSelectedChatData } = useAppStore();

  const [nameForSignUp, setNameForSignUp] = useState("");
  const [passwordForSignUp, setPasswordForSignUp] = useState("");
  const [confirmPasswordForSignUp, setConfirmPasswordForSignUp] = useState("");
  const [nameForSignIn, setNameForSignIn] = useState("");
  const [passwordForSignIn, setPasswordForSignIn] = useState("");
  const navigate = useNavigate();
  const validateSignUp = () => {
    if (!nameForSignUp.length) {
      toast.warning("Name is required");
      return false;
    }
    if (!passwordForSignUp.length) {
      toast.warning("Password is required");
      return false;
    }
    if (!confirmPasswordForSignUp.length) {
      toast.warning("Confirm password is required");
      return false;
    }
    if (passwordForSignUp !== confirmPasswordForSignUp) {
      toast.warning("Password and confirm password do not match");
      return false;
    }
    return true;
  };
  const validateSignIn = () => {
    if (!nameForSignIn.length) {
      toast.warning("Name is required");
      return false;
    }
    if (!passwordForSignIn.length) {
      toast.warning("Password is required1");
      return false;
    }
    return true;
  };
  const handleSignUp = async () => {
    if (validateSignUp()) {
      try {
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          {
            name: nameForSignUp,
            password: passwordForSignUp,
          },
          {
            withCredentials: true,
          }
        );
        console.log(response);
        toast.success("Signup successful!");
      } catch (error) {
        console.error("Signup error:", error.response?.data || error.message);
        toast.error(
          `Signup failed: ${error.response?.data?.message || error.message}`
        );
      }
    }
  };
  const handleSignIn = async () => {
    if (validateSignIn()) {
      try {
        const response = await apiClient.post(
          SIGNIN_ROUTE,
          {
            name: nameForSignIn,
            password: passwordForSignIn,
          },
          {
            withCredentials: true,
          }
        );
        if (response.data.user.id) {
          // set user info to zustand
          await setUserInfo(response.data.user);
          if (response.status === 200 && response.data.user.profileSetup) {
            setSelectedChatData(null);
            navigate("/chat");
          } else {
            navigate("/profile");
          }
        }
      } catch (error) {
        console.error("Signin error:", error.response?.data || error.message);
        toast.error(
          `Signin failed: ${error.response?.data?.message || error.message}`
        );
      }
    }
  };
  return (
    <div className="container flex flex-col justify-center items-center h-screen dark:bg-background dark:text-foreground">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Sign Up</TabsTrigger>
          <TabsTrigger value="password">Sign In</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Sign up to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={nameForSignUp}
                  onChange={(e) => setNameForSignUp(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={passwordForSignUp}
                  onChange={(e) => setPasswordForSignUp(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPasswordForSignUp}
                  onChange={(e) => setConfirmPasswordForSignUp(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSignUp}>Sign Up</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Type your name</Label>
                <Input
                  id="current"
                  type="text"
                  value={nameForSignIn}
                  onChange={(e) => setNameForSignIn(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">Type your password</Label>
                <Input
                  id="new"
                  type="password"
                  value={passwordForSignIn}
                  onChange={(e) => setPasswordForSignIn(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSignIn}>Sign In</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
