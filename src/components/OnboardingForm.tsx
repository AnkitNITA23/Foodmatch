"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, MapPin, Loader2, LocateFixed } from "lucide-react";

export default function OnboardingForm() {
  const router = useRouter();
  const [role, setRole] = useState<'DONOR' | 'RECEIVER'>('RECEIVER');
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const requestLocation = () => {
    setLocating(true);
    setError("");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocating(false);
        },
        (err) => {
          setError(err.message + ". Please allow location access to continue.");
          setLocating(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setLocating(false);
    }
  };

  const completeOnboarding = async () => {
    if (!coords) {
      setError("Please provide your location first before completing setup.");
      return;
    }
    
    setSaving(true);
    setError("");
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, lat: coords.lat, lng: coords.lng })
      });
      if (res.ok) {
        // Full page reload forces the client dashboard to re-fetch user state
        window.location.href = '/dashboard';
      } else {
        const text = await res.text();
        console.error('Save failed:', text);
        setError("Failed to save profile. Try again.");
      }
    } catch (e) {
      console.error('Network error:', e);
      setError("Network error. Check your connection.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '500px', margin: '4rem auto', padding: '2.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Sparkles size={32} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
        <h2>Welcome to FoodMatch</h2>
        <p style={{ color: 'var(--text-muted)' }}>Let's get your profile set up so we can match you locally within a 5km radius.</p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>How will you use the platform?</h4>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            type="button" 
            onClick={() => setRole('RECEIVER')}
            style={{ 
              flex: 1, 
              padding: '1rem', 
              background: role === 'RECEIVER' ? 'rgba(64, 192, 87, 0.2)' : 'transparent',
              border: `1px solid ${role === 'RECEIVER' ? 'var(--secondary-color)' : 'var(--surface-color-border)'}`,
              borderRadius: '12px',
              color: 'var(--text-main)',
              cursor: 'pointer'
            }}
          >
            I need food
          </button>
          <button 
            type="button" 
            onClick={() => setRole('DONOR')}
            style={{ 
              flex: 1, 
              padding: '1rem', 
              background: role === 'DONOR' ? 'rgba(255, 107, 107, 0.2)' : 'transparent',
              border: `1px solid ${role === 'DONOR' ? 'var(--primary-color)' : 'var(--surface-color-border)'}`,
              borderRadius: '12px',
              color: 'var(--text-main)',
              cursor: 'pointer'
            }}
          >
            I want to donate
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>Location Access</h4>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          We use HTML5 Geolocation to securely match donors with receivers nearby.
        </p>
        
        {!coords ? (
          <button className="btn-secondary" onClick={requestLocation} disabled={locating} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            {locating ? <Loader2 className="animate-spin" /> : <LocateFixed />}
            Provide Location Permit
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary-color)', padding: '1rem', background: 'rgba(64,192,87,0.1)', borderRadius: '12px' }}>
            <MapPin size={20} /> Coordinates Acquired Successfully
          </div>
        )}
        {error && <p style={{ color: 'var(--primary-color)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{error}</p>}
      </div>

      <button 
        className="btn-primary" 
        style={{ width: '100%', opacity: (!coords || saving) ? 0.6 : 1 }} 
        onClick={completeOnboarding} 
        disabled={saving}
      >
        {saving ? 'Setting up your profile...' : !coords ? 'Provide Location First' : 'Complete Setup →'}
      </button>
    </div>
  );
}
