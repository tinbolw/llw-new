import type { Metadata } from "next";
import { Tinos } from "next/font/google";
import "@/app/globals.css";

const tinos = Tinos({
  weight: "400",
  variable: "--font-tinos",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "llw",
  description: "Ling Ling Website",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${tinos.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
