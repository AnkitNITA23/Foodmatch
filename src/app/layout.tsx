import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Link from "next/link";
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
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} ${outfit.variable}`}>
          <div className="app-wrapper">
            {/* Ambient Background Glow */}
            <div className="ambient-glow top-glow"></div>
            <div className="ambient-glow bottom-glow"></div>

            {/* Sticky Glass Navbar */}
            <header className="navbar">
              <nav className="container nav-content">
                <Link href="/" className="brand">
                  <div className="brand-logo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logo-svg"><path d="M12 2C8.69 2 6 5.58 6 10c0 4.42 6 8 6 12 0-4.42 6-7.58 6-12 0-4.42-2.69-8-6-8z"/><path d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>
                  </div>
                  <span className="brand-text">
                    Food<span className="text-gradient">Match</span>
                  </span>
                </Link>
                
                <div className="nav-links">
                  <Link href="#features" className="nav-link">Features</Link>
                  <Link href="#how-it-works" className="nav-link">How it Works</Link>
                  <Link href="#impact" className="nav-link">Impact</Link>
                </div>

                <div className="nav-actions">
                  <Link href="/sign-in" className="btn-ghost">Log In</Link>
                  <Link href="/sign-up" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
                    Join Platform
                  </Link>
                </div>
              </nav>
            </header>

            <main className="main-content">{children}</main>

            {/* Rich Footer */}
            <footer className="footer">
              <div className="container">
                <div className="footer-grid">
                  <div className="footer-brand">
                    <div className="brand" style={{ marginBottom: '1rem' }}>
                      <div className="brand-logo" style={{ width: '32px', height: '32px' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logo-svg"><path d="M12 2C8.69 2 6 5.58 6 10c0 4.42 6 8 6 12 0-4.42 6-7.58 6-12 0-4.42-2.69-8-6-8z"/><path d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>
                      </div>
                      <span className="brand-text" style={{ fontSize: '1.25rem' }}>
                        Food<span className="text-gradient">Match</span>
                      </span>
                    </div>
                    <p className="footer-desc">
                      Leveraging real-time geolocation matching to end food waste and hunger in our local communities.
                    </p>
                  </div>
                  
                  <div className="footer-links">
                    <h4>Platform</h4>
                    <Link href="#">For Donors</Link>
                    <Link href="#">For Receivers</Link>
                    <Link href="#">Live Map</Link>
                    <Link href="#">Pricing</Link>
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
                  <p className="made-with">Made with <span style={{ color: '#ff6b6b' }}>❤️</span> for the community</p>
                </div>
              </div>
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
