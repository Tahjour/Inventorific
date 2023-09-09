// src\pages\_app.tsx
import MainLayout from "@/components/layout/main-layout";
import AllContextProviders from "@/components/ui/providers/context-providers";
import "@/src/styles/globals.css";
import "@/src/styles/main-navigation/main-navigation.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <AllContextProviders>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </AllContextProviders>
    </SessionProvider>
  );
}
