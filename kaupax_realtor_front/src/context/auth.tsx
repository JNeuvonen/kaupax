import LoginPage from "@/components/LoginPage";
import Kirjaudu from "@/components/Pages/Login/kirjaudu";
import Kirjautuminen from "@/components/Pages/Login/kirjautuminen";
import CreateAccount from "@/components/Pages/Login/luo-tili";
import AddInformation from "@/components/Pages/Signup/addInformation";
import WaitingVerification from "@/components/Pages/Signup/waitingVerification";
import { loginRealtorUrl } from "@/services/endpoints";
import { getReq, postReq } from "@/services/util";
import { Realtor } from "@/utils/types/realtor";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "./toast";

export type AuthContext = {
  accessToken: string | null;
  user: Realtor | null;
  isAuthenticated: boolean;
  modifyUser: (user: Realtor) => void;
  loginWithToken: () => void;
  loginManually: (
    email: string,
    password: string,
    isLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  logOff: () => void;
  writeAccesTokenToStorage: (token: string) => void;
};

const AuthContext = createContext<AuthContext>({} as AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<Realtor | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const toast = useToast();
  const [, updateState] = React.useState();

  useEffect(() => {
    const asyncWrapper = async () => {
      const session = localStorage.getItem("authorization");
      setAccessToken(session);

      if (session) {
        const { status, res } = await getReq({
          url: `${process.env.NEXT_PUBLIC_API_URL}/user/user-from-token`,
          token: session,
          queryParams: [{ key: "type", value: "realtor" }],
        });

        if (status === 200) {
          setUser(res.payload);
        }
      }
    };
    asyncWrapper();
  }, []);

  const modifyUser = (user: Realtor) => {
    setUser(user);
  };

  const writeAccesTokenToStorage = (token: string) => {
    localStorage.setItem("authorization", token);
    setAccessToken(token);
  };

  const loginWithToken = async () => {
    const token = localStorage.getItem("authorization");

    if (!token) return;
    const { status, res } = await getReq({
      url: `${process.env.NEXT_PUBLIC_API_URL}/user/user-from-token`,
      token: token,
      queryParams: [{ key: "type", value: "client" }],
    });

    if (status === 200) {
      setUser(res.payload);
    }
  };

  const loginManually = async (
    email: string,
    password: string,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const body = {
      email,
      password,
    };
    setIsLoading(true);
    const { status, res } = await postReq({
      url: loginRealtorUrl(),
      payload: body,
    });

    if (status === 200) {
      writeAccesTokenToStorage(res.accessToken);
      setUser(res.user);
      toast.toastProps.openToast({
        message: "Tervetuloa takaisin!",
        severity: "success",
      });
      router.push("/");
      setIsLoading(false);
    } else {
      toast.toastProps.openToast({
        message: "Sähköposti tai salasana on väärin",
        severity: "error",
      });
      setIsLoading(false);
    }
  };

  const logOff = () => {
    localStorage.removeItem("authorization");
    setUser(null);
  };

  const renderContent = () => {
    if (!user) {
      if (router.pathname === "/login/kirjautuminen") {
        return <Kirjautuminen />;
      }

      if (router.pathname === "/login/kirjaudu") {
        return <Kirjaudu />;
      }

      if (router.pathname === "/login/luo-tili") {
        return <CreateAccount />;
      }
      return <LoginPage />;
    }

    if (user.verificationSubmitted && !user.verified) {
      return <WaitingVerification />;
    }

    if (!user.verified) {
      return <AddInformation user={user} />;
    }

    return children;
  };

  const provider = {
    modifyUser,
    accessToken,
    user,
    isAuthenticated: user ? true : false,
    logOff,
    loginManually,
    writeAccesTokenToStorage,
    loginWithToken,
  };

  return (
    <AuthContext.Provider value={provider}>
      {renderContent()}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
