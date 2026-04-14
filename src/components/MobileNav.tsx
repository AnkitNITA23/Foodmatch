"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, LayoutDashboard, Trophy } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  // Highlight active tab
  const isActive = (path: string) => pathname === path || (path === '/dashboard' && pathname.startsWith('/dashboard'));

  return (
    <nav className="mobile-nav">
      <Link href="/" className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}>
        <Home size={22} className="mobile-nav-icon" />
        <span className="mobile-nav-label">Home</span>
      </Link>
      
      <Link href="/map" className={`mobile-nav-item ${isActive('/map') ? 'active' : ''}`}>
        <Map size={22} className="mobile-nav-icon" />
        <span className="mobile-nav-label">Map</span>
      </Link>

      <Link href="/dashboard" className={`mobile-nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
        <LayoutDashboard size={22} className="mobile-nav-icon" />
        <span className="mobile-nav-label">Dashboard</span>
      </Link>

      <Link href="/leaderboard" className={`mobile-nav-item ${isActive('/leaderboard') ? 'active' : ''}`}>
        <Trophy size={22} className="mobile-nav-icon" />
        <span className="mobile-nav-label">Leaders</span>
      </Link>
    </nav>
  );
}
