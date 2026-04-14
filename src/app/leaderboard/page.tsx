"use client";

import { useEffect, useState } from "react";
import { Trophy, TrendingUp, Medal, Crown, Star, PackageCheck, MapPin, Loader2, Navigation } from "lucide-react";
import Navbar from "@/components/Navbar";

type Leader = {
  id: string;
  name: string;
  totalListings: number;
  completedListings: number;
  impactScore: number;
};

const RADIUS_OPTIONS = [5, 10, 20, 50];

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(true);
  const [isLocal, setIsLocal] = useState(false);
  const [radius, setRadius] = useState(20);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState(false);

  const fetchLeaders = async (lat?: number, lng?: number, r = radius) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ radius: String(r) });
      if (lat !== undefined && lng !== undefined) {
        params.set('lat', String(lat));
        params.set('lng', String(lng));
      }
      const res = await fetch(`/api/leaderboard?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLeaders(data.leaders);
        setIsLocal(data.isLocal);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocating(false);
      setLocationError(true);
      fetchLeaders();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        setLocating(false);
        fetchLeaders(latitude, longitude, radius);
      },
      () => {
        setLocating(false);
        setLocationError(true);
        fetchLeaders(); // fallback: global
      },
      { timeout: 6000 }
    );
  }, []);

  const handleRadiusChange = (r: number) => {
    setRadius(r);
    if (userCoords) {
      fetchLeaders(userCoords.lat, userCoords.lng, r);
    } else {
      fetchLeaders(undefined, undefined, r);
    }
  };

  const getBadge = (rank: number, score: number) => {
    if (rank === 0) return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fcc419', background: 'rgba(252, 196, 25, 0.12)', padding: '0.4rem 0.9rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(252,196,25,0.2)' }}>
        <Crown size={14}/> Top Donor
      </div>
    );
    if (rank === 1) return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e0e0e0', background: 'rgba(255, 255, 255, 0.08)', padding: '0.4rem 0.9rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700 }}>
        <Medal size={14} color="#e0e0e0"/> Silver
      </div>
    );
    if (rank === 2) return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e08060', background: 'rgba(208, 135, 112, 0.1)', padding: '0.4rem 0.9rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700 }}>
        <Medal size={14} color="#e08060"/> Bronze
      </div>
    );
    if (score > 50) return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', background: 'rgba(255, 107, 107, 0.1)', padding: '0.4rem 0.9rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700 }}>
        <Star size={14}/> Hero
      </div>
    );
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.05)', padding: '0.4rem 0.9rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700 }}>
        <PackageCheck size={14}/> Donor
      </div>
    );
  };

  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content container" style={{ paddingTop: '120px', paddingBottom: '4rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'var(--surface-color)', borderRadius: '24px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Trophy size={48} color="#fcc419" />
          </div>
          <h1 style={{ fontSize: '2.8rem', margin: '0 0 1rem 0', fontWeight: 800, letterSpacing: '-1px' }}>
            Local Impact <span className="text-gradient">Leaderboard</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '580px', margin: '0 auto' }}>
            {locating
              ? 'Detecting your location to find top donors nearby…'
              : isLocal
              ? `Top food rescuers within ${radius}km of your location`
              : 'Showing global leaderboard — location access needed for local view'
            }
          </p>
        </div>

        {/* Location Status Bar */}
        <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '2rem', maxWidth: '800px', margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
            {locating ? (
              <><Loader2 size={16} className="animate-spin" style={{ color: 'var(--primary-color)' }} /> Locating you…</>
            ) : locationError ? (
              <><Navigation size={16} style={{ color: 'var(--text-muted)' }} /> <span style={{ color: 'var(--text-muted)' }}>Location unavailable — showing global</span></>
            ) : (
              <><MapPin size={16} style={{ color: 'var(--secondary-color)' }} /> <span style={{ color: 'var(--secondary-color)' }}>Local view active</span></>
            )}
          </div>

          {/* Radius Selector */}
          {!locationError && (
            <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255,255,255,0.04)', padding: '0.3rem', borderRadius: '99px' }}>
              {RADIUS_OPTIONS.map(r => (
                <button
                  key={r}
                  onClick={() => handleRadiusChange(r)}
                  style={{
                    background: radius === r ? 'var(--primary-color)' : 'transparent',
                    color: radius === r ? 'white' : 'var(--text-muted)',
                    border: 'none',
                    padding: '0.35rem 0.9rem',
                    borderRadius: '99px',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                >
                  {r}km
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Leaderboard List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', maxWidth: '800px', margin: '0 auto' }}>
          {loading ? (
            <>
              <div className="glass-panel" style={{ height: '88px', animation: 'pulse 1.5s infinite', background: 'rgba(255,255,255,0.02)' }} />
              <div className="glass-panel" style={{ height: '88px', animation: 'pulse 1.5s infinite', background: 'rgba(255,255,255,0.02)' }} />
              <div className="glass-panel" style={{ height: '88px', animation: 'pulse 1.5s infinite', background: 'rgba(255,255,255,0.02)' }} />
            </>
          ) : leaders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-muted)' }}>
              <Trophy size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.2 }} />
              <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>No donors in this area yet</h3>
              <p>Try expanding the radius above, or be the first hero in your neighbourhood!</p>
            </div>
          ) : (
            leaders.map((leader, index) => (
              <div
                key={leader.id}
                className="glass-panel hover-lift animate-fade-in"
                style={{
                  padding: '1.25rem 1.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  animationDelay: `${index * 0.06}s`,
                  borderLeft: index === 0 ? '3px solid #fcc419' : index === 1 ? '3px solid #e0e0e0' : index === 2 ? '3px solid #e08060' : '3px solid transparent',
                }}
              >
                {/* Rank */}
                <div style={{ fontSize: index < 3 ? '2rem' : '1.5rem', fontWeight: 800, color: index < 3 ? 'white' : 'var(--text-muted)', width: '36px', textAlign: 'center', flexShrink: 0 }}>
                  {index < 3 ? ['🥇','🥈','🥉'][index] : `#${index + 1}`}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {leader.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                    <span><strong style={{ color: 'white' }}>{leader.totalListings}</strong> listings</span>
                    <span>•</span>
                    <span><strong style={{ color: 'white' }}>{leader.completedListings}</strong> pickups</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--secondary-color)' }}>
                      <TrendingUp size={13} /> {leader.impactScore} pts
                    </span>
                  </div>
                </div>

                {/* Badge */}
                <div style={{ flexShrink: 0 }}>
                  {getBadge(index, leader.impactScore)}
                </div>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
}
