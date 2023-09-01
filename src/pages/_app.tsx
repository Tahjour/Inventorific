// src\pages\_app.tsx
import MainLayout from "@/components/layout/main-layout";
import AllContextProviders from "@/components/ui/providers/context-providers";
import "@/src/styles/globals.css";
import "@/src/styles/main-navigation/main-navigation.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      const height = window.innerHeight;
      setViewportHeight(height);
    };

    updateHeight();

    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, [viewportHeight]);

  return (
    <SessionProvider session={session}>
      <AllContextProviders>
        <MainLayout viewportHeight={viewportHeight}>
          <Component {...pageProps} />
        </MainLayout>
      </AllContextProviders>
    </SessionProvider>
  );
}
