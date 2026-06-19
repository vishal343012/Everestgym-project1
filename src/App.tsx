import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Dumbbell, 
  Zap, 
  TrendingDown, 
  Users, 
  Target, 
  HeartPulse,
  Phone,
  MapPin,
  Clock,
  Star,
  Check,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Facebook,
  Instagram,
  Sparkles,
  Map,
  Smile,
  CheckCircle2,
  Calendar,
  UtensilsCrossed,
  Layers,
  Scale,
  MessageCircle,
  Send
} from "lucide-react";

import { 
  GYM_INFO, 
  SERVICES, 
  PRICING_PLANS, 
  GALLERY_ITEMS, 
  REVIEWS, 
  WEEKLY_HOURS,
  GymService,
  PricingPlan,
  ReviewItem
} from "./data";

// Helper to resolve Lucide dynamic icons
const renderServiceIcon = (iconName: string, className: string = "w-6 h-6") => {
  switch (iconName) {
    case "Dumbbell":
      return <Dumbbell className={className} />;
    case "Zap":
      return <Zap className={className} />;
    case "TrendingDown":
      return <TrendingDown className={className} />;
    case "Users":
      return <Users className={className} />;
    case "Target":
      return <Target className={className} />;
    case "HeartPulse":
      return <HeartPulse className={className} />;
    default:
      return <Dumbbell className={className} />;
  }
};

export default function App() {
  // Mobile navigation state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Pricing toggle (monthly vs annual)
  const [isAnnual, setIsAnnual] = useState(false);
  
  // Gallery category filter
  const [galleryFilter, setGalleryFilter] = useState<"all" | "floor" | "cardio" | "weights">("all");
  
  // Contact Form Submission States
  const [contactForm, setContactForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactError, setContactError] = useState("");

  // Metabolic Burn Calculator state
  const [calculatorWeight, setCalculatorWeight] = useState("70");
  const [calculatorWorkout, setCalculatorWorkout] = useState("hiit");
  const [calculatorResult, setCalculatorResult] = useState<number | null>(770); // prefilled for initial HIIT action

  // Registration/Join Modal state
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [joinForm, setJoinForm] = useState({ name: "", phone: "", email: "", preferredTime: "morning" });
  const [joinSubmitted, setJoinSubmitted] = useState(false);

  // Dynamic Gym Status based on local time
  const [isOpenNow, setIsOpenNow] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  // Floating WhatsApp Chat State
  const [isWhatsAppWidgetOpen, setIsWhatsAppWidgetOpen] = useState(false);
  const [whatsappForm, setWhatsappForm] = useState({ name: "", goal: "Strength Training", timeShift: "evening" });

  useEffect(() => {
    // Determine gym open/closed status based on actual Indian/Kolkata timezone standard or user local hours
    const determineGymStatus = () => {
      const now = new Date();
      const currentDayIndex = now.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
      const currentHour = now.getHours();
      const currentMin = now.getMinutes();
      const timeDecimal = currentHour + currentMin / 60;

      // Monday (1) to Saturday (6) hours: 6:00 AM to 10:30 PM (6.0 to 22.5)
      // Sunday (0) hours: 6:00 AM to 4:30 PM (6.0 to 16.5)
      let openHours = { open: 6.0, close: 22.5, text: "6:00 AM – 10:30 PM" };
      if (currentDayIndex === 0) {
        openHours = { open: 6.0, close: 16.5, text: "6:00 AM – 4:30 PM" };
      }

      if (timeDecimal >= openHours.open && timeDecimal < openHours.close) {
        setIsOpenNow(true);
        // Format closing time elegantly
        const closingMsg = currentDayIndex === 0 ? "4:30 PM" : "10:30 PM";
        setStatusMessage(`Open Now (Closes at ${closingMsg})`);
      } else {
        setIsOpenNow(false);
        const openingMsg = "6:00 AM";
        setStatusMessage(`Closed Now (Opens tomorrow at ${openingMsg})`);
      }
    };

    determineGymStatus();
    const interval = setInterval(determineGymStatus, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  // Handle calculator submit
  const handleCalculateBurn = (e: React.FormEvent) => {
    e.preventDefault();
    const weightVal = parseFloat(calculatorWeight);
    if (isNaN(weightVal) || weightVal <= 0) {
      setCalculatorResult(null);
      return;
    }

    // Rough MET values for calculation (MET * 3.5 * weightKg / 200) * 60 minutes
    // HIIT: 11 METs, Strength: 6 METs, Cardio Run: 10 METs, Weight Loss circuit: 8 METs
    let met = 8;
    switch (calculatorWorkout) {
      case "strength": met = 6; break;
      case "cardio": met = 10; break;
      case "hiit": met = 11; break;
      case "coaching": met = 5; break;
    }

    const hourlyBurn = Math.round(met * 1.05 * weightVal);
    setCalculatorResult(hourlyBurn);
  };

  // Handle contact form submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.phone.trim()) {
      setContactError("Please specify at least your Name and Phone Number.");
      return;
    }
    setContactError("");
    setContactSubmitted(true);
    // Persist in mock storage
    const inquiries = JSON.parse(localStorage.getItem("everest_inquiries") || "[]");
    inquiries.push({ ...contactForm, date: new Date().toISOString() });
    localStorage.setItem("everest_inquiries", JSON.stringify(inquiries));
  };

  // Handle Join registration submit
  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinForm.name.trim() || !joinForm.phone.trim()) {
      return;
    }
    setJoinSubmitted(true);
    // Persist registered member
    const members = JSON.parse(localStorage.getItem("everest_members") || "[]");
    members.push({ 
      ...joinForm, 
      planId: selectedPlan?.id || "not-specified",
      planName: selectedPlan?.name || "General Inquiry",
      price: selectedPlan ? (isAnnual ? Math.round(selectedPlan.priceMonthly * selectedPlan.priceAnnualFactor) : selectedPlan.priceMonthly) : "Custom",
      billing: isAnnual ? "Annual" : "Monthly",
      date: new Date().toISOString() 
    });
    localStorage.setItem("everest_members", JSON.stringify(members));
  };

  const triggerJoinFlow = (plan: PricingPlan | null) => {
    setSelectedPlan(plan);
    setJoinSubmitted(false);
    setJoinForm({ name: "", phone: "", email: "", preferredTime: "morning" });
    setIsJoinModalOpen(true);
  };

  // WhatsApp Redirection Message Generators
  const getWhatsAppBookingUrl = (name: string, goal: string, timeShift: string) => {
    const interest = goal ? goal.trim() : "Custom Coaching";
    const textStr = `Hello Everestgym Kolkata! I'd like to book an appointment for a free trainer assessment.
• Name: ${name || "Interested Member"}
• Fitness Goal: ${interest}
• Shift Preference: ${timeShift.toUpperCase()}`;
    return `https://wa.me/919123008338?text=${encodeURIComponent(textStr)}`;
  };

  const getWhatsAppPlanBookingUrl = (name: string, planName: string, billing: string, timeShift: string) => {
    const textStr = `Hello Everestgym Kolkata! I just registered my profile for the ${planName} (${billing}) and would like to schedule my induction.
• Name: ${name || "Interested Member"}
• Preferred Workout Shift: ${timeShift.toUpperCase()}`;
    return `https://wa.me/919123008338?text=${encodeURIComponent(textStr)}`;
  };

  // Filtered gallery computation
  const filteredGallery = GALLERY_ITEMS.filter(item => 
    galleryFilter === "all" ? true : item.category === galleryFilter
  );

  return (
    <div className="min-h-screen text-zinc-100 font-sans selection:bg-brand selection:text-white bg-bg-dark">
      
      {/* ────────────────────────────────────────────────────────
          STICKY HEADER
          ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-zinc-900 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Brand Logo */}
            <a href="#home" className="flex items-center space-x-2 group">
              <span className="flex items-center justify-center w-10 h-10 rounded bg-brand text-white font-display font-extrabold text-xl tracking-wider shadow-lg shadow-brand/20 group-hover:bg-brand-hover transition-colors">
                E
              </span>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg tracking-wide uppercase text-white group-hover:text-brand transition-colors">
                  EVEREST<span className="text-brand">GYM</span>
                </span>
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 -mt-1">
                  KOLKATA
                </span>
              </div>
            </a>

            {/* Desktop Navigation Link Menu */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <a href="#about" className="text-zinc-400 hover:text-white transition-colors">About</a>
              <a href="#services" className="text-zinc-400 hover:text-white transition-colors">Services</a>
              <a href="#estimator" className="text-zinc-400 hover:text-white transition-colors">Metabolic Burn</a>
              <a href="#gallery" className="text-zinc-400 hover:text-white transition-colors">Gallery</a>
              <a href="#pricing" className="text-zinc-400 hover:text-white transition-colors">Memberships</a>
              <a href="#hours" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isOpenNow ? "bg-green-500 animate-pulse" : "bg-zinc-650"}`} />
                Hours
              </a>
              <a href="#contact" className="text-zinc-400 hover:text-white transition-colors">Contact</a>
            </nav>

            {/* Desktop Quick Header Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <a 
                href={`tel:${GYM_INFO.phoneRaw}`} 
                className="flex items-center text-xs font-mono text-zinc-350 hover:text-brand transition-colors py-2 px-3 border border-zinc-900 rounded bg-[#0B0B0C]/60"
              >
                <Phone className="w-3.5 h-3.5 mr-2 text-brand" />
                {GYM_INFO.phone}
              </a>
              <button 
                onClick={() => triggerJoinFlow(null)}
                className="bg-brand hover:bg-brand-hover text-white px-5 py-2 rounded font-display font-semibold text-xs uppercase tracking-wider shadow-lg shadow-brand/10 hover:shadow-brand/20 active:translate-y-0.5 transition-all"
              >
                Join Now
              </button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden items-center space-x-3">
              <a 
                href={`tel:${GYM_INFO.phoneRaw}`} 
                className="p-2 sm:px-3 sm:py-1.5 border border-zinc-900 rounded bg-[#0B0B0C] hover:bg-[#121214] text-zinc-300 flex items-center text-xs"
                title="Call Everestgym"
              >
                <Phone className="w-4 h-4 text-brand" />
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 border border-zinc-900 rounded bg-[#0B0B0C] text-zinc-400 hover:text-white hover:bg-[#121214]"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden bg-bg-dark border-b border-zinc-900 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-3">
                <div className="grid grid-cols-2 gap-2 pb-2">
                  <div className="flex items-center p-2 rounded bg-[#0B0B0C] border border-zinc-900">
                    <span className={`w-2.5 h-2.5 rounded-full mr-2 ${isOpenNow ? "bg-green-500 animate-pulse" : "bg-zinc-650"}`} />
                    <span className="text-[11px] font-mono text-zinc-300 font-medium">{isOpenNow ? "OPEN NOW" : "CLOSED NOW"}</span>
                  </div>
                  <div className="flex items-center justify-end p-2 rounded bg-[#050505] border border-zinc-900">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="text-[11px] font-mono text-zinc-300 font-semibold">4.8 (34 Reviews)</span>
                  </div>
                </div>

                <a 
                  href="#about" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded bg-[#0B0B0C] hover:bg-[#121214] text-zinc-100 font-medium"
                >
                  About Everestgym
                </a>
                <a 
                  href="#services" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded bg-[#0B0B0C] hover:bg-[#121214] text-zinc-100 font-medium"
                >
                  Our Professional Services
                </a>
                <a 
                  href="#estimator" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded bg-[#0B0B0C] hover:bg-[#121214] text-zinc-100 font-medium"
                >
                  Calorie Estimator
                </a>
                <a 
                  href="#gallery" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded bg-[#0B0B0C] hover:bg-[#121214] text-zinc-100 font-medium"
                >
                  Photo Gallery
                </a>
                <a 
                  href="#pricing" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded bg-[#0B0B0C] hover:bg-[#121214] text-zinc-100 font-medium"
                >
                  Membership Pricing Plans
                </a>
                <a 
                  href="#hours" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded bg-[#0B0B0C] hover:bg-[#121214] text-zinc-100 font-medium"
                >
                  Business Hours List
                </a>
                <a 
                  href="#contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded bg-[#0B0B0C] hover:bg-[#121214] text-zinc-100 font-medium text-brand"
                >
                  Find Us & Contact
                </a>

                <div className="pt-2 flex flex-col gap-2">
                  <button 
                  onClick={() => { setMobileMenuOpen(false); triggerJoinFlow(null); }}
                  className="w-full text-center bg-brand hover:bg-brand-hover text-white font-display py-3 rounded uppercase font-semibold text-xs tracking-wider"
                  >
                    Join Everestgym Now
                  </button>
                  <a 
                    href={`tel:${GYM_INFO.phoneRaw}`}
                    className="w-full py-3 border border-zinc-900 rounded bg-[#0B0B0C] hover:bg-[#121214] text-zinc-300 text-center text-xs font-mono flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-brand" />
                    Call Direct: {GYM_INFO.phone}
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ────────────────────────────────────────────────────────
          1. HERO SECTION
          ──────────────────────────────────────────────────────── */}
      <section id="home" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden py-16 sm:py-24">
        
        {/* Background Image with Rich Overlay Gradient */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/src/assets/images/everestgym_hero_1781894166481.jpg" 
            alt="Everestgym premium athletic floor" 
            className="w-full h-full object-cover object-center scale-105 filter brightness-45 contrast-110"
            referrerPolicy="no-referrer"
          />
          {/* Radial glow and directional linear black transitions */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]/45" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_15%,_#050505_90%)] opacity-90" />
        </div>

        {/* Decorative Neon safety orange outline glow representing mountain peak */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl text-left">
            
            {/* Top Tagline Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-brand/35 bg-brand/10 text-brand font-mono text-xs font-semibold mb-6 tracking-wide uppercase backdrop-blur-sm shadow-[0_0_15px_rgba(255,95,31,0.05)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand animate-spin" style={{ animationDuration: "12s" }} />
              <span>THE SUPREME PEAK OF FITNESS IN KOLKATA</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight uppercase leading-none text-white"
            >
              CONQUER YOUR LIMITS.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-amber-450 to-[#FF4500]">
                REACH YOUR SUMMIT.
              </span>
            </motion.h1>

            {/* Core brief description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg md:text-xl text-zinc-300 leading-relaxed max-w-2xl font-light"
            >
              Unleash your true biological physical potential at Rajarhat's premier gym. Backed by an incredible 
              <span className="text-white font-semibold"> 4.8-star</span> community standard, Everestgym combines state-of-the-art strength lines with certified custom fitness coaching.
            </motion.p>

            {/* Key badges row on mobile/desktop */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400"
            >
              <div className="flex items-center space-x-1 border border-zinc-900 bg-[#0B0B0C]/80 py-1.5 px-3 rounded">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                <span className="text-zinc-200 font-semibold font-sans">4.8 Stars</span>
                <span>(34 Reviews)</span>
              </div>
              <div className="flex items-center space-x-1.5 border border-zinc-900 bg-[#0B0B0C]/80 py-1.5 px-3 rounded">
                <span className={`w-2 h-2 rounded-full ${isOpenNow ? "bg-green-500 animate-pulse" : "bg-zinc-600"}`} />
                <span className="text-zinc-200 font-semibold font-sans uppercase">{isOpenNow ? "Open Now" : "Closed Now"}</span>
              </div>
              <div className="text-zinc-400">
                📍 Sulonguri Rd, Rajarhat
              </div>
            </motion.div>

            {/* Action Buttons Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 sm:items-center"
            >
              <button 
                onClick={() => triggerJoinFlow(null)}
                className="group flex items-center justify-center gap-2.5 bg-brand hover:bg-brand-hover text-white font-display py-4 px-8 rounded font-bold uppercase tracking-wider text-sm shadow-xl shadow-brand/10 hover:shadow-brand/20 active:translate-y-0.5 hover:scale-[1.01] transition-all duration-300"
              >
                Start Climbing - Join Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
              
              <div className="flex gap-2.5">
                <a 
                  href={`tel:${GYM_INFO.phoneRaw}`}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 border border-zinc-800 hover:border-brand bg-[#0B0B0C]/90 hover:bg-[#121214] px-6 py-4 rounded font-display font-bold uppercase tracking-wider text-xs text-white transition-all duration-300"
                >
                  <Phone className="w-3.5 h-3.5 text-brand" />
                  Call Now
                </a>
                
                <a 
                  href={GYM_INFO.mapDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 border border-zinc-900 hover:border-zinc-800 bg-[#050505]/95 hover:bg-[#0B0B0C] px-6 py-4 rounded font-display font-medium uppercase tracking-wider text-xs text-zinc-300 transition-colors duration-300"
                >
                  <Map className="w-3.5 h-3.5 text-zinc-400" />
                  Directions
                </a>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Diagonal visual slice decoration at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
      </section>

      {/* ────────────────────────────────────────────────────────
          2. ABOUT EVERESTGYM SECTION
          ──────────────────────────────────────────────────────── */}
      <section id="about" className="py-24 bg-bg-dark relative overflow-hidden">
        
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141416_1px,transparent_1px),linear-gradient(to_bottom,#141416_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: Overlapping Dynamic Images with stat card */}
            <div className="relative">
              
              {/* Outer Glow behind image */}
              <div className="absolute -top-10 -left-10 w-44 h-44 bg-brand/10 blur-[60px] rounded-full pointer-events-none" />
              
              <div className="aspect-[4/3] rounded-lg overflow-hidden border-2 border-zinc-900 shadow-2xl relative bg-[#0B0B0C]">
                <img 
                  src="/src/assets/images/everestgym_weights_1781894182963.jpg" 
                  alt="Everestgym high quality dumbbell rack setup" 
                  className="w-full h-full object-cover select-none hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Embedded Floating Metrics Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#0B0B0C]/90 backdrop-blur border border-zinc-900 p-4 rounded-lg flex items-center justify-between shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded bg-brand text-white shadow-[0_0_15px_rgba(255,95,31,0.25)] flex items-center justify-center">
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-white font-display font-extrabold text-sm tracking-wide">34+ LOCAL REVIEW MEMBERS</div>
                      <div className="text-xs text-zinc-400 font-mono">Consistently rated as top Rajarhat Gym</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-yellow-500 font-bold text-sm">
                      <Star className="w-3.5 h-3.5 fill-current mr-1" />
                      4.8
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">OUT OF 5.0</span>
                  </div>
                </div>
              </div>

              {/* Backing decorative panel representing base camp */}
              <div className="absolute -bottom-6 -right-6 w-1/2 h-1/2 rounded bg-gradient-to-br from-brand/15 to-amber-500/10 -z-10 border border-brand/10 hide-on-mobile" />
            </div>

            {/* Right Column: Narrative text */}
            <div className="text-left">
              
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-8 h-0.5 bg-brand" />
                <span className="font-mono text-xs font-bold text-brand uppercase tracking-widest">ABOUT EVERESTGYM</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold uppercase text-white tracking-tight">
                THE SUMMIT IS ONLY THE BEGINNING
              </h2>
              
              <p className="mt-6 text-zinc-300 leading-relaxed font-light">
                Why "Everest"? Because we believe fitness is not a plateau; it is an active climb toward your premium self. Located on <span className="text-zinc-100 font-semibold">Sulonguri Road, Rajarhat</span>, Everestgym is designed for those who desire genuine equipment, structured progress, and a raw, performance-oriented atmosphere without the corporate pretense.
              </p>

              <blockquote className="mt-6 border-l-4 border-brand pl-4 py-1 italic text-zinc-400 text-sm">
                "Our space is meticulously clean, exceptionally bright, and built around heavy dumbbells, solid iron, robust lifting rigs, and high-efficiency dynamic turf pathways."
              </blockquote>

              <p className="mt-4 text-zinc-400 text-sm leading-relaxed">
                Whether you are step one into your physical rehabilitation, looking to shed persistent body mass, or prepping for advanced athletic competitions, we supply the precise biomechanical tooling and coaches to guide you safely.
              </p>

              {/* Features Quick List */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-200">Elite Biomechanical Layout</h4>
                    <p className="text-xs text-zinc-400">Target muscle paths with ergonomic machinery.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-200">Flexible 16.5-Hour Windows</h4>
                    <p className="text-xs text-zinc-400">Open early at 6:00 AM to late night 10:30 PM.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-200">34+ Authenticated Reviews</h4>
                    <p className="text-xs text-zinc-400">Local family of lifters rating us at 4.8 stars.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-200">Clean, Maintained Hygiene</h4>
                    <p className="text-xs text-zinc-400">Disinfected daily for secure, safe training.</p>
                  </div>
                </div>
              </div>

            </div>
                  <span className="font-mono text-xs font-bold text-brand uppercase tracking-widest">WHAT WE EXCEL AT</span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold uppercase text-white mt-3 tracking-tight">
              WORLD-CLASS TRAINING DIVISIONS
            </h2>
            <p className="mt-4 text-zinc-450 text-sm sm:text-base leading-relaxed">
              We host specialized equipment lines and tailored coaching packages tailored specifically around your biological target pathways.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, index) => (
              <motion.div 
                key={service.id}
                whileHover={{ y: -6, borderColor: "var(--color-brand)" }}
                className="bg-[#121214]/50 hover:bg-[#121214]/80 p-8 rounded-lg border border-zinc-900 transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  {/* Service Icon Container */}
                  <div className="w-12 h-12 rounded bg-brand text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,95,31,0.25)] mb-6 group-hover:scale-105 transition-transform">
                    {renderServiceIcon(service.iconName)}
                  </div>

                  <h3 className="text-lg font-display font-extrabold uppercase text-white tracking-wide">
                    {service.title}
                  </h3>

                  <p className="text-zinc-450 text-xs sm:text-sm mt-3 leading-relaxed font-light">
                    {service.description}
                  </p>
                </div>

                {/* Sub Features Details list */}
                <div className="mt-6 pt-5 border-t border-zinc-900/60">
                  <ul className="space-y-2 text-xs font-mono text-zinc-400">
                    {service.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded bg-brand" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to action card within services */}
          <div className="mt-16 bg-[#121214]/40 border border-zinc-900 p-8 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-brand/30 transition-all duration-300">
            <div className="text-left">
              <h3 className="text-lg sm:text-xl font-display font-extrabold uppercase text-white">Not sure which path fits your current dynamic state?</h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl font-light">
                Schedule a complimentary 10-minute assessment with a floor counselor. We will weigh your compound strength baseline and establish a metabolic draft.
              </p>
            </div>
            <button 
              onClick={() => triggerJoinFlow(null)}
              className="w-full sm:w-auto bg-brand/10 hover:bg-brand/15 px-6 py-3.5 border border-brand/35 hover:border-brand text-brand font-display text-xs uppercase tracking-wider font-bold rounded shrink-0 transition-all duration-300"
            >
              Consult a Coach
            </button>
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          4. WHY CHOOSE US
          ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-bg-dark relative overflow-hidden">
        
        {/* Subtle glowing peaks representing Everest in background */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-brand/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="text-left">
              <span className="font-mono text-xs font-bold text-brand uppercase tracking-widest">WHY TRAIN WITH US</span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold uppercase text-white mt-3 tracking-tight">
                DESIGNED FOR THOSE WHO ACT
              </h2>
              <p className="mt-4 text-zinc-450 text-sm leading-relaxed">
                Everestgym is structured intentionally to optimize your workout density. No crowded rows, no missing keys, and plenty of plates.
              </p>

              {/* Point grid list */}
              <div className="mt-8 space-y-6">
                
                {/* Point 1 */}
                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border border-brand/35 bg-brand/10 flex items-center justify-center text-brand font-mono text-xs font-bold">
                    01
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white uppercase tracking-wide">Elite Mechanical Integrity</h3>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                      Our machinery comprises biomechanically sound line loading, solid steel bars, custom rubber floor layers, and true non-slip heavy grips.
                    </p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border border-brand/35 bg-brand/10 flex items-center justify-center text-brand font-mono text-xs font-bold">
                    02
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white uppercase tracking-wide">Friendly, Certified floor presence</h3>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                      Our coaches are active professional lifters and athletic scientists, always supportive, highly safety-conscious, and specialized in body design.
                    </p>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border border-brand/35 bg-brand/10 flex items-center justify-center text-brand font-mono text-xs font-bold">
                    03
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white uppercase tracking-wide">Dynamic hours matching your life</h3>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                      Whether you prefer high-intensity early sunrise cardio at 6 AM or high-capacity powerlifting at 10 PM on a Wednesday, the deck is set up and well lit.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right: Beautiful grid of mini-stat blocks */}
            <div className="grid grid-cols-2 gap-4">
              
              <div className="bg-[#121214]/40 p-8 border border-zinc-900 rounded-lg text-left">
                <span className="text-3xl sm:text-4xl font-display font-extrabold block text-white">4.8</span>
                <span className="text-xs font-mono text-brand tracking-wider uppercase block mt-1">Google Rating</span>
                <p className="text-[11px] text-zinc-400 mt-3 leading-normal font-light">
                  Based on 34 community members review records from Sulonguri Rd.
                </p>
              </div>

              <div className="bg-[#121214]/40 p-8 border border-zinc-900 rounded-lg text-left">
                <span className="text-3xl sm:text-4xl font-display font-extrabold block text-white">16.5</span>
                <span className="text-xs font-mono text-brand tracking-wider uppercase block mt-1">Daily Hrs</span>
                <p className="text-[11px] text-zinc-400 mt-3 leading-normal font-light">
                  6:00 AM to 10:30 PM shift Monday through Saturday.
                </p>
              </div>

              <div className="bg-[#121214]/40 p-8 border border-zinc-900 rounded-lg text-left">
                <span className="text-3xl sm:text-4xl font-display font-extrabold block text-white">3</span>
                <span className="text-xs font-mono text-brand tracking-wider uppercase block mt-1">Premium Tiers</span>
                <p className="text-[11px] text-zinc-400 mt-3 leading-normal font-light">
                  No hidden induction fees. Clear, honest pricing for everyone.
                </p>
              </div>

              <div className="bg-[#121214]/40 p-8 border border-zinc-900 rounded-lg text-left">
                <span className="text-3xl sm:text-4xl font-display font-extrabold block text-white">100%</span>
                <span className="text-xs font-mono text-brand tracking-wider uppercase block mt-1">Commitment</span>
                <p className="text-[11px] text-zinc-400 mt-3 leading-normal font-light">
                  Every squad orientation incorporates full barbell safety setup.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          5. METABOLIC BURN / CALORIE ESTIMATOR
          ──────────────────────────────────────────────────────── */}
      <section id="estimator" className="py-24 bg-[#0B0B0C] border-y border-zinc-900 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 justify-center text-xs font-mono text-brand uppercase font-semibold">
              <Scale className="w-4 h-4" />
              <span>EVEREST CALORIC COMPASS</span>
            </div>
            <h2 className="text-3xl font-display font-extrabold uppercase text-white mt-1.5 tracking-tight">
              METABOLIC WORKOUT CALCULATOR
            </h2>
            <p className="mt-3 text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-light">
              Estimate your active calorie utilization based on body mass coefficient calculations. Enter your physical target and see.
            </p>
          </div>

          {/* Calculator Card */}
          <div className="bg-bg-dark rounded-lg border border-zinc-900 p-8 shadow-2xl relative shadow-brand/5">
            <form onSubmit={handleCalculateBurn} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
              
              {/* Inputs */}
              <div className="space-y-5 text-left">
                <div>
                  <label htmlFor="user-weight" className="block text-xs font-mono uppercase text-zinc-450 tracking-wider mb-2">
                    YOUR BODY WEIGHT (KG):
                  </label>
                  <input 
                    id="user-weight"
                    type="number" 
                    value={calculatorWeight}
                    onChange={(e) => setCalculatorWeight(e.target.value)}
                    required
                    min="30"
                    max="250"
                    placeholder="e.g. 70"
                    className="w-full bg-[#121214] border border-zinc-900 rounded px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="user-discipline" className="block text-xs font-mono uppercase text-zinc-450 tracking-wider mb-2">
                    TARGET SPORT DISCIPLINE:
                  </label>
                  <select 
                    id="user-discipline"
                    value={calculatorWorkout}
                    onChange={(e) => setCalculatorWorkout(e.target.value)}
                    className="w-full bg-[#121214] border border-zinc-900 rounded px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand appearance-none cursor-pointer transition-all"
                  >
                    <option value="strength">🏋️ Strength & Mechanical Power lifting</option>
                    <option value="cardio">🏃 Advanced Cardio Treadmill / Rowing</option>
                    <option value="hiit">⚡ Calorie-burning HIIT circuits</option>
                    <option value="coaching">🧘 Mobility & Conditioning rehab</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-brand hover:bg-brand-hover text-white font-display uppercase tracking-widest font-bold py-3 px-6 text-xs rounded transition-all active:translate-y-0.5 shadow-lg shadow-brand/10 hover:shadow-brand/20"
                >
                  Estimate Compound Burn
                </button>
              </div>

              {/* Graphical result dial representation */}
              <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-zinc-900/60 pt-8 md:pt-0 md:pl-8 text-center">
                <span className="text-[10px] font-mono text-zinc-450 tracking-widest uppercase">ESTIMATED UTILIZATION</span>
                
                {calculatorResult !== null ? (
                  <div className="mt-4 relative">
                    {/* Ring graphics */}
                    <div className="w-40 h-40 rounded-full border-4 border-zinc-900 flex items-center justify-center relative">
                      {/* Active color arc layer simulated with outline borders */}
                      <div className="absolute inset-0 rounded-full border-t-4 border-r-4 border-brand animate-pulse" />
                      
                      <div className="flex flex-col items-center">
                        <span className="text-4xl font-display font-extrabold text-white tracking-widest">
                          {calculatorResult}
                        </span>
                        <span className="text-[9px] font-mono text-brand font-semibold tracking-wider -mt-1">
                          KCAL / HOUR
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-1.5 justify-center text-xs text-zinc-300">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Scientifically modelled calculation</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 py-10">
                    <span className="text-xs text-brand/80">Please enter a valid body weight.</span>
                  </div>
                )}

                <p className="text-[11px] text-zinc-500 italic mt-4 max-w-xs leading-normal font-light">
                  Metabolic Equivalents (METs) measure cellular energy draw relative to resting metabolic rate. Actual performance results may fluctuate based on target heart variance.
                </p>
              </div>

            </form>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          6. GALLERY SECTION
          ──────────────────────────────────────────────────────── */}
      <section id="gallery" className="py-24 bg-bg-dark relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="text-left max-w-xl">
              <span className="font-mono text-xs font-bold text-brand uppercase tracking-widest">INSIDE THE CLIFFS</span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold uppercase text-white mt-1 tracking-tight">
                THE EVERESTGYM FLOOR
              </h2>
              <p className="mt-2 text-zinc-450 text-xs sm:text-sm font-light">
                Take a look at our clean visual setup, modern design highlights, and heavy-duty compound coaching tools.
              </p>
            </div>

            {/* Category selection Tabs */}
            <div className="flex flex-wrap gap-2.5 mt-6 md:mt-0">
              {(["all", "floor", "cardio", "weights"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setGalleryFilter(tab)}
                  className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded border transition-all ${
                    galleryFilter === tab 
                      ? "bg-brand border-brand text-white font-semibold shadow-[0_0_15px_rgba(255,95,31,0.2)]" 
                      : "bg-[#0B0B0C] border-zinc-900 text-zinc-450 hover:text-white"
                  }`}
                >
                  {tab === "all" ? "All Spaces" : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Image Grid with Layout Animate */}
          <motion.div 
            layout 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredGallery.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={item.id}
                  className="group relative rounded-lg overflow-hidden border border-zinc-900 aspect-[4/3] bg-zinc-900/40"
                >
                  <img 
                    src={item.src} 
                    alt={item.alt} 
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Hover visual label overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left">
                    <span className="text-[10px] font-mono text-brand uppercase tracking-widest font-semibold">{item.category} Zone</span>
                    <h4 className="text-white font-display font-extrabold text-sm uppercase mt-1 tracking-wide">{item.title}</h4>
                    <p className="text-xs text-zinc-400 font-sans mt-0.5 font-light">{item.alt}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>
      <section id="pricing" className="py-24 bg-[#0B0B0C] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-mono text-xs font-bold text-brand uppercase tracking-widest">TRANSPARENT VALUE</span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold uppercase text-white mt-1.5 tracking-tight">
              COMMUNITY MEMBERSHIP TIERS
            </h2>
            <p className="mt-3 text-zinc-450 text-xs sm:text-sm font-light">
              No registration sign-on traps. Select your duration, activate your dynamic profile, and join the climb.
            </p>

            {/* Monthly / Annual Toggle Switch */}
            <div className="mt-8 inline-flex items-center justify-center p-1 rounded-full bg-bg-dark border border-zinc-900">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all cursor-pointer ${
                  !isAnnual 
                    ? "bg-brand text-white font-semibold" 
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                Monthly Plan
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`relative px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5 ${
                  isAnnual 
                    ? "bg-brand text-white font-semibold" 
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                <span>Annual Saver</span>
                <span className="bg-[#0B0B0C] border border-zinc-900 text-yellow-400 font-mono text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                  SAVE %
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {PRICING_PLANS.map((plan) => {
              const currentPrice = isAnnual 
                ? Math.round(plan.priceMonthly * plan.priceAnnualFactor) 
                : plan.priceMonthly;

              return (
                <div 
                  key={plan.id}
                  className={`rounded-lg border-2 p-8 flex flex-col justify-between relative transition-all duration-300 bg-bg-dark ${
                    plan.popular 
                      ? "border-brand shadow-2xl shadow-brand/10 md:-translate-y-3" 
                      : "border-zinc-900 hover:border-brand/40"
                  }`}
                >
                  {/* Popular tag accent */}
                  {plan.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand to-[#FF4500] text-white font-mono text-[10px] uppercase font-extrabold px-4 py-1 rounded-full tracking-wider border border-brand/50 shadow">
                      MOST POPULAR PEAK Choice
                    </span>
                  )}

                  <div>
                    {/* Header */}
                    <div className="text-left">
                      <span className="text-xs font-mono uppercase text-zinc-450 tracking-wider block">{plan.name}</span>
                      
                      {/* Price view */}
                      <div className="mt-4 flex items-baseline">
                        <span className="text-sm font-sans font-semibold text-zinc-500 mr-1">{plan.prefix}</span>
                        <span className="text-4xl font-display font-extrabold text-white tracking-wide">
                          {currentPrice}
                        </span>
                        <span className="text-xs font-mono text-zinc-550 ml-2">/ month</span>
                      </div>
                      
                      {isAnnual && (
                        <span className="text-[10px] font-mono text-green-500 uppercase tracking-wider block mt-1.5">
                          Billed ₹{currentPrice * 12} annually (including savings)
                        </span>
                      )}
                    </div>

                    {/* Feature list split bar */}
                    <ul className="mt-8 space-y-4 border-t border-zinc-900/60 pt-6 text-left">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start text-xs sm:text-sm text-zinc-300">
                          <Check className="w-4 h-4 text-brand mr-2.5 shrink-0 mt-0.5" />
                          <span className="font-light">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing action button triggers prefilled register flow */}
                  <div className="mt-8">
                    <button
                      onClick={() => triggerJoinFlow(plan)}
                      className={`w-full font-display uppercase tracking-widest text-xs font-bold py-3 px-6 rounded-md active:translate-y-0.5 transition-all text-center cursor-pointer ${
                        plan.popular 
                          ? "bg-brand hover:bg-brand-hover text-white shadow-xl shadow-brand/20" 
                          : "bg-[#121214] hover:bg-[#18181A] border border-zinc-900 text-zinc-300 hover:text-white"
                      }`}
                    >
                      Choose {plan.name}
                    </button>
                    <span className="text-[10px] text-zinc-550 block text-center mt-3 font-mono">
                      Cancelable with zero exit assessment penalties.
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Quick trust assurances */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-xs font-mono text-zinc-500">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-zinc-600" />
              <span>Full locker & hot-shower usage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-zinc-600" />
              <span>Complimentary introductory assessment</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-zinc-600" />
              <span>Disinfectant sanitization station setups</span>
            </div>
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          8. REVIEWS & COMMUNITY STANDARD TESTIMONIALS
          ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-bg-dark relative overflow-hidden">
        
        {/* Decorative background circle reflection */}
        <div className="absolute left-10 top-1/4 w-[500px] h-[250px] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main heading */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1 bg-[#121214] border border-zinc-900 rounded px-3 py-1 font-mono text-[10px] text-zinc-300 font-bold uppercase tracking-widest">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span>4.8 AVERAGE COMMUNITY RATING</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold uppercase text-white mt-4 tracking-tight">
              FROM THE EVEREST CLIMBERS
            </h2>
            <p className="mt-3 text-zinc-400 text-xs sm:text-sm font-light">
              We are defined entirely by the outcomes of our resident lifting community. See authentic feedback from members trained at Rajarhat, Kolkata.
            </p>
          </div>

          {/* Testimonial cards grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {REVIEWS.map((review) => (
              <div 
                key={review.id}
                className="bg-[#121214]/40 p-8 rounded-lg border border-zinc-900 flex flex-col justify-between text-left hover:border-brand/35 transition-all duration-300 font-light"
              >
                <div>
                  
                  {/* Star Rating Layout */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(review.rating) 
                            ? "text-yellow-500 fill-yellow-500" 
                            : "text-zinc-800 fill-zinc-800"
                        }`} 
                      />
                    ))}
                    <span className="text-[10px] font-mono text-zinc-400 ml-2">{review.rating} out of 5</span>
                  </div>

                  {/* Review Text */}
                  <p className="text-zinc-300 italic text-xs sm:text-sm leading-relaxed">
                    "{review.text}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="mt-6 pt-5 border-t border-zinc-900/60 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={review.avatar} 
                      alt={review.author} 
                      className="w-10 h-10 rounded-full object-cover border border-zinc-900"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-zinc-250 font-bold text-xs sm:text-sm leading-none">{review.author}</h4>
                      <span className="text-[10px] text-zinc-500 font-mono mt-0.5 inline-block">EVEREST MEMBER</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block bg-brand/10 border border-brand/20 text-brand font-mono text-[9px] font-semibold px-2 py-0.5 rounded">
                      {review.tag}
                    </span>
                    <span className="block text-[10px] text-zinc-500 font-mono mt-1">{review.date}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          9. BUSINESS HOURS SECTION
          ──────────────────────────────────────────────────────── */}
      <section id="hours" className="py-24 bg-zinc-900 border-t border-zinc-850 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Narrative with currently status card */}
            <div className="text-left">
              <span className="font-mono text-xs font-bold text-red-500 uppercase tracking-widest">CLOCK IN FOR RESULTS</span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold uppercase text-white mt-1.5 tracking-tight">
                DYNAMIC BUSINESS HOURS
              </h2>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed">
                Fitness demands consistency. Everestgym maintains premium, extended hours daily, structured with split shifts to match physical demands on weekends.
              </p>

              {/* Status Indicator Panel */}
              <div className="mt-8 p-6 rounded-lg bg-zinc-950 border border-zinc-850 flex items-center space-x-4">
                <div className={`p-4 rounded-full ${isOpenNow ? "bg-green-950 text-green-500" : "bg-zinc-900 text-zinc-550"}`}>
                  <Clock className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isOpenNow ? "bg-green-500 animate-pulse" : "bg-zinc-500"}`} />
                    <span className={`font-display font-extrabold text-sm tracking-wider uppercase ${isOpenNow ? "text-green-500" : "text-zinc-450"}`}>
                      {isOpenNow ? "THE DECK IS ACTIVE" : "STATION RECHARGE"}
                    </span>
                  </div>
                  <h4 className="text-white font-bold text-base mt-0.5">{statusMessage}</h4>
                  <p className="text-[11px] text-zinc-400 font-mono mt-1">Gym location: Sulonguri Rd, Sulanggari, Rajarhat, Kolkata</p>
                </div>
              </div>

              <div className="mt-6 text-xs text-zinc-450 leading-relaxed max-w-md">
                💡 <span className="text-zinc-300">Holiday policy:</span> Everestgym follows standardized municipal civic calendars. Check our direct Instagram feeds for special event orientations.
              </div>
            </div>

            {/* Right: Hours Table Graphic list */}
            <div className="bg-zinc-950 p-8 rounded-lg border border-zinc-800 shadow-2xl">
              <div className="flex justify-between items-center pb-5 border-b border-zinc-900 mb-6">
                <h3 className="font-display font-extrabold text-sm uppercase text-white tracking-widest">REGULAR PHYSICAL CALENDAR</h3>
                <span className="text-[10px] font-mono text-red-500 font-semibold tracking-wider uppercase">SEVEN DAYS ACTIVE</span>
              </div>

              <div className="space-y-4">
                {WEEKLY_HOURS.map((dObj) => {
                  const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
                  const isToday = dObj.day.toLowerCase() === dayName.toLowerCase();

                  return (
                    <div 
                      key={dObj.day}
                      className={`flex justify-between items-center py-2 px-3 rounded text-xs tracking-wide ${
                        isToday 
                          ? "bg-red-950/20 border border-red-900/30 font-semibold text-white" 
                          : "text-zinc-300 border border-transparent hover:border-zinc-900"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {isToday && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />}
                        <span className="font-mono text-xs">{dObj.day}</span>
                        {isToday && <span className="text-[9px] font-mono bg-red-650 text-white font-extrabold px-1.5 py-0.25 rounded ml-2 uppercase">TODAY</span>}
                      </div>
                      <span className="font-mono text-zinc-200">{dObj.hours}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-5 border-t border-zinc-900 flex justify-between items-center">
                <span className="text-[10px] font-mono text-zinc-400">MEMBERSHIP ACCESS HOURS:</span>
                <span className="text-xs font-mono font-bold text-white">SAME AS GENERAL HOURS</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          10. CONTACT SECTION WITH GOOGLE MAP EMBED
          ──────────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 bg-zinc-950 relative overflow-hidden">
        
        {/* Background visual red glow overlay */}
        <div className="absolute right-10 top-1/4 w-[400px] h-[200px] bg-red-650/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left: Contact Info and Map */}
            <div className="text-left space-y-8">
              <div>
                <span className="font-mono text-xs font-bold text-red-500 uppercase tracking-widest">GET IN TOUCH</span>
                <h2 className="text-3xl sm:text-4xl font-display font-extrabold uppercase text-white mt-1.5 tracking-tight">
                  CONQUER YOUR START
                </h2>
                <p className="mt-3 text-zinc-400 text-xs sm:text-sm">
                  We answer client calls directly and respond to web digital inquiries daily. Contact or drop in for physical base-camp tour.
                </p>
              </div>

              {/* Detail Blocks */}
              <div className="space-y-4">
                
                {/* Block 1: Phone */}
                <a 
                  href={`tel:${GYM_INFO.phoneRaw}`}
                  className="flex items-start p-4 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition"
                >
                  <Phone className="w-5 h-5 text-red-500 mr-3 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-mono uppercase font-bold text-zinc-300">CALL GENERAL COUNSEL DIRECT</h4>
                    <p className="text-sm font-semibold text-white mt-0.5">{GYM_INFO.phone}</p>
                    <span className="text-[10px] text-zinc-500 font-mono">Immediate assistance during opening shifts</span>
                  </div>
                </a>

                {/* Block 2: Address */}
                <a 
                  href={GYM_INFO.mapDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start p-4 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition"
                >
                  <MapPin className="w-5 h-5 text-red-500 mr-3 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-mono uppercase font-bold text-zinc-300">PHYSICAL LOCATION</h4>
                    <p className="text-sm sm:text-sm text-zinc-200 mt-1 leading-relaxed">
                      Sulonguri Rd, Sulanggari, Hatiara, Rajarhat, Kolkata, West Bengal 700162
                    </p>
                    <span className="text-[10px] text-red-500 font-mono uppercase hover:underline inline-flex items-center gap-1 mt-1">
                      LAUNCH DIRECTIONS ON PHONE MAP <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </a>

              </div>

              {/* Actual Google Iframe Map Embed pointing to Rajarhat location */}
              <div className="rounded-lg overflow-hidden border border-zinc-800 aspect-[16/9] shadow-lg relative bg-zinc-900">
                <iframe 
                  title="Everestgym Rajarhat Kolkata Map Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.053677464197!2d88.441!3d22.6105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02758156ffffb3%3A0xe54df9d1cf339bf4!2sEverestgym!5e0!3m2!1sen!2sin!4v1781894100000"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale invert opacity-80 filter contrast-125"
                />
              </div>

            </div>

            {/* Right: Dynamic Contact Inquiry Form */}
            <div className="bg-zinc-900/40 p-8 rounded-lg border border-zinc-800 relative">
              <div className="absolute top-0 right-1/4 w-32 h-32 bg-red-650/5 blur-3xl pointer-events-none" />

              <h3 className="font-display font-extrabold text-lg uppercase text-white tracking-wide text-left mb-2">SEND AN INQUIRY</h3>
              <p className="text-xs text-zinc-400 text-left mb-4 leading-relaxed font-light">
                Enter your details below. A coach will reach out to you within 24 hours to schedule your free baseline orientation.
              </p>

              {/* Direct Quick WhatsApp Booker */}
              <div className="mb-6 p-4 rounded bg-[#25D366]/5 border border-[#25D366]/15 hover:border-[#25D366]/25 transition duration-300 text-left">
                <span className="block text-[9px] font-mono text-[#25D366] uppercase tracking-widest font-semibold mb-1">FASTEST OPTION</span>
                <p className="text-xs text-zinc-350 leading-relaxed font-light mb-3">
                  Prefer instant scheduling? Tap below to chat directly with our front desk coach via WhatsApp.
                </p>
                <a 
                  href="https://wa.me/919123008338?text=Hello%20Everestgym%20Kolkata!%20I'd%20like%20to%20book%20a%20free%20trial%20session%20and%20consultation%20appointment."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba56] text-white font-display font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded transition-all active:translate-y-0.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white/10" />
                  Instant WhatsApp Booking
                </a>
              </div>

              <div className="flex items-center gap-4 my-6">
                <div className="h-px bg-zinc-800/60 flex-1" />
                <span className="text-[9px] font-mono text-zinc-500 uppercase">OR SUBMIT CORRESPONDENCE</span>
                <div className="h-px bg-zinc-800/60 flex-1" />
              </div>

              {contactSubmitted ? (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-950 border border-green-800 text-green-550 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-display font-extrabold uppercase text-white">INQUIRY RECEIVED!</h4>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-3 max-w-sm mx-auto leading-relaxed">
                    Thank you <span className="text-zinc-200 font-semibold">{contactForm.name}</span>. We will save this contact. A floor coach will dial <span className="text-zinc-200 font-semibold">{contactForm.phone}</span> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setContactSubmitted(false);
                      setContactForm({ name: "", phone: "", email: "", message: "" });
                    }}
                    className="mt-8 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs uppercase px-5 py-2.5 rounded transition"
                  >
                    Submit another draft
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
                  {contactError && (
                    <div className="p-3 bg-red-950/40 border border-red-900/30 text-red-400 rounded text-xs font-mono">
                      {contactError}
                    </div>
                  )}

                  <div>
                    <label htmlFor="user-name" className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      id="user-name"
                      type="text" 
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                      placeholder="e.g. Sneha Mukherjee"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-red-650 focus:border-red-600 transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="user-phone" className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-zinc-500 font-mono text-xs">+91</span>
                      <input 
                        id="user-phone"
                        type="tel" 
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        required
                        placeholder="091230 08338"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded pl-11 pr-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-red-650 focus:border-red-600 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="user-email" className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input 
                      id="user-email"
                      type="email" 
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="e.g. climber@everestgym.in"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-red-650 focus:border-red-600 transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="user-message" className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                      Your Message / Fitness Goals
                    </label>
                    <textarea 
                      id="user-message"
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="e.g. I want to build physical strength and schedule a tour."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 transition resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-red-650 hover:bg-red-700 text-white font-display uppercase tracking-widest font-bold py-3 px-6 text-xs rounded transition-all active:translate-y-0.5 shadow-xl shadow-red-950/40"
                  >
                    Submit Baseline Registration Inquiries
                  </button>

                  <div className="text-[10px] text-zinc-500 font-mono leading-relaxed pt-2">
                    🔒 By clicking submit, you authorize Everestgym to place an initial athletic follow-up call. We do not distribute subscriber metrics to third parties.
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          FOOTER WITH DETAILS AND QUICK LINKS
          ──────────────────────────────────────────────────────── */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-16 text-left text-zinc-400 text-xs relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Column 1: Brand details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center w-8 h-8 rounded bg-red-600 text-white font-display font-extrabold text-sm tracking-widest">
                  E
                </span>
                <span className="font-display font-bold text-lg tracking-wider text-white">
                  EVEREST<span className="text-red-600">GYM</span>
                </span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-light">
                Premium raw fitness culture on Sulonguri Road, Rajarhat, Kolkata. Structured around elite biomechanics, heavy lifters, and dynamic community support.
              </p>
              <div className="flex space-x-3 pt-2">
                <a 
                  href="https://facebook.com" 
                  aria-label="Facebook Profile"
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-red-650 hover:border-red-600 hover:text-white transition-all text-zinc-400"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a 
                  href="https://instagram.com" 
                  aria-label="Instagram Profile"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-red-650 hover:border-red-600 hover:text-white transition-all text-zinc-400"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-4">
              <h4 className="font-display font-extrabold text-sm uppercase text-white tracking-widest">QUICK SECTIONS</h4>
              <nav className="flex flex-col space-y-2.5 font-mono text-xs">
                <a href="#about" className="hover:text-red-500 transition-colors">About Everest</a>
                <a href="#services" className="hover:text-red-500 transition-colors">Services Divisions</a>
                <a href="#estimator" className="hover:text-red-500 transition-colors">Calorie compass</a>
                <a href="#gallery" className="hover:text-red-500 transition-colors">Photo Grid</a>
                <a href="#pricing" className="hover:text-red-500 transition-colors">Pricing Packages</a>
                <a href="#hours" className="hover:text-red-500 transition-colors">Business Calendar</a>
              </nav>
            </div>

            {/* Column 3: Contact quick Info */}
            <div className="space-y-4">
              <h4 className="font-display font-extrabold text-sm uppercase text-white tracking-widest">VISIT US IN PERSON</h4>
              <div className="space-y-2.5 leading-relaxed font-light">
                <p className="text-zinc-300">
                  📍 Sulonguri Rd, Sulanggari, Hatiara, Rajarhat, Kolkata, WB 700162
                </p>
                <div className="pt-2">
                  <span className="block text-[10px] font-mono text-zinc-500 uppercase">DIRECT PHONE:</span>
                  <a href={`tel:${GYM_INFO.phoneRaw}`} className="text-white hover:text-red-500 font-semibold font-mono text-sm leading-none">{GYM_INFO.phone}</a>
                </div>
                <div className="pt-1">
                  <span className="block text-[10px] font-mono text-zinc-500 uppercase">SUPPORT EMAIL:</span>
                  <a href={`mailto:${GYM_INFO.email}`} className="text-zinc-300 hover:text-red-500 font-mono">{GYM_INFO.email}</a>
                </div>
              </div>
            </div>

            {/* Column 4: Trust parameters */}
            <div className="space-y-4">
              <h4 className="font-display font-extrabold text-sm uppercase text-white tracking-widest">EVEREST STANDARD</h4>
              <div className="bg-zinc-900 duration-300 p-4 border border-zinc-800 rounded">
                <span className="text-yellow-400 font-bold block text-sm">★★★★★ 4.8 / 5.0</span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mt-1">34 REVIEWS ON GOOGLE</span>
                <p className="text-[10px] mt-2 leading-relaxed text-zinc-400">
                  Consistently named as a top mechanical strength facilities in Hatiara / Rajarhat sector.
                </p>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-zinc-650 text-[10px] font-mono">
            <p>© 2026 Everestgym Kolkata. All physical rights reserved.</p>
            <p className="mt-2 sm:mt-0 flex items-center gap-1.5">
              <span>Crafted in performance spirit</span>
              <span className="text-red-650">●</span>
              <a href="#home" className="hover:text-zinc-400 transition-colors">CONQUER HIGHER</a>
            </p>
          </div>
        </div>
      </footer>

      {/* ────────────────────────────────────────────────────────
          11. INTERACTIVE ACTIONS / REGISTER MODAL POPUP
          ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isJoinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop layer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-lg p-8 shadow-2xl relative z-10 text-left overflow-y-auto max-h-[90vh]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsJoinModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-900 text-zinc-455 hover:text-white hover:bg-zinc-800"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {joinSubmitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-green-950 border border-green-800 text-green-500 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-display font-extrabold text-xl uppercase text-white">CONGRATULATIONS, {joinForm.name}!</h3>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-3 leading-relaxed">
                    You have successfully initiated your ascent registration at <span className="text-white font-semibold">Everestgym</span>.
                  </p>

                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded mt-6 text-left max-w-sm mx-auto">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">TIER SELECTION:</div>
                    <div className="text-sm font-bold text-white uppercase mt-0.5">{selectedPlan ? selectedPlan.name : "Base Trial Orientation"}</div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-zinc-800 text-xs">
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase block">BILLING PERIOD:</span>
                        <span className="text-zinc-200 mt-0.25 block">{isAnnual ? "Annual Saver" : "Monthly Recurring"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase block">RATE ESTIMATE:</span>
                        <span className="text-red-500 mt-0.25 font-bold block">
                          ₹{selectedPlan ? (isAnnual ? Math.round(selectedPlan.priceMonthly * selectedPlan.priceAnnualFactor) : selectedPlan.priceMonthly) : "0 (Trial)"} / mo
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500 mt-6 font-mono">
                    Please bring dynamic footwear and a personal lifting towel. Our coach will voice dial you at <span className="text-zinc-350 font-bold">{joinForm.phone}</span>.
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a
                      href={getWhatsAppPlanBookingUrl(
                        joinForm.name,
                        selectedPlan ? selectedPlan.name : "Base Trial Orientation",
                        isAnnual ? "Annual" : "Monthly",
                        joinForm.preferredTime
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba56] text-white font-display text-xs uppercase font-extrabold py-3.5 px-6 rounded tracking-wider shadow-lg shadow-[#25D366]/20 active:translate-y-0.5 transition-all"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      Instant Confirm via WhatsApp
                    </a>

                    <button
                      onClick={() => setIsJoinModalOpen(false)}
                      className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-display text-xs uppercase font-bold py-3.5 px-6 rounded tracking-wider transition-all"
                    >
                      Done / Close
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  
                  {/* Badge header */}
                  <div className="flex items-center gap-1.5 text-xs text-red-500 font-mono uppercase mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>EVEREST METRICS REGISTRATION</span>
                  </div>

                  <h3 className="font-display font-extrabold text-2xl uppercase text-white tracking-wide">
                    {selectedPlan ? `JOIN ${selectedPlan.name.toUpperCase()}` : "START YOUR SUMMIT BASECAMP"}
                  </h3>
                  
                  <p className="text-zinc-440 text-xs mt-1.5 leading-relaxed">
                    Configure your physical baseline profile below. We will secure your slot with zero immediate checkout authorization requirements.
                  </p>

                  {/* Plan display detail */}
                  {selectedPlan && (
                    <div className="my-5 p-4 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">Selected Membership:</span>
                        <h4 className="text-white font-bold font-display text-sm uppercase mt-0.5">{selectedPlan.name}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">Monthly Price:</span>
                        <div className="text-white font-extrabold text-lg">
                          ₹{isAnnual ? Math.round(selectedPlan.priceMonthly * selectedPlan.priceAnnualFactor) : selectedPlan.priceMonthly}
                          <span className="text-xs text-zinc-400 font-light font-mono">/mo</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Registration form */}
                  <form onSubmit={handleJoinSubmit} className="space-y-4 mt-6">
                    <div>
                      <label htmlFor="join-name" className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                        Your Full Name <span className="text-red-550">*</span>
                      </label>
                      <input 
                        id="join-name"
                        type="text" 
                        required
                        value={joinForm.name}
                        onChange={(e) => setJoinForm({ ...joinForm, name: e.target.value })}
                        placeholder="e.g. Sneha Mukherjee"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-red-650"
                      />
                    </div>

                    <div>
                      <label htmlFor="join-phone" className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                        Phone Number <span className="text-red-550">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-zinc-500 font-mono text-xs">+91</span>
                        <input 
                          id="join-phone"
                          type="tel" 
                          required
                          value={joinForm.phone}
                          onChange={(e) => setJoinForm({ ...joinForm, phone: e.target.value })}
                          placeholder="091230 08338"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded pl-11 pr-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-red-650"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="join-email" className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                          Email Address
                        </label>
                        <input 
                          id="join-email"
                          type="email" 
                          value={joinForm.email}
                          onChange={(e) => setJoinForm({ ...joinForm, email: e.target.value })}
                          placeholder="e.g. climber@everestgym.in"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-red-650"
                        />
                      </div>

                      <div>
                        <label htmlFor="join-time" className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                          Preferred Gym Session
                        </label>
                        <select 
                          id="join-time"
                          value={joinForm.preferredTime}
                          onChange={(e) => setJoinForm({ ...joinForm, preferredTime: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-red-650 appearance-none cursor-pointer"
                        >
                          <option value="morning">🌅 Early Morning (6:00 AM - 10:00 AM)</option>
                          <option value="noon">☀️ Mid Day (10:00 AM - 4:00 PM)</option>
                          <option value="evening">🌇 Sunset Rush (4:00 PM - 8:00 PM)</option>
                          <option value="night">🌌 Late Night Ascent (8:00 PM - 10:30 PM)</option>
                        </select>
                      </div>
                    </div>

                    {/* Submit Registration button */}
                    <button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-650 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-display uppercase tracking-widest font-extrabold py-4 px-6 text-xs rounded transition-all active:translate-y-0.5 shadow-xl shadow-red-950/60 mt-4"
                    >
                      Confirm Baseline Profile Details
                    </button>

                    <p className="text-[10px] text-zinc-500 font-mono text-center mt-3">
                      💡 Zero upfront cost. Your baseline parameters are locked for 7 calendar days.
                    </p>

                  </form>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ────────────────────────────────────────────────────────
          12. FLOATING WHATSAPP CHAT ASSISTANT
          ──────────────────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        
        {/* Chat Widget Panel */}
        <AnimatePresence>
          {isWhatsAppWidgetOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-[#0b0b0c] border border-zinc-900 rounded-xl shadow-2xl w-80 sm:w-85 overflow-hidden mb-4 select-none"
            >
              {/* Header */}
              <div className="bg-[#121214] border-b border-zinc-900/60 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-left">
                  <div className="relative w-9 h-9 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                    <MessageCircle className="w-5 h-5 fill-[#25D366]/10" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25D366] border border-[#121214]" />
                  </div>
                  <div>
                    <h4 className="text-white font-display font-extrabold uppercase text-xs tracking-wider">Everest Chat Assist</h4>
                    <span className="text-[10px] text-zinc-500 font-mono">Typically replies instantly</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsWhatsAppWidgetOpen(false)}
                  className="p-1 rounded hover:bg-zinc-905 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close chat window"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Message Body */}
              <div className="p-4 bg-[#070707] min-h-[90px] border-b border-zinc-900/40 text-left">
                <div className="bg-[#121214] border border-zinc-900 p-3.5 rounded-lg">
                  <p className="text-xs text-zinc-350 leading-relaxed font-light">
                    Hello! Welcome to <span className="font-bold text-white uppercase font-display tracking-wide">Everestgym</span>. 🏋️‍♂️
                  </p>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light mt-1.5">
                    Ready to start your fitness journey? Let's book your free assessment session instantly via WhatsApp!
                  </p>
                </div>
              </div>

              {/* Chat Input Form */}
              <div className="p-4 bg-[#0b0b0c] space-y-3.5">
                <div className="text-left">
                  <label htmlFor="wa-name" className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    id="wa-name"
                    type="text"
                    required
                    value={whatsappForm.name}
                    onChange={(e) => setWhatsappForm({ ...whatsappForm, name: e.target.value })}
                    placeholder="e.g. Sneha Mukherjee"
                    className="w-full bg-zinc-950 border border-zinc-900 rounded px-3 py-2.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#25D366] focus:border-[#25D366] transition placeholder-zinc-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <div>
                    <label htmlFor="wa-goal" className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
                      Your Main Goal
                    </label>
                    <select
                      id="wa-goal"
                      value={whatsappForm.goal}
                      onChange={(e) => setWhatsappForm({ ...whatsappForm, goal: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded px-2.5 py-2.5 text-white text-[11px] focus:outline-none focus:ring-1 focus:ring-[#25D366] appearance-none cursor-pointer"
                    >
                      <option value="Strength Training">🏋️ Strength Training</option>
                      <option value="Cardio & HIIT">⚡ Cardio & HIIT</option>
                      <option value="Muscle Gain / Hypertrophy">💪 Muscle Gain</option>
                      <option value="Weight Loss Systems">📉 Weight Loss</option>
                      <option value="Personal Coaching">🤝 Personal Coaching</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="wa-shift" className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
                      Shift Preference
                    </label>
                    <select
                      id="wa-shift"
                      value={whatsappForm.timeShift}
                      onChange={(e) => setWhatsappForm({ ...whatsappForm, timeShift: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded px-2.5 py-2.5 text-white text-[11px] focus:outline-none focus:ring-1 focus:ring-[#25D366] appearance-none cursor-pointer"
                    >
                      <option value="morning">🌅 Morning Shift</option>
                      <option value="midday">☀️ Midday Slot</option>
                      <option value="evening">🌇 Evening Shift</option>
                      <option value="night">🌌 Late Night Slot</option>
                    </select>
                  </div>
                </div>

                {/* Submit Redirect Link */}
                <a
                  href={getWhatsAppBookingUrl(whatsappForm.name, whatsappForm.goal, whatsappForm.timeShift)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    // Save locally for persistence tracking
                    const appointments = JSON.parse(localStorage.getItem("everest_whatsapp_bookings") || "[]");
                    appointments.push({ ...whatsappForm, date: new Date().toISOString() });
                    localStorage.setItem("everest_whatsapp_bookings", JSON.stringify(appointments));
                    
                    // Close widget layout after redirect callback
                    setTimeout(() => setIsWhatsAppWidgetOpen(false), 500);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba56] text-white font-display text-[11px] uppercase tracking-widest font-extrabold py-3 px-4 rounded transition-all shadow-lg shadow-[#25D366]/10 hover:shadow-[#25D366]/20 active:translate-y-0.5 text-center mt-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Request on WhatsApp
                </a>
                
                <span className="block text-[8.5px] text-zinc-500 font-mono uppercase text-center mt-1 tracking-wider">
                  Direct WhatsApp Response
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Trigger Button */}
        <button
          onClick={() => setIsWhatsAppWidgetOpen(!isWhatsAppWidgetOpen)}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl active:translate-y-0.5 transition-all outline-none group cursor-pointer ${
            isWhatsAppWidgetOpen 
              ? "bg-zinc-900 border border-zinc-800 rotate-90" 
              : "bg-[#25D366] hover:bg-[#20ba56]"
          }`}
          aria-label="Toggle WhatsApp Chat Assistance"
        >
          {isWhatsAppWidgetOpen ? (
            <X className="w-5 h-5 transition-transform duration-300" />
          ) : (
            <div className="relative">
              <MessageCircle className="w-7 h-7 fill-white/10 group-hover:scale-105 transition-transform duration-300" />
              
              {/* Pulsing indicator light */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
              </span>
            </div>
          )}
          
          {/* Subtle text tooltips on hover (desktop only) */}
          <span className="absolute right-16 bg-[#121214] border border-zinc-800 font-mono text-[10px] tracking-widest uppercase font-semibold text-zinc-350 py-1.5 px-3 rounded shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap hidden md:inline-block">
            Book Appointment
          </span>
        </button>

      </div>

    </div>
  );
}
