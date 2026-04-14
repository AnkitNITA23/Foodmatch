"use client";

import { useState, useEffect } from "react";
import { Plus, PackageCheck, Loader2, ArrowRight, UserCheck, Utensils, HeartHandshake, Download, ShieldCheck } from "lucide-react";

export default function DonorDashboard() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [donations, setDonations] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [pinInputs, setPinInputs] = useState<{[key: string]: string}>({});
  const [expiryHours, setExpiryHours] = useState<number>(4); // Default 4 hours

  const fetchDonations = async () => {
    try {
      const res = await fetch('/api/donations');
      if (res.ok) {
        const data = await res.json();
        setDonations(data);
      }
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const createListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    setLoading(true);
    try {
      const expDate = new Date();
      expDate.setHours(expDate.getHours() + expiryHours);

      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          description: desc,
          expiresAt: expDate.toISOString()
        })
      });
      if (res.ok) {
        setTitle('');
        setDesc('');
        fetchDonations();
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyPin = async (id: string) => {
    const pin = pinInputs[id];
    if (!pin || pin.length !== 4) return alert("Please enter the 4-digit PIN.");

    try {
      const res = await fetch(`/api/donations/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      if (res.ok) {
        alert("Verification successful! Item officially marked as picked up.");
        fetchDonations();
      } else {
        const error = await res.json();
        alert(`Verification failed: ${error.error}`);
      }
    } catch(e) {
      alert("Error verifying.");
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Title', 'Status', 'Date Listed', 'Claimer Name', 'Completed At'];
    const rows = donations.map(d => [
      d.id, 
      `"${d.title.replace(/"/g, '""')}"`, 
      d.status, 
      new Date(d.createdAt).toISOString(),
      d.claimer ? `"${(d.claimer.name || d.claimer.email).replace(/"/g, '""')}"` : 'None',
      d.completedAt ? new Date(d.completedAt).toISOString() : 'Pending'
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + '\n' 
      + rows.map(r => r.join(',')).join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `foodmatch_impact_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalDonations = donations.length;
  const totalCompleted = donations.filter(d => d.status === 'COMPLETED').length;
  const activeDonations = donations.filter(d => d.status === 'AVAILABLE').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Impact Stats Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          My Impact
        </h2>
        <button onClick={exportCSV} className="btn-secondary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <Download size={16} /> Export CSV Report
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '4px solid var(--primary-color)' }}>
          <div style={{ padding: '0.8rem', background: 'rgba(255, 107, 107, 0.15)', color: 'var(--primary-color)', borderRadius: '12px' }}>
            <Utensils size={24} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Listings</h4>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '1.5rem', fontWeight: 700 }}>{fetching ? '-' : totalDonations}</p>
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '4px solid var(--secondary-color)' }}>
          <div style={{ padding: '0.8rem', background: 'rgba(64, 192, 87, 0.15)', color: 'var(--secondary-color)', borderRadius: '12px' }}>
            <HeartHandshake size={24} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Successfully Picked Up</h4>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '1.5rem', fontWeight: 700 }}>{fetching ? '-' : totalCompleted}</p>
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '4px solid #fcc419' }}>
          <div style={{ padding: '0.8rem', background: 'rgba(252, 196, 25, 0.15)', color: '#fcc419', borderRadius: '12px' }}>
            <PackageCheck size={24} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Active Right Now</h4>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '1.5rem', fontWeight: 700 }}>{fetching ? '-' : activeDonations}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Create Listing Form */}
        <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus color="var(--primary-color)"/> Post Food
          </h3>
          <form onSubmit={createListing} className="animate-fade-in">
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Food Quantity / Type</label>
              <input 
                required
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. 5x Fresh Margerita Pizzas"
                style={{ width: '100%', padding: '0.9rem', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', transition: 'border 0.2s' }} 
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                How long is it available?
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[2, 4, 8, 24].map(h => (
                  <button 
                    key={h}
                    type="button"
                    onClick={() => setExpiryHours(h)}
                    style={{ 
                      flex: 1, 
                      padding: '0.6rem', 
                      borderRadius: '8px', 
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: expiryHours === h ? 'rgba(255, 107, 107, 0.2)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${expiryHours === h ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)'}`,
                      color: expiryHours === h ? 'white' : 'var(--text-muted)'
                    }}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="btn-primary flex-center hover-lift" style={{ width: '100%', gap: '0.5rem' }} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <><Plus size={18}/> Post Donation</>}
            </button>
          </form>
        </div>

        {/* Existing Listings */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            My Active Donations
          </h3>
          
          <div className="glass-panel list-container animate-fade-in" style={{ height: 'fit-content' }}>
            {fetching ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="list-item" style={{ height: '80px', animation: 'pulse 1.5s infinite' }} />
                <div className="list-item" style={{ height: '80px', animation: 'pulse 1.5s infinite' }} />
              </div>
            ) : donations.length === 0 ? (
              <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <PackageCheck size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                <p style={{ margin: 0 }}>You haven't posted any food donations yet.</p>
                <p style={{ margin: '1.5rem 0 0 0' }}>
                   <span style={{ fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '6px' }}>
                     Items you list will appear here as a streamlined feed
                   </span>
                </p>
              </div>
            ) : (
              donations.map((d: any) => (
                <div key={d.id} className="list-item" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="list-item-header">
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', color: 'white' }}>{d.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{d.description}</p>
                    </div>
                    
                    <div style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '6px', 
                      fontSize: '0.7rem', 
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      background: d.status === 'AVAILABLE' ? 'rgba(255, 107, 107, 0.1)' : d.status === 'CLAIMED' ? 'rgba(252, 196, 25, 0.1)' : 'rgba(64, 192, 87, 0.1)',
                      color: d.status === 'AVAILABLE' ? 'var(--primary-color)' : d.status === 'CLAIMED' ? '#fcc419' : 'var(--secondary-color)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      {d.status === 'AVAILABLE' && <div style={{width: 5, height: 5, borderRadius: '50%', background: 'var(--primary-color)', animation: 'pulse 2s infinite'}}/>}
                      {d.status}
                    </div>
                  </div>

                  {/* Meta strip (Time left / Claimer) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {d.expiresAt && d.status === 'AVAILABLE' && (
                        <div style={{ fontSize: '0.75rem', color: '#ff6b6b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Loader2 size={12} className="animate-spin" /> 
                          Ends: {new Date(d.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                      
                      {d.claimer && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                          <UserCheck size={14} color="var(--secondary-color)" />
                          <span style={{ color: 'var(--text-muted)' }}>Claimed by:</span>
                          <strong style={{ color: 'white' }}>{d.claimer.name || d.claimer.email}</strong>
                        </div>
                      )}
                    </div>

                    {d.status === 'CLAIMED' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input 
                          placeholder="4-PIN" 
                          maxLength={4}
                          value={pinInputs[d.id] || ''}
                          onChange={(e) => setPinInputs({...pinInputs, [d.id]: e.target.value})}
                          style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.3rem 0.5rem', borderRadius: '4px', width: '70px', textAlign: 'center', fontSize: '0.85rem' }} 
                        />
                        <button onClick={() => verifyPin(d.id)} className="btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: '4px' }}>Verify</button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
