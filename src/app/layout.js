import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-poppins" });

export const metadata = {
    title: "FundSpark – Crowdfunding Platform",
    description: "Empowering creators to launch, grow, and succeed. FundSpark connects innovators with supporters worldwide.",
    icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
            <body className="font-sans bg-bg min-h-screen flex flex-col antialiased">
                {children}
                <Toaster position="top-right" toastOptions={{ duration: 4000, style: { borderRadius: '12px', padding: '12px 16px', fontSize: '14px' } }} />
            </body>
        </html>
    );
}
