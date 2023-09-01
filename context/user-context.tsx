// context\user-context.tsx
import { LoginValues, RegisterValues } from "@/lib/types/form-authentication";
import { Item } from "@/lib/types/item";
import { UserContextType, UserInfo, UserResponseData } from "@/lib/types/user";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { useNotification } from "./notification-context";
import { PendingMessages } from "@/lib/helpers/messages";

const UserContext = createContext<UserContextType>({} as UserContextType);

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [userInfo, setUserInfo] = useState<UserInfo>(null);
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [userInfoToDelete, setUserInfoToDelete] = useState<UserInfo>(null);
  const [serverItemsWereLoaded, setServerItemsWereLoaded] = useState(false);
  const [serverLoadWasTried, setServerLoadWasTried] = useState(false);
  const [itemSearchTerm, setItemSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    // Figure out how to add a loading component
    async function loadUserInfo() {
      if (!serverLoadWasTried) {
        const response = await fetch("/api/load-user");
        const data: UserResponseData = await response.json();
        console.log("data: ", data);
        if (data.type === "error") {
          showNotification({
            type: "error",
            message: data.message,
          });
        }
        if (data.type === "success" && data.userInfo) {
          setUserInfo(data.userInfo);
          setUserItems(data.userInfo.items);
          setServerItemsWereLoaded(true);
        }
      }
      setServerLoadWasTried(true);
    }
    loadUserInfo();
  }, [serverLoadWasTried, showNotification]);

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

  // function searchItems(newItemSearchTerm: string) {
  //   if (newItemSearchTerm === "") {
  //     setFilteredItems(getUserItems());
  //   } else {
  //     const filteredItems = getUserItems().filter((item) =>
  //       item?.name.toLowerCase().includes(newItemSearchTerm.toLowerCase())
  //     );
  //     setFilteredItems(filteredItems);
  //   }
  // }

  async function loginUser(values: LoginValues) {
    showNotification({
      type: "saving",
      message: "Logging in...",
    });
    const response = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });
    if (!response?.ok) {
      showNotification({
        type: "error",
        message: "Username or password incorrect",
      });
      return;
    }
    setServerItemsWereLoaded(false);
    setServerLoadWasTried(false);
    showNotification({
      type: "success",
      message: "Logged In",
    });
    if (serverLoadWasTried) {
      router.push("/inventory");
    }
  }
  //similar function to register user instead
  async function registerUser(values: RegisterValues) {
    const requestBody = {
      name: values.name,
      email: values.email,
      password: values.password,
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
    const data = await response.json();
    if (data) {
      showNotification({
        type: "success",
        message: "User created!",
      });
      router.push("/login");
    }
  }

  async function deleteUserInfo() {
    if (!userInfoToDelete) {
      console.error("No user set to delete");
      return;
    }
    showNotification({
      type: "saving",
      message: "Deleting User Data...",
    });
    const response = await fetch("/api/delete-user", {
      method: "DELETE",
    });
    const data = await response.json();
    if (data) {
      console.log(data);
      showNotification({
        type: "success",
        message: "User Deleted",
      });
      await signOut({
        callbackUrl: "/",
      });
    }
    setUserInfoToDelete(null);
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
    registerUser,
    // searchItems,
    itemSearchTerm,
    setItemSearchTerm,
  };

  return <UserContext.Provider value={context}>{children}</UserContext.Provider>;
}

// Custom hook to quickly read the context's value
export const useUserInfoContext = (): UserContextType => {
  return useContext(UserContext);
};
