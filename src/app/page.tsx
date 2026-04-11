"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { MapPin, Zap, ArrowRight, HeartHandshake, Navigation, Route, ShieldCheck } from "lucide-react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef } from "react";

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yVisual = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacityVisual = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemFadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <section className={styles.hero}>
        <motion.div 
          className={styles.heroContent}
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemFadeUp} className={styles.badge}>
            <span className={styles.pulseDot}></span>
            Live 5km Geo-Matching Engine
          </motion.div>
          
          <motion.h1 variants={itemFadeUp} className={styles.title}>
            Share surplus food, <br />
            <span className="text-gradient">build community.</span>
          </motion.h1>
          
          <motion.p variants={itemFadeUp} className={styles.subtitle}>
            Connect instantly with verified people within a 5km radius. 
            Whether you run a restaurant or just have an extra meal, 
            FoodMatch makes zero-waste living accessible.
          </motion.p>
          
          <motion.div variants={itemFadeUp} className={styles.actions}>
            <Link href="/sign-up" className="btn-primary hover-lift" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', fontSize: '1.125rem' }}>
              Start Donating <ArrowRight size={20} />
            </Link>
            <Link href="/sign-in" className="btn-secondary hover-lift" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
              Find Food Nearby
            </Link>
          </motion.div>
          
          <motion.div variants={itemFadeUp} className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statMain}>100%</span>
              <span className={styles.statLabel}>Free forever</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statMain}>&lt; 5km</span>
              <span className={styles.statLabel}>Hyper-local reach</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statMain}>Real-time</span>
              <span className={styles.statLabel}>Instant alerts</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Mesmerizing Hero Visual */}
        <motion.div 
          className={styles.heroVisual}
          style={{ y: yVisual, opacity: opacityVisual }}
        >
          {/* Central Map Node */}
          <div className={styles.mapNodeCore}>
            <div className={styles.radarPulse}></div>
            <div className={styles.radarPulse} style={{ animationDelay: '1s' }}></div>
            <Navigation className={styles.coreIcon} size={32} />
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.8, type: "spring" }}
            className={`glass-panel ${styles.floatingCard} ${styles.card1}`}
          >
            <div className={styles.cardHeader}>
              <div className={styles.avatar}>🍔</div>
              <div>
                <p className={styles.cardTitle}>Fresh Burger Pack</p>
                <p className={styles.cardSub}>Listed 2 mins ago</p>
              </div>
            </div>
            <div className={styles.cardStatus}>
              <MapPin size={16} color="var(--primary-color)"/> 1.2 km away
              <ShieldCheck size={16} color="var(--secondary-color)" style={{ marginLeft: 'auto' }}/>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: -50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 1.1, type: "spring" }}
            className={`glass-panel ${styles.floatingCard} ${styles.card2}`}
          >
            <div className={styles.cardHeader}>
              <div className={styles.avatar}>🥗</div>
              <div>
                <p className={styles.cardTitle}>Vegan Salad Bowls</p>
                <p className={styles.cardSub}>Listed 5 mins ago</p>
              </div>
            </div>
            <div className={styles.cardStatus}>
              <MapPin size={16} color="var(--primary-color)"/> 3.4 km away
              <Route size={16} color="var(--text-muted)" style={{ marginLeft: 'auto' }}/>
            </div>
          </motion.div>
          
          <div className={styles.ring1}></div>
          <div className={styles.ring2}></div>
          <div className={styles.ring3}></div>
        </motion.div>
      </section>

      <section id="features" className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2>Why Choose <span className="text-gradient">FoodMatch</span>?</h2>
          <p>Our platform handles the logistics so you can focus on making an impact.</p>
        </div>

        <motion.div 
          className={`container ${styles.featuresGrid}`}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={itemFadeUp} className={`glass-panel ${styles.featureCard} hover-lift`}>
            <div className={styles.featureIconWrapper} style={{ background: 'rgba(64, 192, 87, 0.1)' }}>
              <MapPin className={styles.featureIcon} style={{ color: 'var(--secondary-color)' }} />
            </div>
            <h3 className={styles.featureTitle}>Hyper-Local Matching</h3>
            <p className={styles.featureText}>
              Algorithmically maps to receivers within a 5km radius ensuring food stays hot and fresh without long transit times.
            </p>
          </motion.div>
          
          <motion.div variants={itemFadeUp} className={`glass-panel ${styles.featureCard} hover-lift`}>
            <div className={styles.featureIconWrapper} style={{ background: 'rgba(255, 107, 107, 0.1)' }}>
              <Zap className={styles.featureIcon} style={{ color: 'var(--primary-color)' }} />
            </div>
            <h3 className={styles.featureTitle}>Instant Notifications</h3>
            <p className={styles.featureText}>
              Receivers get real-time pings the second a donation drops in their zone. Claim it with one tap.
            </p>
          </motion.div>
          
          <motion.div variants={itemFadeUp} className={`glass-panel ${styles.featureCard} hover-lift`}>
            <div className={styles.featureIconWrapper} style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
              <HeartHandshake className={styles.featureIcon} style={{ color: '#a855f7' }} />
            </div>
            <h3 className={styles.featureTitle}>Community First</h3>
            <p className={styles.featureText}>
              Direct peer-to-peer exchanges build stronger neighborhoods and tackle food insecurity organically.
            </p>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
