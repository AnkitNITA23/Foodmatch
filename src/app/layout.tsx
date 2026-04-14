import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: "FoodMatch | Real-Time Food Donation Platform",
  description: "Connect instantly with local food donors within a 5km radius. Stop food waste and help your community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body className={`${inter.variable} ${outfit.variable}`}>
          <div className="app-wrapper">
            <div className="ambient-glow top-glow"></div>
            <div className="ambient-glow bottom-glow"></div>

            <Navbar />

            <main className="main-content">{children}</main>

            <footer className="footer">
              <div className="container">
                <div className="footer-grid">
                  <div className="footer-brand">
                    <div className="brand" style={{ marginBottom: '0.75rem' }}>
                      <div className="brand-logo" style={{ width: '28px', height: '28px' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logo-svg"><path d="M12 2C8.69 2 6 5.58 6 10c0 4.42 6 8 6 12 0-4.42 6-7.58 6-12 0-4.42-2.69-8-6-8z"/><path d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>
                      </div>
                      <span className="brand-text" style={{ fontSize: '1.1rem' }}>
                        Food<span className="text-gradient">Match</span>
                      </span>
                    </div>
                    <p className="footer-desc">
                      Leveraging real-time geolocation matching to end food waste and hunger in our local communities.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)' }}>
                      <a href="#" className="hover-lift">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                      </a>
                      <a href="#" className="hover-lift">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                      </a>
                      <a href="#" className="hover-lift">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                      </a>
                    </div>
                  </div>

                  <div className="footer-links">
                    <h4>Platform</h4>
                    <Link href="#">For Donors</Link>
                    <Link href="#">For Receivers</Link>
                    <Link href="/map">Live Map</Link>
                    <Link href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem'}}>API Access <ExternalLink size={14}/></Link>
                  </div>

                  <div className="footer-links">
                    <h4>Company</h4>
                    <Link href="#">About Us</Link>
                    <Link href="#">Careers</Link>
                    <Link href="#">Blog</Link>
                    <Link href="#">Contact</Link>
                  </div>

                  <div className="footer-links">
                    <h4>Legal</h4>
                    <Link href="#">Privacy Policy</Link>
                    <Link href="#">Terms of Service</Link>
                    <Link href="#">Cookie Policy</Link>
                  </div>
                </div>

                <div className="footer-bottom">
                  <p>&copy; {new Date().getFullYear()} FoodMatch Inc. All rights reserved.</p>
                  <p className="made-with">Made with <span style={{ color: '#ff6b6b' }}>❤️</span> by Ankit</p>
                </div>
              </div>
            </footer>
            
            <MobileNav />
            
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
