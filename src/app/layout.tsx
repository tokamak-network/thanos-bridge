import { Providers } from "./providers";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
// import { GNBComponent } from "@/components/layout/GNB";

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
          {/* <GNBComponent /> */}
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
