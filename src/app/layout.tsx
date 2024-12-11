import { Footer } from "@/components/layout/Footer";
import { GNBComponent } from "@/components/layout/GNB";
import { Flex } from "@chakra-ui/react";
import "./globals.css";
import { Providers } from "./providers";
import { Modal } from "@/components/modals/Modal";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
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
