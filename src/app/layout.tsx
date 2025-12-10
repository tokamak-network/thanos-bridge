import { Footer } from "@/components/layout/Footer";
import { GNBComponent } from "@/components/layout/GNB";
import { Flex } from "@chakra-ui/react";
import "./globals.css";
import { Providers } from "./providers";
import { Modal } from "@/components/modals/Modal";
import { PublicEnvScript } from "next-runtime-env";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PublicEnvScript />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <Flex flexDir={"column"}>
            <GNBComponent />
            {children}
            <Modal />
            <Footer />
          </Flex>
        </Providers>
      </body>
    </html>
  );
}
