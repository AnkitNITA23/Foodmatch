import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import styles from "../../auth.module.css";
import { ShieldCheck, Sparkles } from "lucide-react";

export default function Page() {
  return (
    <div className={styles.authContainer}>
      <div className={styles.visualSection}>
        <div className={`${styles.floatingOrb} ${styles.orb1}`} style={{ background: 'var(--secondary-color)' }}></div>
        <div className={`${styles.floatingOrb} ${styles.orb2}`} style={{ background: 'var(--primary-color)' }}></div>
        
        <div className={styles.visualContent}>
          <div className={styles.badge}>
            <Sparkles size={16} /> Join the Movement
          </div>
          <h1 className={styles.visualTitle}>
            Turn your surplus into <br /><span className="text-gradient">someone's supper.</span>
          </h1>
          <p className={styles.visualSubtitle}>
            Create your FoodMatch account to start routing food waste directly to communities in need. Connect with local logistics instantly within a 5km radius.
          </p>

          <div className={styles.testimonialCard}>
            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ padding: '0.6rem', background: 'rgba(255, 107, 107, 0.15)', color: 'var(--primary-color)', borderRadius: '12px' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.95rem' }}>Secure & Verified</h4>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>100% Platform Trust</p>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
              "We guarantee the safety and privacy of all our users. Food handlers and receivers are authenticated within the ecosystem."
            </p>
          </div>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <div style={{ animation: 'fadeIn 0.6s ease-out forwards', width: '100%', maxWidth: '400px', display: 'flex', justifyContent: 'center' }}>
          <SignUp 
            path="/sign-up" 
            routing="path" 
            signInUrl="/sign-in" 
            appearance={{ 
              variables: { colorPrimary: '#ff6b6b' },
              elements: { 
                rootBox: { width: '100%' }
              } 
            }} 
          />
        </div>
      </div>
    </div>
  );
}
