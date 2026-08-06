import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

// Import Assets — Light & Dark variants
import windLight from '../assets/homepage/wind_light.png';
import windDark from '../assets/homepage/wind_dark.png';
import windCardLight from '../assets/homepage/wind_card_light.png';
import windCardDark from '../assets/homepage/wind_card_dark.png';
import solarSunrise from '../assets/homepage/solar_sunrise.png';
import solarSunriseDark from '../assets/homepage/solar_sunrise_dark.png';
import hydroCard from '../assets/homepage/hydro_card.png';
import geothermalCard from '../assets/homepage/geothermal_card.png';
import biomassCard from '../assets/homepage/biomass_card.png';
import tidalCard from '../assets/homepage/tidal_card.png';

export default function Home() {
  const navigate = useNavigate();
  const [logoError, setLogoError] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [headerVisible, setHeaderVisible] = useState(true);

  // Global Theme & Auth Context
  const { darkMode, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();

  const handleAuthAction = (targetPath) => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate(targetPath);
    }
  };

  // Header fade-out on scroll past hero section (~100vh)
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.85;
      setHeaderVisible(window.scrollY < heroHeight);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  /* ── Design Tokens (matching platform CSS vars) ─────── */
  /* Dark mode tokens match Sidebar (#1a1a2e), Topbar (#0f1729), DashboardPage (#16213e) */
  /* Light mode tokens match AuthLayout right panel (#ffffff) */
  const C = darkMode ? {
    pageBg: '#16213e',
    bgDarker: '#0f1729',
    sidebarBg: '#1a1a2e',
    cardBg: '#1e2a4a',
    headerBg: 'rgba(15, 23, 41, 0.85)',
    accentBlue: '#4a90d9',
    accentTeal: '#2dd4bf',
    gradient: 'linear-gradient(135deg, #4a90d9 0%, #2dd4bf 100%)',
    glowBlue: 'rgba(74, 144, 217, 0.35)',
    glowTeal: 'rgba(45, 212, 191, 0.30)',
    textPrimary: '#e8eaf0',
    textSecondary: '#b0b8c9',
    textMuted: '#6b7a99',
    border: 'rgba(255, 255, 255, 0.06)',
    borderLight: 'rgba(255, 255, 255, 0.08)',
    heroOverlay1: 'linear-gradient(to top, #16213e 0%, #16213e99 40%, #16213e66 70%, #16213e40 100%)',
    heroOverlay2: 'linear-gradient(to right, #16213edd 0%, transparent 40%, transparent 60%, #16213edd 100%)',
    imgOverlay: 'linear-gradient(to top, rgba(15, 23, 41, 0.85) 0%, transparent 50%)',
    statCardBg: 'rgba(26, 26, 46, 0.85)',
    predictorBg: '#1a1a2e',
    predictorImgBg: '#0f1729',
    predictorOverlay: 'linear-gradient(to top, rgba(15, 23, 41, 0.9) 0%, rgba(15, 23, 41, 0.2) 60%, transparent 100%)',
  } : {
    pageBg: '#f8fafc',
    bgDarker: '#f1f5f9',
    sidebarBg: '#ffffff',
    cardBg: '#ffffff',
    headerBg: 'rgba(255, 255, 255, 0.85)',
    accentBlue: '#4a90d9',
    accentTeal: '#0d9488',
    gradient: 'linear-gradient(135deg, #4a90d9 0%, #2dd4bf 100%)',
    glowBlue: 'rgba(74, 144, 217, 0.2)',
    glowTeal: 'rgba(45, 212, 191, 0.15)',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    border: '#e2e8f0',
    borderLight: '#e2e8f0',
    heroOverlay1: 'linear-gradient(to top, #f8fafc 0%, #f8fafc99 40%, #f8fafc55 70%, #f8fafc20 100%)',
    heroOverlay2: 'linear-gradient(to right, #f8fafcdd 0%, transparent 40%, transparent 60%, #f8fafcdd 100%)',
    imgOverlay: 'linear-gradient(to top, rgba(248, 250, 252, 0.85) 0%, transparent 50%)',
    statCardBg: 'rgba(255, 255, 255, 0.92)',
    predictorBg: '#ffffff',
    predictorImgBg: '#f1f5f9',
    predictorOverlay: 'linear-gradient(to top, rgba(248, 250, 252, 0.9) 0%, rgba(248, 250, 252, 0.2) 60%, transparent 100%)',
  };

  /* Shared constants */
  const radiusMd = '10px';
  const radiusLg = '16px';
  const easeOut = 'cubic-bezier(0.16, 1, 0.3, 1)';

  const faqs = [
    { q: "What is Swind?", a: "Swind is an AI-powered Environmental Intelligence & Renewable Resource Deployment Platform. It integrates satellite data, Leaflet spatial mapping, and Machine Learning models to assess solar and wind site feasibility in real time." },
    { q: "How accurate are the Solar & Wind prediction models?", a: "Our models utilize Random Forest & XGBoost algorithms trained on high-resolution Global Horizontal Irradiance (GHI), Direct Normal Irradiance (DNI), and 100m hub-height wind velocities, delivering over 92% historical accuracy against ground sensors." },
    { q: "Which APIs and satellite datasets are integrated?", a: "We query live telemetry from the NASA POWER API (Langley Research Center) and Open-Meteo High-Resolution API, alongside OpenStreetMap and Leaflet GIS spatial layers." },
    { q: "Can I export site assessment reports?", a: "Yes! Swind generates instant comprehensive site assessment reports containing annual MWh estimates, capacity factors (%), CO₂ emission offsets, and land suitability scores." },
    { q: "How do candidate site pin-drops work?", a: "Users can click anywhere on the interactive GIS map picker to drop a draggable red pin marker. Swind automatically extracts exact latitude, longitude, and elevation parameters for instant ML model execution." },
  ];

  const predictors = [
    { title: "Hydroelectric Predictor", desc: "Analyse seasonal river discharge, hydraulic head, and streamflow power potential.", img: hydroCard, badge: "Hydro Energy" },
    { title: "Geothermal Analyser", desc: "Subsurface temperature gradient modeling and enthalpy heat flux mapping.", img: geothermalCard, badge: "Thermal Feasibility" },
    { title: "Biomass Intelligence", desc: "Agricultural residue density, bio-energy feedstock mapping, and logistics optimization.", img: biomassCard, badge: "Bio Resources" },
    { title: "Tidal Energy Predictor", desc: "Oceanic current velocity, bathymetry profiling, and kinetic tidal turbine modeling.", img: tidalCard, badge: "Marine Kinetics" },
  ];

  const howItWorks = [
    { step: "01", title: "GIS Pin-Drop Selection", desc: "Drop or drag a marker anywhere on the interactive Leaflet map to register site boundaries and extract spatial coordinates.", icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7v0 M12 7a3 3 0 100 6 3 3 0 000-6z" },
    { step: "02", title: "Satellite Telemetry Fetch", desc: "Queries NASA POWER API & Open-Meteo endpoints for 240+ hourly readings of GHI, DNI, wind vectors, and temperature.", icon: "M4 7V4h16v3 M9 20h6 M12 4v16" },
    { step: "03", title: "Ensemble ML Assessment", desc: "Random Forest & XGBoost models run instant inference to output annual MWh, Capacity Factor %, and 0-100% Suitability.", icon: "M18 20V10 M12 20V4 M6 20v-6" },
  ];

  /* ── Reusable style generators ─────────────────────────── */
  const gradientText = {
    background: C.gradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  /* Sun / Moon SVG toggle icon */
  const sunIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>;
  const moonIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>;

  const primaryBtn = {
    background: C.gradient,
    color: '#ffffff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: radiusMd,
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    boxShadow: `0 4px 20px ${C.glowBlue}`,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: `all 0.2s ${easeOut}`,
  };

  const ghostBtn = {
    background: 'rgba(255, 255, 255, 0.04)',
    color: C.textPrimary,
    border: `1px solid ${C.borderLight}`,
    padding: '0.75rem 1.5rem',
    borderRadius: radiusMd,
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: `all 0.2s ${easeOut}`,
  };

  const sectionPadding = { padding: '6rem 2.5rem', maxWidth: '1200px', margin: '0 auto' };

  return (
    <div style={{ minHeight: '100vh', background: C.pageBg, color: C.textPrimary, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", transition: 'background 0.4s ease, color 0.4s ease' }}>

      {/* ── KEYFRAME ANIMATIONS ──────────────────────────── */}
      <style>{`
        @keyframes homeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes homeFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .home-animate-up { animation: homeSlideUp 0.7s ease-out forwards; }
        .home-animate-up-d1 { animation: homeSlideUp 0.7s ease-out 0.15s forwards; opacity: 0; }
        .home-animate-up-d2 { animation: homeSlideUp 0.7s ease-out 0.3s forwards; opacity: 0; }
        .home-animate-up-d3 { animation: homeSlideUp 0.7s ease-out 0.45s forwards; opacity: 0; }
        .home-card:hover { transform: translateY(-6px); box-shadow: 0 12px 40px rgba(74, 144, 217, 0.15); }
        .home-nav-link:hover { color: #2dd4bf !important; }
        .home-faq-btn:hover { background: rgba(74, 144, 217, 0.08) !important; }
      `}</style>

      {/* ═══════════════════════════════════════════════════
           FIXED HEADER
         ═══════════════════════════════════════════════════ */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '80px',
        background: C.headerBg,
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2.5rem',
        opacity: headerVisible ? 1 : 0,
        pointerEvents: headerVisible ? 'auto' : 'none',
        transform: headerVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'background 0.4s ease, border-color 0.4s ease, opacity 0.4s ease, transform 0.4s ease',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!logoError ? (
            <img
              src={darkMode ? "/logo.png" : "/logo-light.png"}
              alt="Swind"
              style={{ height: '72px', width: 'auto', objectFit: 'contain', transition: 'opacity 0.3s ease' }}
              onError={() => setLogoError(true)}
            />
          ) : (
            <span style={{ ...gradientText, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Swind</span>
          )}
        </Link>

        {/* Center Nav — absolutely centered */}
        <nav style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          {[
            { label: 'About', target: 'about' },
            { label: 'How It Works', target: 'how-it-works' },
            { label: 'Predictors', target: 'predictors' },
            { label: 'FAQ', target: 'faq' },
          ].map(link => (
            <button
              key={link.target}
              className="home-nav-link"
              onClick={() => scrollTo(link.target)}
              style={{ background: 'none', border: 'none', color: C.textSecondary, fontSize: '0.88rem', fontWeight: 500, cursor: 'pointer', transition: 'color 0.15s ease' }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              width: '38px', height: '38px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
              border: `1px solid ${C.borderLight}`,
              color: darkMode ? '#eab308' : '#64748b',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={e => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}
            onMouseOut={e => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
          >
            {darkMode ? sunIcon : moonIcon}
          </button>

          <button
            onClick={() => handleAuthAction('/login')}
            style={{ background: 'none', border: 'none', color: C.textSecondary, fontSize: '0.88rem', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', transition: 'color 0.15s ease' }}
            onMouseOver={e => e.currentTarget.style.color = C.textPrimary}
            onMouseOut={e => e.currentTarget.style.color = C.textSecondary}
          >
            Sign In
          </button>
          <button
            onClick={() => handleAuthAction('/signup')}
            style={{ ...primaryBtn, padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Join Us'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════
           SECTION 1 — HERO (WIND RESOURCE)
         ═══════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingTop: '68px' }}>
        {/* Background — Cross-fade between light and dark hero images */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img src={windLight} alt="Wind Turbine Light" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', position: 'absolute', inset: 0, opacity: darkMode ? 0 : 1, transition: 'opacity 0.7s ease' }} />
          <img src={windDark} alt="Wind Turbine Dark" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', position: 'absolute', inset: 0, opacity: darkMode ? 1 : 0, transition: 'opacity 0.7s ease' }} />
          <div style={{ position: 'absolute', inset: 0, background: C.heroOverlay1, transition: 'background 0.5s ease' }} />
          <div style={{ position: 'absolute', inset: 0, background: C.heroOverlay2, transition: 'background 0.5s ease' }} />
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px', textAlign: 'center', padding: '3rem 2rem' }}>
          {/* Pill */}
          <div className="home-animate-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.4rem 1rem', borderRadius: '9999px', background: 'rgba(74, 144, 217, 0.1)', border: `1px solid rgba(74, 144, 217, 0.25)`, color: C.accentTeal, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1.75rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            Next-Gen Environmental Intelligence
          </div>

          {/* Headline */}
          <h1 className="home-animate-up-d1" style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
            Renewable Energy Deployment{' '}
            <span style={gradientText}>Intelligence</span>
          </h1>

          {/* Sub */}
          <p className="home-animate-up-d2" style={{ fontSize: '1.1rem', lineHeight: 1.7, color: C.textSecondary, maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Assess spatial wind speeds, elevation profiles, and site feasibility in real-time with satellite telemetry and ensemble machine learning models.
          </p>

          {/* CTAs */}
          <div className="home-animate-up-d3" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => handleAuthAction('/signup')} style={primaryBtn}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {isAuthenticated ? 'Open Dashboard' : 'Get Started Free'}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </button>
            <button onClick={() => scrollTo('how-it-works')} style={ghostBtn}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
            >
              Explore Platform
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
           SECTION 2A — SOLAR YIELD & CAPACITY PREDICTION
         ═══════════════════════════════════════════════════ */}
      <section id="about" style={{ ...sectionPadding, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', alignItems: 'center' }}>
        {/* Left Text */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.3rem 0.75rem', borderRadius: '6px', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.25)', color: '#eab308', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            Solar Intelligence Engine
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Solar Yield & Capacity{' '}
            <span style={{ ...gradientText, background: 'linear-gradient(135deg, #eab308 0%, #f97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Prediction</span>
          </h2>

          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: C.textSecondary, marginBottom: '2rem' }}>
            Predict annual Photovoltaic (PV) power output and grid connection suitability with high-precision machine learning trained on GHI, DNI, and ambient thermal derating factors.
          </p>

          {/* Feature bullets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {[
              "Global Horizontal Irradiance (GHI) & Direct Normal Irradiance (DNI) mapping",
              "Thermal loss coefficient calculation (-0.4%/°C above STC)",
              "Annual MWh generation forecasting & Capacity Factor (%) metrics",
              "Instant CO₂ offset and environmental impact reporting",
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                <span style={{ fontSize: '0.88rem', color: C.textSecondary, fontWeight: 500 }}>{f}</span>
              </div>
            ))}
          </div>

          <button onClick={() => handleAuthAction('/signup')} style={{ ...primaryBtn, background: 'linear-gradient(135deg, #eab308 0%, #f97316 100%)', color: '#0f1729', boxShadow: '0 4px 20px rgba(234, 179, 8, 0.25)' }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Analyze Solar Site
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </button>
        </div>

        {/* Right Image Card — 16:9 Frame with Attached Text Block Below */}
        <div style={{
          background: C.sidebarBg,
          border: `1px solid ${C.borderLight}`,
          borderRadius: radiusLg,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden' }}>
            <img
              src={darkMode ? solarSunriseDark : solarSunrise}
              alt="Solar Sunrise"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', transition: 'opacity 0.5s ease' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 41, 0.6) 0%, transparent 60%)' }} />
          </div>

          <div style={{ padding: '1.25rem', background: C.cardBg, borderTop: `1px solid ${C.borderLight}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#eab308' }}>Solar PV Benchmark</span>
              <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: C.textMuted }}>26.91°N, 75.78°E</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: C.textPrimary }}>5.31 Peak Sun Hours / Day</div>
            <div style={{ fontSize: '0.78rem', color: C.textSecondary, marginTop: '4px' }}>Estimating 33,600+ MWh/year per 50 Hectares</div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
           SECTION 2B — WIND FEASIBILITY ENGINE
         ═══════════════════════════════════════════════════ */}
      <section style={{ ...sectionPadding, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', alignItems: 'center', paddingTop: '2rem' }}>
        {/* Left Image Card — 16:9 Frame with Attached Text Block Below */}
        <div style={{
          background: C.sidebarBg,
          border: `1px solid ${C.borderLight}`,
          borderRadius: radiusLg,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden' }}>
            <img
              src={darkMode ? windCardDark : windCardLight}
              alt="Wind Feasibility Engine"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', transition: 'opacity 0.5s ease' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 41, 0.6) 0%, transparent 60%)' }} />
          </div>

          <div style={{ padding: '1.25rem', background: C.cardBg, borderTop: `1px solid ${C.borderLight}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.accentTeal }}>Wind Energy Benchmark</span>
              <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: C.textMuted }}>100m Hub Height</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: C.textPrimary }}>8.45 m/s Avg Wind Speed • 41.2% Capacity Factor</div>
            <div style={{ fontSize: '0.78rem', color: C.textSecondary, marginTop: '4px' }}>Estimating 48,200+ MWh/year per 10 Wind Turbines</div>
          </div>
        </div>

        {/* Right Text & Details */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.3rem 0.75rem', borderRadius: '6px', background: 'rgba(45, 212, 191, 0.1)', border: '1px solid rgba(45, 212, 191, 0.25)', color: C.accentTeal, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            💨 Wind Feasibility Engine
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Wind Velocity & Site Feasibility{' '}
            <span style={{ ...gradientText }}>Analysis</span>
          </h2>

          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: C.textSecondary, marginBottom: '2rem' }}>
            Assess spatial wind vectors, hub-height Weibull distributions, and aerodynamic power output using satellite telemetry and high-resolution numerical models.
          </p>

          {/* Feature bullets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {[
              "100m Hub-Height Wind Speed & Directional Vectoring",
              "Weibull Shape (k) & Scale (c) Wind Distribution Modeling",
              "Power Curve Generation & Aerodynamic Loss Calculation",
              "Topographic Roughness & Elevation Slope Exclusion Filtering",
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accentTeal} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                <span style={{ fontSize: '0.88rem', color: C.textSecondary, fontWeight: 500 }}>{f}</span>
              </div>
            ))}
          </div>

          <button onClick={() => handleAuthAction('/signup')} style={primaryBtn}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Analyze Wind Site
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
           HOW IT WORKS
         ═══════════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding: '6rem 2.5rem', background: C.bgDarker, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, transition: 'background 0.4s ease' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>How Swind Intelligence Works</h2>
            <p style={{ color: C.textMuted, fontSize: '0.95rem' }}>End-to-end spatial mapping, telemetry ingestion, and machine learning inference pipeline.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {howItWorks.map((card, idx) => (
              <div key={idx} className="home-card" style={{
                background: C.cardBg,
                border: `1px solid ${C.borderLight}`,
                borderRadius: radiusLg,
                padding: '2rem 1.75rem',
                transition: `all 0.25s ${easeOut}`,
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'rgba(74, 144, 217, 0.15)', marginBottom: '0.75rem' }}>{card.step}</div>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accentTeal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}><path d={card.icon} /></svg>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{card.title}</h3>
                <p style={{ fontSize: '0.88rem', lineHeight: 1.65, color: C.textMuted }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
           SECTION 3 — COMING SOON PREDICTORS (2x2)
         ═══════════════════════════════════════════════════ */}
      <section id="predictors" style={sectionPadding}>
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.3rem 0.75rem', borderRadius: '6px', background: 'rgba(74, 144, 217, 0.1)', border: '1px solid rgba(74, 144, 217, 0.25)', color: C.accentTeal, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
            Expanding Predictor Suite
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>Upcoming Renewable Predictors</h2>
          <p style={{ color: C.textMuted, fontSize: '0.95rem' }}>Extending our machine learning engine across multi-vector clean energy domains.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {predictors.map((pred, idx) => (
            <div key={idx} className="home-card" style={{
              background: C.predictorBg,
              border: `1px solid ${C.borderLight}`,
              borderRadius: radiusLg,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'stretch',
              minHeight: '220px',
              transition: `all 0.25s ${easeOut}`,
            }}>
              {/* Image Container on LEFT — Fill Frame 100% (No void space) */}
              <div style={{ position: 'relative', width: '42%', minWidth: '190px', flexShrink: 0, overflow: 'hidden' }}>
                <img
                  src={pred.img}
                  alt={pred.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, rgba(15, 23, 41, 0.4) 100%)' }} />

                {/* Badge Overlay on Image */}
                <div style={{ position: 'absolute', bottom: '0.85rem', left: '0.85rem', zIndex: 3, padding: '0.25rem 0.6rem', borderRadius: '4px', background: 'rgba(15, 23, 41, 0.75)', backdropFilter: 'blur(6px)', fontSize: '0.65rem', fontWeight: 700, color: '#2dd4bf', letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid rgba(45, 212, 191, 0.25)' }}>
                  {pred.badge}
                </div>
              </div>

              {/* Content Container on RIGHT — Title on top right, Description under */}
              <div style={{ padding: '1.35rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  {/* Top Header Row with Title & Coming Soon Pill */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '0.6rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: C.textPrimary, margin: 0, lineHeight: 1.25 }}>
                      {pred.title}
                    </h3>
                    <span style={{ padding: '0.25rem 0.6rem', borderRadius: '9999px', background: 'rgba(74, 144, 217, 0.12)', border: '1px solid rgba(74, 144, 217, 0.3)', color: C.accentTeal, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0 }}>
                      Coming Soon
                    </span>
                  </div>

                  {/* Description directly under Title */}
                  <p style={{ fontSize: '0.86rem', lineHeight: 1.6, color: C.textMuted, margin: 0 }}>
                    {pred.desc}
                  </p>
                </div>

                {/* Status Indicator at bottom */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 700, color: C.accentTeal, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '1rem' }}>
                  In Active R&D
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.accentTeal, display: 'inline-block', animation: 'homeFadeIn 1s ease infinite alternate' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
           SECTION 4 — FAQ ACCORDION
         ═══════════════════════════════════════════════════ */}
      <section id="faq" style={{ padding: '6rem 2.5rem', background: C.bgDarker, borderTop: `1px solid ${C.border}`, transition: 'background 0.4s ease' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>Frequently Asked Questions</h2>
            <p style={{ color: C.textMuted, fontSize: '0.95rem' }}>Everything you need to know about Swind data ingestion, ML models, and reports.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((faq, idx) => (
              <div key={idx} style={{ borderRadius: radiusMd, border: `1px solid ${C.borderLight}`, background: C.cardBg, overflow: 'hidden', transition: 'background 0.4s ease' }}>
                <button
                  className="home-faq-btn"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  style={{ width: '100%', padding: '1.15rem 1.5rem', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', background: 'none', border: 'none', color: C.textPrimary, fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s ease' }}
                >
                  <span>{faq.q}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accentTeal} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transition: 'transform 0.2s ease', transform: activeFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)' }}><polyline points="6 9 12 15 18 9" /></svg>
                </button>

                {activeFaq === idx && (
                  <div style={{ padding: '0 1.5rem 1.25rem', fontSize: '0.88rem', lineHeight: 1.7, color: C.textSecondary, borderTop: `1px solid ${C.border}`, paddingTop: '1rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
           SECTION 5 — ENTERPRISE FOOTER
         ═══════════════════════════════════════════════════ */}
      <footer style={{ background: '#1a1a2e', borderTop: '1px solid rgba(255, 255, 255, 0.06)', padding: '4rem 2.5rem 3rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: '2.5rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <div>
            <span style={{ ...gradientText, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', display: 'inline-block', marginBottom: '0.75rem' }}>Swind</span>
            <p style={{ fontSize: '0.82rem', color: '#6b7a99', lineHeight: 1.65, marginBottom: '1rem' }}>AI & GIS powered Environmental Intelligence Engine for Solar & Wind Deployment.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#22c55e', fontWeight: 600 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              All Telemetry Systems Operational
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#e8eaf0', marginBottom: '1rem' }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {['Solar PV Prediction', 'Wind Feasibility Engine', 'Leaflet GIS Mapping', 'Future Predictor Suite'].map(l => (
                <a key={l} href="#about" style={{ fontSize: '0.82rem', color: '#6b7a99', textDecoration: 'none', transition: 'color 0.15s ease' }}
                  onMouseOver={e => e.currentTarget.style.color = '#2dd4bf'}
                  onMouseOut={e => e.currentTarget.style.color = '#6b7a99'}
                >{l}</a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#e8eaf0', marginBottom: '1rem' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {['About Us', 'Careers', 'Environmental Impact', 'Brand Assets'].map(l => (
                <a key={l} href="#about" style={{ fontSize: '0.82rem', color: '#6b7a99', textDecoration: 'none', transition: 'color 0.15s ease' }}
                  onMouseOver={e => e.currentTarget.style.color = '#2dd4bf'}
                  onMouseOut={e => e.currentTarget.style.color = '#6b7a99'}
                >{l}</a>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#e8eaf0', marginBottom: '1rem' }}>Contact & Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {['NASA POWER API Specs', 'Documentation', 'System Status', 'Get In Touch'].map(l => (
                <a key={l} href="#faq" style={{ fontSize: '0.82rem', color: '#6b7a99', textDecoration: 'none', transition: 'color 0.15s ease' }}
                  onMouseOver={e => e.currentTarget.style.color = '#2dd4bf'}
                  onMouseOut={e => e.currentTarget.style.color = '#6b7a99'}
                >{l}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#6b7a99' }}>
          <div>Copyright © 2026 Swind Inc. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Security'].map(l => (
              <a key={l} href="#faq" style={{ color: '#6b7a99', textDecoration: 'none', transition: 'color 0.15s ease' }}
                onMouseOver={e => e.currentTarget.style.color = '#b0b8c9'}
                onMouseOut={e => e.currentTarget.style.color = '#6b7a99'}
              >{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
