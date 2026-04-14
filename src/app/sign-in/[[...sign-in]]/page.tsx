import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import styles from "../../auth.module.css";
import { HeartHandshake, Sparkles } from "lucide-react";

export default function Page() {
  return (
    <div className={styles.authContainer}>
      <div className={styles.visualSection}>
        <div className={`${styles.floatingOrb} ${styles.orb1}`}></div>
        <div className={`${styles.floatingOrb} ${styles.orb2}`}></div>
        
        <div className={styles.visualContent}>
          <div className={styles.badge}>
            <Sparkles size={16} /> Welcome Back
          </div>
          <h1 className={styles.visualTitle}>
            Continue your <br /><span className="text-gradient">impact journey.</span>
          </h1>
          <p className={styles.visualSubtitle}>
            Access your FoodMatch dashboard to manage active donations, connect with local receivers, and track your ongoing footprint in eliminating food waste.
          </p>

          <div className={styles.testimonialCard}>
            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ padding: '0.6rem', background: 'rgba(64, 192, 87, 0.15)', color: 'var(--secondary-color)', borderRadius: '12px' }}>
                <HeartHandshake size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.95rem' }}>Local Hero Protocol</h4>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>Community Verification</p>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
              "Since logging our surplus meals on FoodMatch, we've successfully routed 100% of our excess inventory to nearby shelters within minutes."
            </p>
          </div>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <div style={{ animation: 'fadeIn 0.6s ease-out forwards', width: '100%', maxWidth: '400px', display: 'flex', justifyContent: 'center' }}>
          <SignIn 
            path="/sign-in" 
            routing="path" 
            signUpUrl="/sign-up" 
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
