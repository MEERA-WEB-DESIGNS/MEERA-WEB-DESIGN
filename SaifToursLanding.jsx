import { useState, useEffect, useRef, useCallback } from "react";
import {
  Star, Phone, MessageCircle, MapPin, Clock, Shield,
  ChevronDown, Car, Users, Zap, ArrowRight, Mountain,
  CheckCircle, Menu, X, ChevronLeft, ChevronRight,
  Navigation, Award, Headphones, Calendar, Fuel
} from "lucide-react";

// ─── CONSTANTS ──────────────────────────────────────────────────────────────

const PHONE = "+923205009171";
const PHONE_DISPLAY = "+92 320 5009171";
const WA_BASE = `https://wa.me/${PHONE}`;

const buildWALink = (carType = "", destination = "") => {
  const msg = `Hello Mr. Mehtab! 👋\n\nI'd like to book a *${carType || "car"}* for *${destination || "my trip"}*.\n\nPlease confirm availability and pricing.\n\nThank you!`;
  return `${WA_BASE}?text=${encodeURIComponent(msg)}`;
};

const CAR_TYPES = [
  "Luxury Sedan (Civic / Corolla / Elantra)",
  "4x4 SUV (Prado / Fortuner)",
  "Crossover (Sportage / Tucson)",
  "Executive Van (Grand Cabin / Hiace)",
];

const DESTINATIONS = [
  "Hunza Valley",
  "Kaghan / Naran",
  "Swat Valley",
  "Murree / Nathia Gali",
  "Skardu / Gilgit",
  "Azad Kashmir",
  "Islamabad City Tour",
  "Lahore / Karachi Transfer",
  "Airport Pickup / Drop",
  "Custom Destination",
];

const FLEET = [
  {
    category: "Luxury Sedans",
    icon: Car,
    models: ["Toyota Corolla", "Honda Civic", "Hyundai Elantra"],
    badge: "Most Popular",
    badgeColor: "from-amber-400 to-yellow-300",
    features: ["Climate Control", "Leather Seats", "USB Charging", "GPS Enabled"],
    ideal: "City transfers & intercity trips",
    capacity: "1–4 Passengers",
    gradient: "from-[#1a1a2e] to-[#16213e]",
    glowColor: "rgba(212,175,55,0.25)",
    emoji: "🚗",
  },
  {
    category: "4×4 SUVs",
    icon: Mountain,
    models: ["Toyota Prado", "Toyota Fortuner", "Sportage"],
    badge: "Northern Routes",
    badgeColor: "from-emerald-500 to-teal-400",
    features: ["4WD / AWD", "Mountain-Ready", "Extra Luggage", "Rugged Suspension"],
    ideal: "Hunza, Kaghan, Swat & beyond",
    capacity: "1–6 Passengers",
    gradient: "from-[#0d1b2a] to-[#1b2838]",
    glowColor: "rgba(52,211,153,0.2)",
    emoji: "🏔️",
  },
  {
    category: "Executive Vans",
    icon: Users,
    models: ["Grand Cabin", "Toyota Hiace", "Luxury Coaster"],
    badge: "Group Travel",
    badgeColor: "from-violet-500 to-purple-400",
    features: ["10–15 Seats", "Ample Luggage", "Tinted Windows", "Reclining Seats"],
    ideal: "Family trips & corporate groups",
    capacity: "6–15 Passengers",
    gradient: "from-[#1a0a2e] to-[#16082a]",
    glowColor: "rgba(139,92,246,0.2)",
    emoji: "🚐",
  },
];

const REVIEWS = [
  {
    name: "Awais Khawaja",
    rating: 5,
    avatar: "AK",
    avatarColor: "from-amber-500 to-yellow-400",
    date: "2 weeks ago",
    text: "Excellent and reliable service. I was in a bind and they arranged a car on very short notice with a reasonable price. The vehicle was clean, new model, and the driver was professional. Mr. Mehtab personally ensured everything went smoothly. Highly recommend for anyone needing trusted transport in Islamabad!",
    location: "Islamabad",
    trip: "Same-Day Booking",
  },
  {
    name: "Meena",
    rating: 5,
    avatar: "ME",
    avatarColor: "from-rose-500 to-pink-400",
    date: "1 month ago",
    text: "Needed a vehicle for 6 people with just 2 hours notice and the car was right on time — no excuses, no delays. The driver was absolutely professional in navigating the northern routes. Owner Mr. Mehtab was super chill and accommodating. Will definitely use again for our next Kaghan trip!",
    location: "Rawalpindi",
    trip: "Kaghan Valley — Group of 6",
  },
  {
    name: "Tariq Hassan",
    rating: 5,
    avatar: "TH",
    avatarColor: "from-sky-500 to-blue-400",
    date: "3 weeks ago",
    text: "Booked a Prado for Hunza. The vehicle was in immaculate condition, driver knew every mountain pass and made the journey feel safe and comfortable. 24/7 responsiveness from the team. This is the gold standard for car rentals in Islamabad.",
    location: "Islamabad",
    trip: "Hunza Valley — Prado",
  },
];

const FEATURES = [
  { icon: Zap, title: "Same-Day Availability", desc: "Book within hours, even for urgent trips. We're always ready." },
  { icon: Shield, title: "Verified Drivers", desc: "All drivers are background-checked & experienced on mountain roads." },
  { icon: Car, title: "New Model Fleet", desc: "Late-model, meticulously maintained vehicles — no surprises." },
  { icon: Headphones, title: "24/7 Direct Contact", desc: "Reach Mr. Mehtab any time via WhatsApp or call. Real support." },
  { icon: Mountain, title: "Northern Routes Expert", desc: "Kaghan, Hunza, Swat, Skardu — our drivers know every curve." },
  { icon: Award, title: "5.0 Google Rating", desc: "230+ verified reviews. Consistently rated Pakistan's best." },
];

// ─── HOOKS ───────────────────────────────────────────────────────────────────

function useTilt(strength = 12) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 });

  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -strength, y: dx * strength, scale: 1.03 });
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0, scale: 1 });
  }, []);

  return { ref, tilt, handleMouseMove, handleMouseLeave };
}

function useIntersection(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function GoldStars({ count = 5, size = 14 }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={size} className="fill-amber-400 text-amber-400" />
      ))}
    </span>
  );
}

function GlassCard({ children, className = "", style = {} }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 backdrop-blur-xl bg-white/5 ${className}`}
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)", ...style }}
    >
      {children}
    </div>
  );
}

function GoldButton({ children, href, onClick, className = "", size = "md" }) {
  const base = "relative inline-flex items-center justify-center gap-2 font-bold tracking-wide rounded-xl overflow-hidden group transition-all duration-300";
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
    xl: "px-10 py-5 text-lg",
  };
  const inner = (
    <>
      <span className="absolute inset-0 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-500 transition-all duration-300 group-hover:from-amber-500 group-hover:via-yellow-300 group-hover:to-amber-400" />
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "radial-gradient(circle at 50% -20%, rgba(255,255,200,0.35) 0%, transparent 70%)" }} />
      <span className="relative z-10 text-black flex items-center gap-2">{children}</span>
    </>
  );
  if (href) return <a href={href} target="_blank" rel="noreferrer" className={`${base} ${sizes[size]} ${className}`}>{inner}</a>;
  return <button onClick={onClick} className={`${base} ${sizes[size]} ${className}`}>{inner}</button>;
}

function WhatsAppButton({ children, carType, destination, className = "", size = "md" }) {
  return (
    <GoldButton href={buildWALink(carType, destination)} className={className} size={size}>
      <MessageCircle size={18} />
      {children}
    </GoldButton>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = ["Fleet", "Destinations", "Reviews", "Contact"];

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}
      style={{
        background: scrolled
          ? "rgba(11,12,16,0.92)"
          : "linear-gradient(to bottom, rgba(11,12,16,0.8), transparent)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(212,175,55,0.15)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex flex-col leading-none">
          <span className="text-xs tracking-[0.25em] uppercase text-amber-400/70 font-medium">Saif Tours & Travels</span>
          <span className="text-lg font-black tracking-tight text-white">Rent A Car <span className="text-amber-400">Islamabad</span></span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <button
              key={l}
              onClick={() => document.getElementById(l.toLowerCase())?.scrollIntoView({ behavior: "smooth" })}
              className="text-sm text-white/60 hover:text-amber-400 transition-colors duration-200 tracking-wide"
            >
              {l}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href={`tel:${PHONE}`}
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-white border border-white/20 hover:border-amber-400/50 hover:text-amber-400 rounded-xl px-4 py-2.5 transition-all duration-300"
          >
            <Phone size={15} />
            <span className="hidden lg:inline">{PHONE_DISPLAY}</span>
            <span className="lg:hidden">Call</span>
          </a>
          <WhatsAppButton carType="" destination="" size="sm">Book Now</WhatsAppButton>
          <button className="md:hidden text-white/70 hover:text-white p-1" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 py-4 flex flex-col gap-3 border-t border-white/10 mt-3">
          {navLinks.map((l) => (
            <button key={l} onClick={() => { document.getElementById(l.toLowerCase())?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); }}
              className="text-left text-white/70 hover:text-amber-400 py-2 border-b border-white/5 transition-colors">
              {l}
            </button>
          ))}
          <a href={`tel:${PHONE}`} className="flex items-center gap-2 text-amber-400 font-semibold mt-2">
            <Phone size={16} />{PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({ x: e.clientX / rect.width, y: e.clientY / rect.height });
  }, []);

  const px = (mouse.x - 0.5) * 30;
  const py = (mouse.y - 0.5) * 20;

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(212,175,55,0.12) 0%, transparent 60%), #0B0C10" }}
    >
      {/* Animated mesh background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        {/* Glow orbs that shift with mouse */}
        <div className="absolute rounded-full blur-[120px] opacity-20 transition-transform duration-700 ease-out"
          style={{ width: 600, height: 600, background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)", top: "10%", left: "60%", transform: `translate(${px * 1.5}px, ${py * 1.5}px)` }} />
        <div className="absolute rounded-full blur-[160px] opacity-10 transition-transform duration-1000 ease-out"
          style={{ width: 800, height: 400, background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)", bottom: "20%", left: "10%", transform: `translate(${px * -0.8}px, ${py * -0.8}px)` }} />

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-amber-400/20 animate-pulse"
            style={{
              width: Math.random() * 4 + 2, height: Math.random() * 4 + 2,
              left: `${10 + i * 7}%`, top: `${15 + (i % 5) * 15}%`,
              animationDelay: `${i * 0.4}s`, animationDuration: `${2 + i * 0.3}s`
            }} />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className={`transition-all duration-1000 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 border border-amber-400/30 bg-amber-400/10 backdrop-blur-sm">
              <GoldStars size={13} />
              <span className="text-amber-300 text-sm font-semibold">5.0 • 230+ Google Reviews</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-medium">Open 24/7</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight mb-6">
              <span className="text-white block">Premium Fleet.</span>
              <span className="block" style={{
                background: "linear-gradient(135deg, #D4AF37 0%, #FDE68A 40%, #D4AF37 70%, #92400E 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>Unmatched</span>
              <span className="text-white block">Reliability.</span>
            </h1>

            <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-md">
              Islamabad's most trusted car rental service. New-model vehicles, verified mountain-route drivers, and confirmed bookings within <span className="text-amber-400 font-semibold">2 hours or less.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <WhatsAppButton carType="" destination="" size="lg">
                Book via WhatsApp
              </WhatsAppButton>
              <a href={`tel:${PHONE}`}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-bold hover:border-amber-400/50 hover:bg-white/5 transition-all duration-300">
                <Phone size={18} className="text-amber-400" />
                Call Mr. Mehtab
              </a>
            </div>

            {/* Stats row */}
            <div className="flex gap-8">
              {[
                { val: "24/7", label: "Available" },
                { val: "230+", label: "5-Star Reviews" },
                { val: "2hr", label: "Avg. Response" },
              ].map(({ val, label }) => (
                <div key={label}>
                  <div className="text-2xl font-black text-white">{val}</div>
                  <div className="text-xs text-white/40 uppercase tracking-widest">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 3D floating card cluster */}
          <div className={`relative transition-all duration-1200 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
            style={{ perspective: "1000px" }}>

            {/* Main card */}
            <div className="relative"
              style={{ transform: `rotateY(${px * 0.04}deg) rotateX(${py * -0.04}deg)`, transition: "transform 0.4s ease", transformStyle: "preserve-3d" }}>
              <GlassCard className="p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-widest text-amber-400/70 font-semibold">Featured Vehicle</span>
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">Available Now</span>
                  </div>

                  {/* Car illustration */}
                  <div className="relative h-40 flex items-center justify-center my-4">
                    <div className="text-8xl" style={{ filter: "drop-shadow(0 20px 40px rgba(212,175,55,0.4))", transform: `translate(${px * 0.1}px, ${py * 0.05}px)` }}>
                      🚗
                    </div>
                    <div className="absolute bottom-0 inset-x-4 h-8 rounded-full blur-xl opacity-40" style={{ background: "radial-gradient(ellipse, #D4AF37 0%, transparent 70%)" }} />
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <div className="text-white font-bold text-lg">Toyota Corolla</div>
                      <div className="text-white/40 text-sm">Luxury Sedan • 2023 Model</div>
                    </div>
                    <WhatsAppButton carType="Toyota Corolla" destination="" size="sm">Book</WhatsAppButton>
                  </div>

                  <div className="flex gap-4 mt-4 pt-4 border-t border-white/10">
                    {[["👥", "4 Seats"], ["❄️", "AC"], ["🗺️", "GPS"]].map(([icon, label]) => (
                      <div key={label} className="flex items-center gap-1.5 text-white/50 text-xs">
                        <span>{icon}</span><span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-2xl p-3 shadow-xl shadow-amber-500/30"
                style={{ transform: `translateZ(40px) translate(${px * -0.15}px, ${py * -0.1}px)` }}>
                <div className="text-black text-center">
                  <div className="text-xl font-black leading-none">5.0</div>
                  <div className="text-xs font-bold opacity-70">Rating</div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 backdrop-blur-md px-4 py-2"
                style={{ transform: `translateZ(20px) translate(${px * 0.1}px, ${py * 0.1}px)` }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-xs font-bold">2 HR Response</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-bounce">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={16} />
      </div>
    </section>
  );
}

// ─── BOOKING WIDGET ───────────────────────────────────────────────────────────

function BookingWidget() {
  const [carType, setCarType] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [focused, setFocused] = useState(null);
  const { ref, visible } = useIntersection();

  const selectCls = (field) =>
    `w-full bg-white/5 border rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none transition-all duration-300 appearance-none cursor-pointer ${focused === field ? "border-amber-400/60 bg-amber-400/5 shadow-[0_0_20px_rgba(212,175,55,0.15)]" : "border-white/15 hover:border-white/30"}`;

  return (
    <section id="contact" className="py-24 relative overflow-hidden" ref={ref}
      style={{ background: "linear-gradient(180deg, #0B0C10 0%, #0f1117 50%, #0B0C10 100%)" }}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[120px] opacity-10"
          style={{ background: "radial-gradient(ellipse, #D4AF37 0%, transparent 60%)" }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="text-center mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-amber-400/70 font-semibold">Reserve Your Ride</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-2">
              Book in <span style={{ background: "linear-gradient(135deg, #D4AF37, #FDE68A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>60 Seconds</span>
            </h2>
            <p className="text-white/50 mt-3">Select your preferences and connect directly with Mr. Mehtab on WhatsApp.</p>
          </div>

          <GlassCard className="p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-transparent to-purple-500/5 pointer-events-none" />
            <div className="relative z-10">
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                {/* Car type */}
                <div className="relative">
                  <label className="block text-xs text-white/40 uppercase tracking-widest mb-2 font-medium">Vehicle Type</label>
                  <div className="relative">
                    <select
                      value={carType}
                      onChange={(e) => setCarType(e.target.value)}
                      onFocus={() => setFocused("car")}
                      onBlur={() => setFocused(null)}
                      className={selectCls("car")}
                    >
                      <option value="" className="bg-[#0B0C10]">Select Car Type</option>
                      {CAR_TYPES.map((c) => <option key={c} value={c} className="bg-[#0B0C10]">{c}</option>)}
                    </select>
                    <Car size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400/50 pointer-events-none" />
                  </div>
                </div>

                {/* Destination */}
                <div className="relative">
                  <label className="block text-xs text-white/40 uppercase tracking-widest mb-2 font-medium">Destination</label>
                  <div className="relative">
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      onFocus={() => setFocused("dest")}
                      onBlur={() => setFocused(null)}
                      className={selectCls("dest")}
                    >
                      <option value="" className="bg-[#0B0C10]">Select Destination</option>
                      {DESTINATIONS.map((d) => <option key={d} value={d} className="bg-[#0B0C10]">{d}</option>)}
                    </select>
                    <MapPin size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400/50 pointer-events-none" />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-widest mb-2 font-medium">Travel Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      onFocus={() => setFocused("date")}
                      onBlur={() => setFocused(null)}
                      className={selectCls("date")}
                      style={{ colorScheme: "dark" }}
                    />
                    <Calendar size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400/50 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Dynamic preview */}
              {(carType || destination) && (
                <div className="mb-5 p-4 rounded-xl bg-amber-400/8 border border-amber-400/20 flex items-start gap-3">
                  <MessageCircle size={16} className="text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-white/50 text-xs">Message preview: </span>
                    <span className="text-amber-300 text-xs">
                      "Hello Mr. Mehtab! I'd like to book a <strong>{carType || "car"}</strong> for <strong>{destination || "my trip"}</strong>{date ? ` on ${date}` : ""}."
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <WhatsAppButton carType={carType} destination={destination} size="lg" className="flex-1">
                  Book via WhatsApp — Instant Confirm
                </WhatsAppButton>
                <a href={`tel:${PHONE}`}
                  className="flex items-center justify-center gap-2.5 flex-1 sm:flex-none sm:px-8 py-4 rounded-xl border-2 border-white/15 text-white font-bold hover:border-amber-400/50 hover:text-amber-400 hover:bg-amber-400/5 transition-all duration-300">
                  <Phone size={18} />
                  <span>{PHONE_DISPLAY}</span>
                </a>
              </div>

              <div className="mt-5 flex flex-wrap gap-5 justify-center">
                {["Free Cancellation", "No Hidden Fees", "Instant Confirmation"].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-white/40 text-xs">
                    <CheckCircle size={13} className="text-emerald-400" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

// ─── FLEET ────────────────────────────────────────────────────────────────────

function FleetCard({ car }) {
  const { ref, tilt, handleMouseMove, handleMouseLeave } = useTilt(10);
  const { ref: visRef, visible } = useIntersection(0.1);

  return (
    <div ref={visRef} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="h-full cursor-default"
        style={{
          transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.scale})`,
          transition: tilt.scale === 1 ? "transform 0.5s cubic-bezier(0.23,1,0.32,1)" : "transform 0.1s ease",
          transformStyle: "preserve-3d",
        }}
      >
        <GlassCard
          className="h-full overflow-hidden group"
          style={{ boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 60px ${car.glowColor}, inset 0 1px 0 rgba(255,255,255,0.08)` }}
        >
          <div className={`h-1 w-full bg-gradient-to-r ${car.badgeColor}`} />

          <div className={`relative p-6 bg-gradient-to-br ${car.gradient}`}>
            {/* Badge */}
            <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${car.badgeColor} text-black`}>
              {car.badge}
            </div>

            {/* Emoji car */}
            <div className="text-6xl mb-3 text-center"
              style={{ filter: `drop-shadow(0 10px 20px ${car.glowColor})`, transform: `translateZ(20px)` }}>
              {car.emoji}
            </div>

            <h3 className="text-xl font-black text-white mb-1">{car.category}</h3>
            <p className="text-white/40 text-xs mb-4">{car.ideal}</p>

            {/* Models */}
            <div className="flex flex-wrap gap-2 mb-4">
              {car.models.map((m) => (
                <span key={m} className="text-xs px-2.5 py-1 rounded-lg bg-white/8 border border-white/10 text-white/70">{m}</span>
              ))}
            </div>

            {/* Features */}
            <div className="space-y-2 mb-5">
              {car.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs text-white/60">
                  <CheckCircle size={11} className="text-emerald-400 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {/* Capacity */}
            <div className="flex items-center gap-2 text-xs text-amber-400/80 mb-5 font-semibold">
              <Users size={12} />
              <span>{car.capacity}</span>
            </div>

            <WhatsAppButton carType={car.models[0]} destination="" className="w-full">
              Book This Vehicle <ArrowRight size={14} />
            </WhatsAppButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function Fleet() {
  const { ref, visible } = useIntersection(0.05);
  return (
    <section id="fleet" className="py-24 relative" ref={ref}
      style={{ background: "linear-gradient(180deg, #0B0C10 0%, #080910 100%)" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className={`text-center mb-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <span className="text-xs tracking-[0.3em] uppercase text-amber-400/70 font-semibold">Premium Fleet</span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mt-2 mb-4">
            Every Journey, <span style={{ background: "linear-gradient(135deg, #D4AF37, #FDE68A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Every Vehicle</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">New model, immaculately maintained vehicles for every trip type — from city commutes to mountain expeditions.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FLEET.map((car) => <FleetCard key={car.category} car={car} />)}
        </div>
      </div>
    </section>
  );
}

// ─── FEATURES / SPECIALIZATION ────────────────────────────────────────────────

function Features() {
  const { ref, visible } = useIntersection(0.05);
  return (
    <section id="destinations" className="py-24 relative overflow-hidden" ref={ref}
      style={{ background: "linear-gradient(180deg, #080910 0%, #0B0C10 100%)" }}>
      {/* Decorative line */}
      <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-amber-400/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Northern Routes */}
          <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <span className="text-xs tracking-[0.3em] uppercase text-amber-400/70 font-semibold">Specialization</span>
            <h2 className="text-4xl font-black text-white mt-2 mb-5 leading-tight">
              Pakistan's North<br />
              <span style={{ background: "linear-gradient(135deg, #D4AF37, #FDE68A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Awaits You.
              </span>
            </h2>
            <p className="text-white/55 leading-relaxed mb-8">
              Our drivers have driven thousands of kilometers across the Karakoram Highway, Babusar Pass, and Swat Valley. When the roads get steep and narrow, experience — not GPS — is what keeps you safe.
            </p>

            <div className="space-y-3 mb-8">
              {["Hunza Valley & Attabad Lake", "Kaghan / Naran / Babusar Top", "Swat Valley & Malam Jabba", "Skardu & Deosai Plains", "Fairy Meadows & Nanga Parbat", "Azad Kashmir & Neelum Valley"].map((dest) => (
                <div key={dest} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-default">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-400/20 transition-colors">
                    <Mountain size={14} />
                  </div>
                  <span className="text-white/70 group-hover:text-white transition-colors text-sm font-medium">{dest}</span>
                  <ArrowRight size={13} className="text-amber-400/0 group-hover:text-amber-400/60 ml-auto transition-all" />
                </div>
              ))}
            </div>

            <WhatsAppButton carType="4x4 SUV (Prado / Fortuner)" destination="Northern Pakistan" size="lg">
              Plan Northern Route
            </WhatsAppButton>
          </div>

          {/* Right: 24/7 + Features */}
          <div className={`transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            {/* 24/7 highlight card */}
            <GlassCard className="p-6 mb-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center text-black font-black text-xl shrink-0 shadow-lg shadow-amber-500/30">
                  24/7
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-1">Short-Notice Booking</h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Need a car in 2 hours? We've done it hundreds of times. Call or WhatsApp Mr. Mehtab any time — midnight, early morning, or holiday. Confirmed within minutes.
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-4">
              {FEATURES.slice(1).map((f, i) => (
                <GlassCard key={f.title}
                  className={`p-4 hover:scale-[1.02] transition-all duration-300 group cursor-default ${i === 0 ? "col-span-2" : ""}`}
                  style={{ transitionDelay: `${i * 60}ms` }}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/15 flex items-center justify-center text-amber-400 group-hover:bg-amber-400/20 transition-colors shrink-0">
                      <f.icon size={16} />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm mb-0.5">{f.title}</div>
                      <div className="text-white/40 text-xs leading-relaxed">{f.desc}</div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── REVIEWS ─────────────────────────────────────────────────────────────────

function ReviewCard({ review, index }) {
  const { ref, tilt, handleMouseMove, handleMouseLeave } = useTilt(6);
  const { ref: visRef, visible } = useIntersection(0.1);

  return (
    <div ref={visRef}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${index * 100}ms` }}>
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.scale})`,
          transition: tilt.scale === 1 ? "transform 0.5s cubic-bezier(0.23,1,0.32,1)" : "transform 0.1s ease",
        }}
      >
        <GlassCard className="p-6 h-full hover:border-amber-400/20 transition-colors duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${review.avatarColor} flex items-center justify-center text-white font-black text-sm shadow-lg`}>
                {review.avatar}
              </div>
              <div>
                <div className="text-white font-bold text-sm">{review.name}</div>
                <div className="text-white/40 text-xs">{review.location} · {review.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/272px-Google_2015_logo.svg.png"
                alt="Google"
                className="h-4 opacity-60 object-contain"
                style={{ filter: "grayscale(1) brightness(2)" }}
              />
            </div>
          </div>

          <GoldStars size={14} />

          <p className="text-white/65 text-sm leading-relaxed mt-3 mb-4">{review.text}</p>

          <div className="flex items-center gap-2 pt-3 border-t border-white/8">
            <Navigation size={11} className="text-amber-400/60" />
            <span className="text-amber-400/60 text-xs font-medium">{review.trip}</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function Reviews() {
  const { ref, visible } = useIntersection(0.05);
  return (
    <section id="reviews" className="py-24 relative overflow-hidden" ref={ref}
      style={{ background: "linear-gradient(180deg, #0B0C10 0%, #0a0b0f 100%)" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[100px] opacity-10"
          style={{ background: "radial-gradient(ellipse, #D4AF37 0%, transparent 60%)" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className={`text-center mb-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <span className="text-xs tracking-[0.3em] uppercase text-amber-400/70 font-semibold">Client Testimonials</span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mt-2 mb-4">
            Trusted by <span style={{ background: "linear-gradient(135deg, #D4AF37, #FDE68A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Hundreds</span>
          </h2>

          {/* Trust aggregate */}
          <div className="inline-flex items-center gap-4 mt-2 px-6 py-3 rounded-2xl border border-amber-400/25 bg-amber-400/8 backdrop-blur-sm">
            <GoldStars size={18} />
            <div className="text-left">
              <div className="text-2xl font-black text-white leading-none">5.0</div>
              <div className="text-white/40 text-xs">from 230+ Google Reviews</div>
            </div>
            <div className="w-px h-10 bg-white/15" />
            <div className="text-left">
              <div className="text-white text-sm font-bold">Islamabad's #1</div>
              <div className="text-white/40 text-xs">Car Rental Service</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => <ReviewCard key={r.name} review={r} index={i} />)}
        </div>

        {/* CTA row */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center mt-12 transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <WhatsAppButton carType="" destination="" size="lg">
            Book Your Trip Today
          </WhatsAppButton>
          <a href={`https://www.google.com/maps/search/Saif+Tours+Travels+Rent+A+Car+Islamabad`}
            target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white/70 hover:border-amber-400/40 hover:text-amber-400 transition-all duration-300 font-semibold text-sm">
            <Star size={16} className="text-amber-400" />
            Read All Reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden pt-20 pb-8"
      style={{ background: "linear-gradient(180deg, #0a0b0f 0%, #05060a 100%)" }}>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <div className="text-xs tracking-[0.25em] uppercase text-amber-400/70 font-medium">Saif Tours & Travels</div>
              <div className="text-2xl font-black text-white mt-1">Rent A Car <span className="text-amber-400">Islamabad</span></div>
            </div>
            <p className="text-white/45 text-sm leading-relaxed mb-6">
              Premium car rental and tour services operated by Mr. Mehtab. New-model vehicles, professional drivers, and 24/7 availability for all your travel needs across Pakistan.
            </p>
            <div className="flex gap-3">
              <a href={WA_BASE} target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/25 transition-colors">
                <MessageCircle size={18} />
              </a>
              <a href={`tel:${PHONE}`}
                className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 hover:bg-amber-400/20 transition-colors">
                <Phone size={18} />
              </a>
            </div>
          </div>

          {/* Contact details */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5 pb-3 border-b border-white/10">Contact Details</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin size={16} className="text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-white/70 text-sm leading-relaxed">
                    1st Floor, Umar Plaza, Shop No. 12<br />
                    Block 10-B, G-8 Markaz Road<br />
                    G-8 Markaz, Islamabad — 44080
                  </div>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Phone size={16} className="text-amber-400 shrink-0" />
                <a href={`tel:${PHONE}`} className="text-white/70 text-sm hover:text-amber-400 transition-colors font-medium">{PHONE_DISPLAY}</a>
              </div>
              <div className="flex gap-3 items-center">
                <MessageCircle size={16} className="text-emerald-400 shrink-0" />
                <a href={WA_BASE} target="_blank" rel="noreferrer" className="text-white/70 text-sm hover:text-emerald-400 transition-colors font-medium">WhatsApp: {PHONE_DISPLAY}</a>
              </div>
              <div className="flex gap-3 items-center">
                <Clock size={16} className="text-amber-400 shrink-0" />
                <span className="text-white/70 text-sm">Open 24 Hours · 7 Days a Week</span>
              </div>
            </div>
          </div>

          {/* CTA card */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5 pb-3 border-b border-white/10">Instant Booking</h4>
            <GlassCard className="p-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-xs font-bold uppercase tracking-wide">Available Now</span>
                </div>
                <p className="text-white/60 text-sm mb-4">Mr. Mehtab responds to WhatsApp messages within minutes, day or night.</p>
                <div className="space-y-3">
                  <WhatsAppButton carType="" destination="" className="w-full">
                    <MessageCircle size={16} />
                    Open WhatsApp Chat
                  </WhatsAppButton>
                  <a href={`tel:${PHONE}`}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/15 text-white/70 hover:border-amber-400/40 hover:text-amber-400 transition-all text-sm font-semibold">
                    <Phone size={15} />
                    Call Directly
                  </a>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Map placeholder */}
        <GlassCard className="mb-10 overflow-hidden h-48 relative group cursor-pointer"
          onClick={() => window.open("https://maps.google.com/?q=G-8+Markaz+Islamabad", "_blank")}>
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0d1b2a 0%, #1a2a3a 100%)" }}>
            {/* Fake map grid */}
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: "linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            {/* Map roads */}
            <div className="absolute inset-0 overflow-hidden">
              {[15, 35, 55, 75].map((p) => (
                <div key={p} className="absolute h-px bg-amber-400/15" style={{ top: `${p}%`, left: 0, right: 0 }} />
              ))}
              {[10, 30, 50, 70, 90].map((p) => (
                <div key={p} className="absolute w-px bg-amber-400/15" style={{ left: `${p}%`, top: 0, bottom: 0 }} />
              ))}
            </div>
            <div className="relative z-10 flex flex-col items-center gap-3 group-hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 rounded-full bg-amber-400 flex items-center justify-center shadow-2xl shadow-amber-400/50 animate-bounce">
                <MapPin size={24} className="text-black" />
              </div>
              <div className="text-center">
                <div className="text-white font-bold">G-8 Markaz, Islamabad</div>
                <div className="text-amber-400/70 text-sm">Click to open in Google Maps →</div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Bottom */}
        <div className="pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">© 2024 Saif Tours And Travels And Rent A Car Islamabad. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <GoldStars size={12} />
            <span className="text-white/30 text-xs">5.0 · 230+ Reviews · Islamabad's Best</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── STICKY BOOKING BAR ───────────────────────────────────────────────────────

function StickyBar() {
  const [car, setCar] = useState("");
  const [dest, setDest] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fn = () => setShow(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className={`fixed bottom-0 inset-x-0 z-50 transition-all duration-500 ${show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
      style={{ background: "rgba(11,12,16,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(212,175,55,0.2)" }}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-amber-400/80 text-xs font-bold uppercase tracking-widest shrink-0 hidden sm:flex">
            <Zap size={14} className="fill-current" />
            Quick Book
          </div>
          <div className="flex flex-1 flex-col sm:flex-row gap-2 w-full">
            <select value={car} onChange={(e) => setCar(e.target.value)}
              className="flex-1 bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400/50 appearance-none cursor-pointer">
              <option value="" className="bg-[#0B0C10]">Vehicle Type</option>
              {CAR_TYPES.map((c) => <option key={c} value={c} className="bg-[#0B0C10]">{c}</option>)}
            </select>
            <select value={dest} onChange={(e) => setDest(e.target.value)}
              className="flex-1 bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400/50 appearance-none cursor-pointer">
              <option value="" className="bg-[#0B0C10]">Destination</option>
              {DESTINATIONS.map((d) => <option key={d} value={d} className="bg-[#0B0C10]">{d}</option>)}
            </select>
          </div>
          <div className="flex gap-2 shrink-0 w-full sm:w-auto">
            <WhatsAppButton carType={car} destination={dest} size="sm" className="flex-1 sm:flex-none">
              <MessageCircle size={14} />
              <span className="hidden sm:inline">WhatsApp</span>
              <span className="sm:hidden">Book via WhatsApp</span>
            </WhatsAppButton>
            <a href={`tel:${PHONE}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/20 text-white text-xs font-bold hover:border-amber-400/50 hover:text-amber-400 transition-all shrink-0">
              <Phone size={13} />
              <span className="hidden sm:inline">Call</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MOBILE FLOATING CTA ──────────────────────────────────────────────────────

function MobileFloatingCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className={`fixed bottom-20 right-4 z-40 sm:hidden flex flex-col gap-3 transition-all duration-500 ${show ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`}>
      <a href={WA_BASE} target="_blank" rel="noreferrer"
        className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/40 hover:scale-110 transition-transform">
        <MessageCircle size={24} className="text-white" />
      </a>
      <a href={`tel:${PHONE}`}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center shadow-xl shadow-amber-500/40 hover:scale-110 transition-transform">
        <Phone size={22} className="text-black" />
      </a>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

export default function SaifToursLanding() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: "#0B0C10", color: "white" }}>
      <Navbar />
      <Hero />
      <BookingWidget />
      <Fleet />
      <Features />
      <Reviews />
      <Footer />
      <StickyBar />
      <MobileFloatingCTA />
    </div>
  );
}
