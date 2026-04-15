"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { MapPin, Zap, ArrowRight, HeartHandshake, Navigation, Route, ShieldCheck, Star, Pizza, Leaf } from "lucide-react";
import { motion, useScroll, useTransform, Variants, useAnimationControls } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// Module-level flag: persists in JS memory across SPA navigations
let heroHasAnimated = false;

export default function Home() {
  const containerRef = useRef(null);
  const heroControls = useAnimationControls();
  
  // Force browser to physically snap to top on refresh
  const [stats, setStats] = useState({ successfulPickups: 0, lbsFoodSaved: 0, co2Offset: 0 });

  useEffect(() => {
    // ALWAYS override browser hash scroll — we control when and how we scroll
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    // Fetch global impact stats
    fetch('/api/stats').then(res => res.json()).then(data => {
      if (data.successfulPickups !== undefined) setStats(data);
    }).catch(console.error);

    // After hydration: animate in (first visit) or snap to visible (return visit)
    const isFirstVisit = !heroHasAnimated;
    if (isFirstVisit) {
       heroHasAnimated = true;
       heroControls.start("show");
    } else {
       heroControls.set("show");
    }

    // If there's a hash (e.g. /#features), wait for animations to settle THEN scroll
    const hash = window.location.hash;
    if (hash) {
      const delay = isFirstVisit ? 750 : 120; // first load: wait for stagger; return: snap fast
      const timer = setTimeout(() => {
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }, delay);
      return () => clearTimeout(timer);
    }
  }, []);

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
          initial={heroHasAnimated ? "show" : "hidden"}
          animate={heroControls}
        >
          <motion.div variants={itemFadeUp} className={styles.badge}>
            <span className={styles.pulseDot}></span>
            Live 5km Geo-Matching Engine
          </motion.div>
          
          <motion.h1 variants={itemFadeUp} className={styles.title}>
            <span style={{ display: 'block', marginBottom: '0.2rem' }}>Share surplus food,</span>
            <span className="text-gradient" style={{ display: 'block' }}>build community.</span>
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

          {stats.successfulPickups > 0 && (
            <motion.div variants={itemFadeUp} style={{ marginTop: '2.5rem', background: 'rgba(64, 192, 87, 0.1)', border: '1px solid rgba(64, 192, 87, 0.2)', padding: '1.2rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--secondary-color)', padding: '0.8rem', borderRadius: '50%', display: 'flex' }}>
                <HeartHandshake size={24} color="white"/>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Impact Ticker</p>
                <h4 style={{ margin: '0.2rem 0 0 0', fontSize: '1.2rem', color: 'white' }}>
                  {stats.successfulPickups} meals rescued • {stats.co2Offset} lbs CO₂ offset
                </h4>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Compact Radar — visible on mobile/tablet only */}
        <div className={styles.heroVisualMobile}>
          <div className={styles.mapNodeCore}>
            <div className={styles.radarPulse}></div>
            <div className={styles.radarPulse} style={{ animationDelay: '1.5s' }}></div>
            <Navigation className={styles.coreIcon} size={22} />
          </div>
          <div className={styles.ring1}></div>
          <div className={styles.ring2}></div>
        </div>

        {/* Mesmerizing Hero Visual — desktop only */}
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
              <div className={styles.avatar}>
                <Pizza size={24} color="var(--primary-color)" />
              </div>
              <div>
                <p className={styles.cardTitle}>Fresh Pizza Pack</p>
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
              <div className={styles.avatar}>
                <Leaf size={24} color="var(--secondary-color)" />
              </div>
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

        <div className={`container ${styles.featuresGrid}`}>
          <div className={`glass-panel ${styles.featureCard} hover-lift animate-fade-in`} style={{ animationDelay: '0s' }}>
            <div className={styles.featureIconWrapper} style={{ background: 'rgba(64, 192, 87, 0.1)' }}>
              <MapPin className={styles.featureIcon} style={{ color: 'var(--secondary-color)' }} />
            </div>
            <h3 className={styles.featureTitle}>Hyper-Local Matching</h3>
            <p className={styles.featureText}>
              Algorithmically maps to receivers within a 5km radius ensuring food stays hot and fresh without long transit times.
            </p>
          </div>
          
          <div className={`glass-panel ${styles.featureCard} hover-lift animate-fade-in`} style={{ animationDelay: '0.15s' }}>
            <div className={styles.featureIconWrapper} style={{ background: 'rgba(255, 107, 107, 0.1)' }}>
              <Zap className={styles.featureIcon} style={{ color: 'var(--primary-color)' }} />
            </div>
            <h3 className={styles.featureTitle}>Instant Notifications</h3>
            <p className={styles.featureText}>
              Receivers get real-time pings the second a donation drops in their zone. Claim it with one tap.
            </p>
          </div>
          
          <div className={`glass-panel ${styles.featureCard} hover-lift animate-fade-in`} style={{ animationDelay: '0.3s' }}>
            <div className={styles.featureIconWrapper} style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
              <HeartHandshake className={styles.featureIcon} style={{ color: '#a855f7' }} />
            </div>
            <h3 className={styles.featureTitle}>Community First</h3>
            <p className={styles.featureText}>
              Direct peer-to-peer exchanges build stronger neighborhoods and tackle food insecurity organically.
            </p>
          </div>
        </div>
      </section>
      <section id="testimonials" className={styles.testimonialsSection}>
        <div className={styles.sectionHeader}>
          <h2>Trusted by the <span className="text-gradient">Community</span></h2>
          <p>Real stories from people making a difference every day.</p>
        </div>

        <div className={`container ${styles.testimonialsGrid}`}>
          {/* Testimonial 1 */}
          <div className={`glass-panel hover-lift ${styles.testimonialCard}`}>
            <span className={styles.quoteIcon}>"</span>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <p className={styles.testimonialText}>
              "We used to throw away so much unsold bread at closing time. Now, we just tap a button on FoodMatch and within 10 minutes, someone from the neighborhood comes by to pick it up. It's truly magical."
            </p>
            <div className={styles.testimonialAuthor}>
              <img src="https://i.pravatar.cc/150?img=68" alt="Sarah J." className={styles.authorAvatar} />
              <div className={styles.authorInfo}>
                <h4>Sarah Jenkins</h4>
                <p>Local Bakery Owner (Donor)</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className={`glass-panel hover-lift ${styles.testimonialCard}`}>
            <span className={styles.quoteIcon}>"</span>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <p className={styles.testimonialText}>
              "As a college student on a tight budget, the instant notifications have been a lifesaver. I always know exactly what food is safe to eat because of the community rating system. Highly recommended!"
            </p>
            <div className={styles.testimonialAuthor}>
              <img src="https://i.pravatar.cc/150?img=33" alt="Marcus T." className={styles.authorAvatar} />
              <div className={styles.authorInfo}>
                <h4>Marcus T.</h4>
                <p>Student (Receiver)</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className={`glass-panel hover-lift ${styles.testimonialCard}`}>
            <span className={styles.quoteIcon}>"</span>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <p className={styles.testimonialText}>
              "I love how I can see exactly who I am donating to. The secure PIN system means I don't have to worry about random people showing up at the restaurant. It's safe, secure, and incredibly fast."
            </p>
            <div className={styles.testimonialAuthor}>
              <img src="https://i.pravatar.cc/150?img=11" alt="David Chen" className={styles.authorAvatar} />
              <div className={styles.authorInfo}>
                <h4>David Chen</h4>
                <p>Restaurant Manager (Donor)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
