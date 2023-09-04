// context\user-context.tsx
import { ErrorMessages, PendingMessages, SuccessMessages } from "@/lib/helpers/messages";
import { ResponseData } from "@/lib/types/api";
import { LoginValues, RegisterValues } from "@/lib/types/form-authentication";
import { Item } from "@/lib/types/item";
import { ListType } from "@/lib/types/list";
import { UserContextType, UserInfo } from "@/lib/types/user";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { useNotification } from "./notification-context";

const UserContext = createContext<UserContextType>({} as UserContextType);

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const [userInfo, setUserInfo] = useState<UserInfo>(null);
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [userInfoToDelete, setUserInfoToDelete] = useState<UserInfo>(null);
  const [serverItemsWereLoaded, setServerItemsWereLoaded] = useState(false);
  const [serverLoadWasTried, setServerLoadWasTried] = useState(false);
  const [itemSearchTerm, setItemSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [preferredListType, setPreferredListType] = useState<ListType>("tiles");

  useEffect(() => {
    // Figure out how to add a loading component
    async function loadUserInfo() {
      if (!serverLoadWasTried) {
        const response = await fetch("/api/load-user");
        const data: ResponseData = await response.json();
        console.log("data: ", data);
        if (data.type === "success" && data.userInfo) {
          setUserInfo(data.userInfo);
          setUserItems(data.userInfo.items);
          setServerItemsWereLoaded(true);
        }
      }
      setServerLoadWasTried(true);
    }
    loadUserInfo();
  }, [serverLoadWasTried]);

  // Update debouncedSearchTerm with a delay after itemSearchTerm changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(itemSearchTerm);
    }, 200); // 200ms delay

    // Cleanup function to clear the timeout if itemSearchTerm changes before the delay is over
    return () => clearTimeout(timeoutId);
  }, [itemSearchTerm]);

  function getUserItems() {
    if (debouncedSearchTerm === "") {
      return userItems;
    }

    return userItems.filter((item) =>
      item?.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }

  function getUserItem(itemID: string) {
    return userItems.find((item) => item?.id === itemID);
  }

  function getUserInfo() {
    return userInfo;
  }

  function getUserInfoToDelete() {
    return userInfoToDelete;
  }

  function getPreferredListType() {
    return preferredListType;
  }

  function changePreferredListType(preferredListType: ListType) {
    setPreferredListType(preferredListType);
  }

  async function loginUser(values: LoginValues) {
    try {
      showNotification({
        type: "saving",
        message: PendingMessages.LoggingIn,
      });
      const response = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });
      if (!response || !response.ok) {
        throw new Error(ErrorMessages.UserLoginFailed);
      }
      setServerItemsWereLoaded(false);
      setServerLoadWasTried(false);
      showNotification({
        type: "success",
        message: SuccessMessages.UserSignedIn,
      });

      router.push("/inventory");
    } catch (error) {
      showNotification({
        type: "error",
        message: error instanceof Error ? error.message : ErrorMessages.UserLoginFailed,
      });
    }
  }

  async function loginUserWithGoogle() {
    try {
      showNotification({
        type: "saving",
        message: "launching...",
      });
      const response = await signIn("google", { callbackUrl: "/inventory" });

      if (response?.ok) {
        showNotification({
          type: "success",
          message: "Success!",
        });

        setServerItemsWereLoaded(false);
        setServerLoadWasTried(false);
      }
    } catch (error) {
      showNotification({
        type: "error",
        message: "Something went wrong!",
      });
    }
  }
  //similar function to register user instead
  async function registerUser(values: RegisterValues) {
    try {
      const requestBody = {
        name: values.name,
        email: values.email,
        password: values.password,
        list_type: preferredListType,
      };
      showNotification({
        type: "saving",
        message: PendingMessages.CreatingUser,
      });
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data: ResponseData = await response.json();
      if (data.type === "error") {
        showNotification({
          type: "error",
          message: data.message,
        });
        return;
      }
      if (data) {
        showNotification({
          type: "success",
          message: SuccessMessages.UserCreated,
        });
        router.push("/login");
      }
    } catch (error) {
      showNotification({
        type: "error",
        message: error instanceof Error ? error.message : ErrorMessages.UserCreationFailed,
      });
    }
  }

  async function deleteUserInfo() {
    try {
      if (!userInfoToDelete) {
        throw new Error(ErrorMessages.NoUserToDelete);
      }
      showNotification({
        type: "saving",
        message: "Deleting User Data...",
      });
      const response = await fetch("/api/delete-user", {
        method: "DELETE",
      });
      const data: ResponseData = await response.json();
      if (data.type === "error") {
        throw new Error(data.message);
      }
      showNotification({
        type: "success",
        message: data.message,
      });
      await signOut({
        callbackUrl: "/",
      });
    } catch (error) {
      showNotification({
        type: "error",
        message: error instanceof Error ? error.message : ErrorMessages.UserDeleteFailed,
      });
    } finally {
      setUserInfoToDelete(null);
    }
  }

  const context: UserContextType = {
    getUserInfo,
    getUserItems,
    getUserItem,
    setUserItems,
    getUserInfoToDelete,
    setUserInfoToDelete,
    deleteUserInfo,
    serverLoadWasTried,
    serverItemsWereLoaded,
    setServerLoadWasTried,
    setServerItemsWereLoaded,
    loginUser,
    loginUserWithGoogle,
    registerUser,
    itemSearchTerm,
    setItemSearchTerm,
    changePreferredListType,
    getPreferredListType,
  };

  return <UserContext.Provider value={context}>{children}</UserContext.Provider>;
}

// Custom hook to quickly read the context's value
export const useUserInfoContext = (): UserContextType => {
  return useContext(UserContext);
};
