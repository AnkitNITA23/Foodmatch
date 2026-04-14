"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import OnboardingForm from "@/components/OnboardingForm";
import DonorDashboard from "@/components/DonorDashboard";
import ReceiverDashboard from "@/components/ReceiverDashboard";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/users');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  let content;

  if (loading) {
    content = <div style={{ textAlign: 'center', margin: '4rem auto' }}><Loader2 className="animate-spin" /></div>;
  } else if (!user || !user.lat || !user.lng) {
    content = <OnboardingForm />;
  } else if (user.role === 'DONOR') {
    content = <DonorDashboard />;
  } else {
    content = <ReceiverDashboard />;
  }

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '4rem' }} className="container animate-fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>
          {user?.role === 'DONOR' ? 'Partner Dashboard' : user?.role === 'RECEIVER' ? 'Community Dashboard' : 'Setup Profile'}
        </h1>
        {user?.name && <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user.name}</p>}
      </div>
      {content}
    </div>
  );
}
