import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TailorCV – AI Resume ATS Optimizer",
  description:
    "TailorCV helps job seekers optimize their resumes for ATS systems. Get instant ATS score, detect missing skills, and improve your resume for better job opportunities.",

  keywords: [
    "resume optimizer",
    "ATS resume checker",
    "resume analyzer",
    "AI resume tool",
    "resume ATS score",
  ],

  openGraph: {
    title: "TailorCV – Resume ATS Optimizer",
    description:
      "Analyze your resume against job descriptions and improve your ATS score instantly.",
    url: "https://resume-tool.vercel.app",
    siteName: "TailorCV",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}