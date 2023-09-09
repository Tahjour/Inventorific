
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";

type WindowContextType = {
  windowHeight: number;
  windowWidth: number;
};

const WindowContext = createContext<WindowContextType>({
  windowHeight: 0,
  windowWidth: 0,
});

export function WindowContextProvider({ children }: PropsWithChildren) {
  // Check if window object is defined before using it

  const [windowHeight, setWindowHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  // Update window windowWidth when window size changes
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Remove the event listener on cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const windowContext = {
    windowHeight: windowHeight,
    windowWidth: windowWidth,
  };

  return <WindowContext.Provider value={windowContext}>{children}</WindowContext.Provider>;
}

// Custom hook to quickly read the windowContext's value
export const useWindowContext = (): WindowContextType => {
  return useContext(WindowContext);
};