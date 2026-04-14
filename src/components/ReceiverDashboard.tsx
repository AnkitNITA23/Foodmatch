"use client";

import { useState, useEffect } from "react";
import { Loader2, Bell, Map as MapIcon, Utensils, CheckCircle2, Navigation } from "lucide-react";

export default function ReceiverDashboard() {
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'TODAY'>('ALL');

  const fetchData = async () => {
    try {
      const [donRes, notRes] = await Promise.all([
        fetch('/api/donations'),
        fetch('/api/notifications')
      ]);
      
      if (donRes.ok) setDonations(await donRes.json());
      if (notRes.ok) setNotifications(await notRes.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Mark notifications as read
    fetch('/api/notifications', { method: 'PUT' });
    
    // Simple polling for real-time feel since no websockets
    const int = setInterval(fetchData, 10000);
    return () => clearInterval(int);
  }, []);

  const claimFood = async (id: string) => {
    const res = await fetch(`/api/donations/${id}/claim`, { method: 'POST' });
    if (res.ok) {
      alert("Successfully claimed! Please coordinate pickup.");
      fetchData();
    } else {
      const txt = await res.text();
      alert("Could not claim: " + txt);
    }
  };

  const [ratings, setRatings] = useState<{[key: string]: number}>({});
  const [feedbacks, setFeedbacks] = useState<{[key: string]: string}>({});

  const submitRating = async (id: string) => {
    const r = ratings[id];
    if (!r) return alert("Please select a star rating.");
    const f = feedbacks[id] || '';
    
    const res = await fetch(`/api/donations/${id}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: r, feedback: f })
    });
    if (res.ok) {
      alert("Thank you! Your rating has been submitted.");
      fetchData();
    } else {
      const err = await res.json();
      alert(`Could not submit rating: ${err.error || 'Unknown error'}`);
    }
  };

  const filteredDonations = donations.filter(d => {
    if (filter === 'TODAY') {
      const today = new Date();
      const listed = new Date(d.createdAt);
      return listed.getDate() === today.getDate() && listed.getMonth() === today.getMonth();
    }
    return true;
  });

  return (
    <div className="dashboard-grid">
      
      {/* Alerts Feed */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ padding: '0.5rem', background: 'rgba(255,107,107,0.1)', color: 'var(--primary-color)', borderRadius: '10px' }}><Bell size={20} /></div>
          Alerts Feed
        </h3>
        
        <div className="glass-panel list-container animate-fade-in">
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="list-item" style={{ height: '60px', animation: 'pulse 1.5s infinite' }} />
              <div className="list-item" style={{ height: '60px', animation: 'pulse 1.5s infinite' }} />
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Bell size={32} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p style={{ margin: 0 }}>No new alerts right now.</p>
            </div>
          ) : (
            notifications.slice(0, 5).map((n: any) => (
              <div key={n.id} className="list-item" style={{ position: 'relative' }}>
                {!n.read && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: 'var(--primary-color)' }} />}
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', lineHeight: 1.4, color: 'white' }}>{n.message}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Bell size={10}/>
                  <span>{new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Available Food */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(64,192,87,0.1)', color: 'var(--secondary-color)', borderRadius: '10px' }}><MapIcon size={20} /></div>
            Nearby Drops (&lt;5km)
          </h3>
          
          <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem', borderRadius: '8px' }}>
            <button 
              onClick={() => setFilter('ALL')}
              style={{ background: filter === 'ALL' ? 'var(--surface-color)' : 'transparent', color: filter === 'ALL' ? 'white' : 'var(--text-muted)', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
              All
            </button>
            <button 
              onClick={() => setFilter('TODAY')}
              style={{ background: filter === 'TODAY' ? 'var(--surface-color)' : 'transparent', color: filter === 'TODAY' ? 'white' : 'var(--text-muted)', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
              Today
            </button>
          </div>
        </div>
        
        <div className="glass-panel list-container animate-fade-in" style={{ height: 'fit-content' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="list-item" style={{ height: '100px', animation: 'pulse 1.5s infinite' }} />
              <div className="list-item" style={{ height: '100px', animation: 'pulse 1.5s infinite' }} />
            </div>
          ) : filteredDonations.length === 0 ? (
            <div style={{ padding: '5rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
               <Navigation size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.3 }} />
               <h4 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>{filter === 'TODAY' ? "Nothing added today" : "No food nearby"}</h4>
               <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>We'll notify you as soon as someone lists food within 5km.</p>
            </div>
          ) : (
            filteredDonations.map((d: any) => (
              <div key={d.id} className="list-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: 'var(--primary-color)' }}>{d.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Utensils size={12}/> {d.donor?.name || 'Local Donor'}
                        {d.donor?.trustScore?.count > 0 && (
                          <span style={{ marginLeft: '0.4rem', color: '#fcc419', fontWeight: 700 }}>★ {d.donor.trustScore.avg}</span>
                        )}
                      </span>
                      <span>•</span>
                      <span>{new Date(d.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      {d.expiresAt && d.status === 'AVAILABLE' && (
                        <>
                          <span>•</span>
                          <span style={{ color: '#ff6b6b', fontWeight: 700 }}>Ends: {new Date(d.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {d.status === 'AVAILABLE' && (
                    <button className="btn-secondary" onClick={() => claimFood(d.id)} style={{ color: 'var(--secondary-color)', borderColor: 'rgba(64,192,87,0.3)', padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '6px' }}>
                      Claim Food
                    </button>
                  )}
                </div>
                
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>{d.description}</p>
                
                {d.status === 'CLAIMED' && d.pickupPin && (
                  <div style={{ background: 'rgba(252, 196, 25, 0.05)', border: '1px dashed rgba(252, 196, 25, 0.3)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 0.4rem 0', color: '#fcc419', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Pickup PIN</p>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', letterSpacing: '6px', color: 'white', fontFamily: 'monospace' }}>{d.pickupPin}</h2>
                  </div>
                )}

                {d.status === 'COMPLETED' && (
                  <div style={{ marginTop: '0.5rem', background: 'rgba(64, 192, 87, 0.05)', border: '1px solid rgba(64, 192, 87, 0.2)', padding: '1.5rem', borderRadius: '12px' }}>
                    <p style={{ margin: '0 0 1rem 0', color: 'var(--secondary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                      <CheckCircle2 size={20}/> Pickup Completed!
                    </p>
                    
                    {!d.rating ? (
                      <div style={{ background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '8px', marginTop: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>How was the pickup?</h4>
                        <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Leave a rating to help build community trust.</p>
                        
                        {/* Star Rating */}
                        <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1rem' }}>
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              onClick={() => setRatings({...ratings, [d.id]: star})}
                              style={{ 
                                background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, 
                                fontSize: '1.5rem', color: (ratings[d.id] || 0) >= star ? '#fcc419' : 'rgba(255,255,255,0.1)',
                                transition: 'color 0.2s'
                              }}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                        
                        {/* Feedback Input */}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input 
                            placeholder="Optional feedback (e.g. Friendly staff!)" 
                            value={feedbacks[d.id] || ''}
                            onChange={e => setFeedbacks({...feedbacks, [d.id]: e.target.value})}
                            style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}
                          />
                          <button onClick={() => submitRating(d.id)} className="btn-primary" style={{ padding: '0 1rem', fontSize: '0.85rem' }}>Submit</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', color: '#fcc419', fontSize: '1.1rem' }}>
                          {'★'.repeat(d.rating)}{'☆'.repeat(5 - d.rating)}
                        </div>
                        <span style={{ color: 'white', fontSize: '0.9rem', fontStyle: 'italic' }}>"{d.feedback || 'No comment provided'}"</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
