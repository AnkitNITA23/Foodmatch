"use client";

import { useAuth } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Map, Zap, CheckCircle, LogIn, LayoutDashboard, Trophy } from "lucide-react";

export default function Navbar() {
  const { userId } = useAuth();

  return (
    <header className="navbar">
      <nav className="container nav-content">
        <Link href="/" className="brand">
          <div className="brand-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logo-svg">
              <path d="M12 2C8.69 2 6 5.58 6 10c0 4.42 6 8 6 12 0-4.42 6-7.58 6-12 0-4.42-2.69-8-6-8z"/>
              <path d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
            </svg>
          </div>
          <span className="brand-text">
            Food<span className="text-gradient">Match</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div className="nav-links">
            {userId && (
              <Link href="/map" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Map size={16} /> Live Map
              </Link>
            )}
            <Link href="/leaderboard" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Trophy size={16} /> Leaderboard
            </Link>
          </div>

          <div className="nav-actions">
            {!userId ? (
              <>
                <Link href="/sign-in" className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <LogIn size={18} /> Log In
                </Link>
                <Link href="/sign-up" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
                  Join Platform
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '12px' }}>
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <UserButton />
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
