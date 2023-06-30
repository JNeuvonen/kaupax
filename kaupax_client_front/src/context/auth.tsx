import { getReq, postReq } from "@/services/util";
import { loginUserUrl } from "@/utils/endpoints";
import { Location } from "@/utils/types/google";
import { User } from "@/utils/types/user";
import { useRouter } from "next/router";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useToast } from "./toast";

export type Role = "CLIENT" | "REALTOR" | null;

export type AuthContext = {
  user: User | null;
  isAuthenticated: boolean;
  role: Role;
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
  accessToken: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  writeAccesTokenToStorage: (token: string) => void;
  loginWithToken: () => void;
  loginManually: (
    email: string,
    password: string,
    isLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  logOff: () => void;
};

const AuthContext = createContext<AuthContext>({} as AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocation] = useState({ lat: 60.169857, lng: 24.938379 });
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast();
  useEffect(() => {
    const asyncWrapper = async () => {
      const session = localStorage.getItem("authorization");
      setAccessToken(session);

      if (session) {
        const { status, res } = await getReq({
          url: `${process.env.NEXT_PUBLIC_API_URL}/user/user-from-token`,
          token: session,
          queryParams: [{ key: "type", value: "client" }],
        });

        if (status === 200) {
          setUser(res.payload);
        }
      }
    };
    asyncWrapper();
  }, []);

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
      url: loginUserUrl,
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
        message: "Tapahtui virhe",
        severity: "error",
      });
      setIsLoading(false);
    }
  };

  const logOff = () => {
    localStorage.removeItem("authorization");
    setUser(null);
  };

  const provider = useMemo(() => {
    return {
      user,
      isAuthenticated: user ? true : false,
      role: null,
      location,
      setLocation,
      accessToken,
      setUser,
      writeAccesTokenToStorage,
      loginWithToken,
      loginManually,
      logOff,
    };
  }, [user, location, accessToken]);

  return (
    <AuthContext.Provider value={provider}>{children}</AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
