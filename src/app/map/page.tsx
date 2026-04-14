"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, MapPin, Package, Activity, ArrowRight, Clock, Navigation, Zap, Users, TrendingUp, List, BarChart3, CookingPot, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface MapViewProps {
  donations: any[];
  userLocation: { lat: number; lng: number };
}

const MapView = dynamic<MapViewProps>(() => import("../../components/MapView"), {
  ssr: false,
  loading: () => (
    <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8' }}>
      <div style={{ textAlign: 'center', color: 'var(--primary-color)' }}>
        <Loader2 size={32} style={{ margin: '0 auto 0.75rem', animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#555' }}>Loading Map…</span>
      </div>
    </div>
  )
});

// Animated SVG food drop pin
function PinSVG({ color = '#ff6b6b' }: { color?: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="14" r="10" fill={color} opacity="0.15"/>
      <circle cx="16" cy="14" r="6" fill={color}/>
      <polygon points="16,26 11,18 21,18" fill={color}/>
      <circle cx="16" cy="14" r="2.5" fill="white"/>
    </svg>
  );
}

// Animated radar SVG ring with rotating beam
function RadarRings() {
  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '120px', height: '120px', pointerEvents: 'none', zIndex: 2 }}>
      {/* Scanning Beam (CSS Conic Gradient) */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: 'conic-gradient(from 0deg, rgba(64,192,87,0.4) 0%, transparent 60%)',
        animation: 'radarBeam 3s linear infinite',
      }} />
      <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Rings */}
        {[20,35,50].map((r, i) => (
          <circle key={r} cx="60" cy="60" r={r} stroke="rgba(64,192,87,0.2)" strokeWidth="1" fill="none"
            style={{ animation: `radarRingPulse 3s ease-out ${i * 0.7}s infinite`, transformOrigin: '60px 60px' }} />
        ))}
      </svg>
    </div>
  );
}

export default function MapPage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'list' | 'stats'>('list');

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: 28.6139, lng: 77.2090 })
      );
    } else {
      setUserLocation({ lat: 28.6139, lng: 77.2090 });
    }

    fetch('/api/donations/all')
      .then(r => r.json())
      .then(data => setDonations(Array.isArray(data) ? data : []))
      .catch(() => setDonations([]))
      .finally(() => setLoading(false));
  }, []);

  const totalDonors = new Set(donations.map(d => d.donorId)).size;

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg-color)', display: 'flex', flexDirection: 'column' }}>

      {/* ── PAGE HEADER ── */}
      <div style={{ padding: '2rem 1.5rem 1rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span style={{ display: 'inline-flex', width: 8, height: 8, background: 'var(--secondary-color)', borderRadius: '50%', boxShadow: '0 0 8px var(--secondary-color)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--secondary-color)' }}>Live System</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem', letterSpacing: '-0.02em' }}>
              <Activity size={28} color="var(--primary-color)" />
              Food Radar
              <span className="text-gradient">Map</span>
            </h1>
          </div>

          {/* Stat chips */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(64,192,87,0.1)', border: '1px solid rgba(64,192,87,0.2)', padding: '0.5rem 1rem', borderRadius: '999px' }}>
              <Package size={14} color="var(--secondary-color)" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--secondary-color)' }}>{loading ? '…' : donations.length}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Drops</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', padding: '0.5rem 1rem', borderRadius: '999px' }}>
              <Users size={14} color="var(--primary-color)" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-color)' }}>{loading ? '…' : totalDonors}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Donors</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.5rem 1rem', borderRadius: '999px' }}>
              <MapPin size={14} color="var(--text-muted)" />
              <span style={{ fontSize: '0.8rem', color: userLocation ? 'white' : 'var(--text-muted)', fontWeight: 600 }}>{userLocation ? 'GPS Active' : 'Locating…'}</span>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Real-time food donations in your area — click any marker to claim directly from the map.
        </p>
      </div>

      {/* ── MAIN SPLIT LAYOUT ── */}
      <div className="map-layout-wrapper" style={{ flex: 1, display: 'flex', gap: '1.25rem', padding: '0 1.5rem 1.5rem', maxWidth: '1400px', margin: '0 auto', width: '100%', minHeight: '600px' }}>

        {/* Left: Map Panel */}
        <div style={{ flex: 1, borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 24px 60px rgba(0,0,0,0.5)', position: 'relative', minHeight: '500px', background: '#e8edf2' }}>

          {/* Map overlaid top-left label */}
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 500, background: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(10px)', padding: '0.4rem 0.8rem', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Zap size={12} color="var(--primary-color)" />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'white', letterSpacing: '1px', textTransform: 'uppercase' }}>Live Feed</span>
          </div>

          {userLocation ? (
            <MapView donations={donations} userLocation={userLocation} />
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '2rem' }}>
              <div style={{ position: 'relative' }}>
                <RadarRings />
                <div style={{ width: 48, height: 48, background: 'var(--surface-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 1 }}>
                  <Navigation size={22} color="var(--primary-color)" style={{ animation: 'spin 3s linear infinite' }} />
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>Acquiring your location…</p>
            </div>
          )}
        </div>

        {/* Right: Sidebar */}
        <div className="map-sidebar-content" style={{ width: '380px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: 'calc(100vh - 260px)', paddingBottom: '0.5rem' }}>

          {/* Tab bar */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '0.3rem', gap: '0.25rem', flexShrink: 0 }}>
            {(['list', 'stats'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '9px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s',
                  background: activeTab === tab ? 'var(--surface-color)' : 'transparent',
                  color: activeTab === tab ? 'white' : 'var(--text-muted)' }}>
                {tab === 'list' ? <><List size={16} style={{ marginRight: '0.4rem' }} /> Nearby Drops</> : <><BarChart3 size={16} style={{ marginRight: '0.4rem' }} /> Live Stats</>}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'list' && (
              <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="glass-panel" style={{ height: '110px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', animation: `pulseAnim 1.5s infinite ${i * 0.2}s` }} />
                  ))
                ) : donations.length === 0 ? (
                  <div className="glass-panel" style={{ padding: '3rem 1.5rem', textAlign: 'center', borderRadius: '16px', background: 'rgba(255,255,255,0.01)' }}>
                    {/* SVG illustration */}
                    <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: '2px dashed rgba(64,192,87,0.2)', borderRadius: '50%', animation: 'spin 10s linear infinite' }}></div>
                      <CookingPot size={40} color="var(--primary-color)" style={{ opacity: 0.8 }} />
                    </div>
                    <p style={{ margin: 0, fontWeight: 700, color: 'white', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Radar is clear</p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>We'll notify you're the second fresh surplus food is listed within 5km.</p>
                  </div>
                ) : (
                  donations.map((d, i) => (
                    <motion.div key={d.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }}
                      className="glass-panel hover-lift" style={{ padding: '1.1rem 1.25rem', position: 'relative', overflow: 'hidden', borderRadius: '14px' }}>

                      {/* Left accent bar */}
                      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '3px', background: 'var(--secondary-color)', borderRadius: '3px 0 0 3px' }} />

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                        <div style={{ flex: 1, paddingLeft: '0.25rem' }}>
                          <h3 style={{ margin: 0, fontSize: '1rem', color: 'white', lineHeight: 1.3, fontWeight: 700 }}>{d.title}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{d.donor?.name || 'Local Entity'}</span>
                            {d.donor?.trustScore?.count > 0 && (
                              <span style={{ background: 'rgba(252,196,25,0.12)', color: '#fcc419', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700 }}>
                                ★ {d.donor.trustScore.avg}
                              </span>
                            )}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.18rem 0.45rem', background: 'rgba(64,192,87,0.1)', color: 'var(--secondary-color)', borderRadius: '4px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                          {d.status}
                        </span>
                      </div>

                      <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {d.description}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.6rem' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={11} />
                            {new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {d.expiresAt && d.status === 'AVAILABLE' && (
                             <span style={{ color: '#ff6b6b', fontWeight: 700 }}>
                               Ends: {new Date(d.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </span>
                          )}
                        </div>
                        <Link href="/dashboard" style={{ fontSize: '0.78rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', fontWeight: 700 }}>
                          Claim <ArrowRight size={13} />
                        </Link>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div key="stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                {[
                  { label: 'Active Food Drops', value: donations.length, icon: <Package size={24} />, color: 'var(--secondary-color)', bg: 'rgba(64,192,87,0.08)' },
                  { label: 'Unique Donors Active', value: totalDonors, icon: <Users size={24} />, color: 'var(--primary-color)', bg: 'rgba(255,107,107,0.08)' },
                  { label: 'Rated Donors', value: donations.filter(d => d.donor?.trustScore?.count > 0).length, icon: <Star size={24} />, color: '#fcc419', bg: 'rgba(252,196,25,0.08)' },
                ].map(stat => (
                  <div key={stat.label} className="glass-panel" style={{ padding: '1.25rem', borderRadius: '14px', background: stat.bg, border: `1px solid ${stat.bg}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ color: stat.color }}>{stat.icon}</div>
                      <div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: stat.color, lineHeight: 1 }}>{loading ? '…' : stat.value}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{stat.label}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Tip card */}
                <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '14px' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <TrendingUp size={20} color="var(--primary-color)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                    <div>
                      <p style={{ margin: '0 0 0.4rem 0', fontWeight: 600, color: 'white', fontSize: '0.9rem' }}>How the map works</p>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        Each pin represents a food drop. Click to see details and claim directly. Donors with a gold ★ badge are community-verified.
                      </p>
                    </div>
                  </div>
                </div>

                <Link href="/dashboard" className="btn-primary" style={{ textAlign: 'center', padding: '0.85rem', borderRadius: '12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  Go to Dashboard <ArrowRight size={16} />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @keyframes pulseAnim { 0%,100% { opacity:0.4; } 50% { opacity:0.7; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes radarRingPulse { 0% { opacity: 0.7; transform: scale(0.8); } 100% { opacity: 0; transform: scale(2); } }
        @keyframes radarBeam { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        @media (max-width: 900px) {
          .map-layout-wrapper { flex-direction: column !important; height: auto !important; }
          .map-sidebar-content { width: 100% !important; max-height: 500px !important; }
        }
      `}</style>
    </div>
  );
}
