import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  // Basic layout for now
  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      <h1 className="text-gradient">Welcome, {user.firstName || 'User'}!</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Manage your food donations and discover nearby food.
      </p>
      
      <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
        <h3>Your Dashboard is under construction.</h3>
        <p>Soon you'll be able to track 5km radius real-time donations here!</p>
      </div>
    </div>
  );
}
