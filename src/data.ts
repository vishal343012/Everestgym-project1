export interface GymService {
  id: string;
  title: string;
  description: string;
  iconName: string; // Will match Lucide icon names dynamically
  benefits: string[];
}

export interface PricingPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnualFactor: number; // e.g., 0.8 for 20% off
  features: string[];
  popular: boolean;
  prefix: string; // currency prefix, e.g. "₹"
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number; // 4 or 5
  date: string;
  text: string;
  tag: string; // e.g., "Weight Loss", "Muscle Gain"
  avatar: string;
}

export interface GalleryItem {
  id: string;
  category: "all" | "floor" | "cardio" | "weights";
  title: string;
  src: string;
  alt: string;
}

export interface BusinessDay {
  day: string;
  hours: string;
  openTime: string; // e.g., "06:00"
  closeTime: string; // e.g., "22:30"
  isSunday: boolean;
}

export const GYM_INFO = {
  name: "Everestgym",
  phone: "091230 08338",
  phoneRaw: "+919123008338",
  address: "Sulonguri Rd, Sulanggari, Hatiara, Rajarhat, Kolkata, West Bengal 700162",
  mapDirectionsUrl: "https://maps.google.com/?q=Everestgym+Sulonguri+Rd+Rajarhat+Kolkata",
  rating: 4.8,
  reviewsCount: 34,
  email: "info@everestgym.in"
};

export const SERVICES: GymService[] = [
  {
    id: "strength",
    title: "Strength Training",
    description: "Build exceptional structural power with our Olympic barbells, custom plates, and top-tier heavy power racks designed for raw strength.",
    iconName: "Dumbbell",
    benefits: ["Olympic lifting platforms", "Heaviest dumbbells in Rajarhat", "Expert form adjustments"]
  },
  {
    id: "cardio",
    title: "Cardio & HIIT",
    description: "Enhance respiratory endurance and ignite high calorie-burn with high-end mechanical treadmills, ellipticals, rowing systems, and dynamic turf.",
    iconName: "Zap",
    benefits: ["Real-time biometric monitoring", "Premium treadmills & spin bikes", "Guided high-energy HIIT tracks"]
  },
  {
    id: "weight-loss",
    title: "Weight Loss Systems",
    description: "Sustained lifestyle fat loss combining intense calorie burning routines with scientifically-backed metabolic training and body composition tracking.",
    iconName: "TrendingDown",
    benefits: ["InBody body-fat analysis", "Custom caloric profiling", "Targeted lifestyle tracking"]
  },
  {
    id: "personal-training",
    title: "Personal Training",
    description: "Accelerate results with highly certified premium personal trainers providing custom programming, technical feedback, and continuous motivation.",
    iconName: "Users",
    benefits: ["1-on-1 biomechanical coaching", "Weekly progression testing", "Custom active rehab options"]
  },
  {
    id: "muscle-building",
    title: "Muscle Building",
    description: "Hypertrophy-focused training templates with precise cable setups, leverage plate-loaded machine lines, and strategic recovery suggestions.",
    iconName: "Target",
    benefits: ["Isolation-focused plate loaded systems", "Scientific hypertrophy guidance", "Amino acid & nutrient coaching"]
  },
  {
    id: "fitness-coaching",
    title: "Fitness Coaching",
    description: "Comprehensive lifestyle architectural planning incorporating nutrition counseling, habit redesign, structural therapy, and athletic conditioning.",
    iconName: "HeartPulse",
    benefits: ["24/7 direct messaging access", "Macro-nutrition meal guides", "Flexibility & mobility routines"]
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Base Camp Plan",
    priceMonthly: 1200,
    priceAnnualFactor: 0.8, // 20% discount
    features: [
      "Full locker room & hot shower access",
      "All standard cardiovascular equipment",
      "Full strength zone & heavy barbell racks",
      "1x Fitness assessment baseline session",
      "Dynamic lockers & free high-speed Wi-Fi"
    ],
    popular: false,
    prefix: "₹"
  },
  {
    id: "pro",
    name: "Everest Ascent Team",
    priceMonthly: 2000,
    priceAnnualFactor: 0.75, // 25% discount (making it extremely attractive!)
    features: [
      "EVERYTHING in Base Camp access",
      "Assigned floor coach & biomechanics setup",
      "Custom specialized weight training routines",
      "Interactive InBody fat composition reports",
      "Priority VIP booking for group circuits",
      "Free nutritional baseline masterclass"
    ],
    popular: true,
    prefix: "₹"
  },
  {
    id: "summit",
    name: "Summit Club VIP",
    priceMonthly: 3500,
    priceAnnualFactor: 0.7, // 30% discount
    features: [
      "EVERYTHING in Ascent & Base Camp level",
      "1-on-1 Certified Personal Training (4 sessions/month)",
      "Daily personalized metabolic nutrition plans",
      "Unlimited guest day-passes (1 per day)",
      "Advance booking for all boutique fitness camps",
      "Exclusive Everestgym peak performance shirt"
    ],
    popular: false,
    prefix: "₹"
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    category: "floor",
    title: "Everestgym Advanced Squat Rack",
    src: "/src/assets/images/everestgym_hero_1781894166481.jpg",
    alt: "Everestgym advanced barbell training on red ambient lit gym floor"
  },
  {
    id: "g2",
    category: "weights",
    title: "Premium Dumbbell Lineup",
    src: "/src/assets/images/everestgym_weights_1781894182963.jpg",
    alt: "Heavy duty premium dumbbells arranged on robust rack under red spotlights"
  },
  {
    id: "g3",
    category: "cardio",
    title: "Premium Cardio Running Row",
    src: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800",
    alt: "Premium treadmill cardio deck with concrete and industrial layout"
  },
  {
    id: "g4",
    category: "weights",
    title: "Kettlebell & Functional Training Area",
    src: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800",
    alt: "Black cast iron kettlebells and barbells laying on heavy athletic floor"
  },
  {
    id: "g5",
    category: "floor",
    title: "Intense Battle Ropes Circuit",
    src: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&q=80&w=800",
    alt: "Athlete slamming down high intensity battle ropes in sports studio"
  },
  {
    id: "g6",
    category: "floor",
    title: "Dedicated Heavy Powerlifting Area",
    src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    alt: "High-spec power racks inside clean workout aesthetic"
  }
];

export const REVIEWS: ReviewItem[] = [
  {
    id: "rev1",
    author: "Sneha Mukherjee",
    rating: 5,
    date: "2 weeks ago",
    text: "Everestgym is hands down the best place to workout around Rajarhat! The red-and-black theme gives an incredible boost of energy. Very well-equipped and friendly trainers who actually guide you regarding proper biomechanical posters.",
    tag: "Strength Training",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "rev2",
    author: "Rahul Bhattacharya",
    rating: 5,
    date: "1 month ago",
    text: "Superb gym setup on Sulonguri Road! Certified equipment, superb ventilation, and spacious platforms compared to others in Kolkata. The hours are extremely flexible too (open 6 AM to 10:30 PM). Highly recommended!",
    tag: "Muscle Building",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "rev3",
    author: "Priyam Sen",
    rating: 4.8,
    date: "3 weeks ago",
    text: "I joined the 3-month fat loss program here. Excellent results! The floor trainers are extremely alert and supportive. The membership prices are very affordable considering the high quality of equipment.",
    tag: "Weight Loss",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "rev4",
    author: "Abhishek Mandal",
    rating: 5,
    date: "2 months ago",
    text: "Outstanding atmosphere and very clean! They maintain high hygiene standards, which is a major factor for me. The pricing plans are extremely clear with no hidden charges. Highly supportive staff.",
    tag: "Personal Training",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
  }
];

// Actual weekly hours requested by business
export const WEEKLY_HOURS: BusinessDay[] = [
  { day: "Monday", hours: "6:00 AM – 10:30 PM", openTime: "06:00", closeTime: "22:30", isSunday: false },
  { day: "Tuesday", hours: "6:00 AM – 10:30 PM", openTime: "06:00", closeTime: "22:30", isSunday: false },
  { day: "Wednesday", hours: "6:00 AM – 10:30 PM", openTime: "06:00", closeTime: "22:30", isSunday: false },
  { day: "Thursday", hours: "6:00 AM – 10:30 PM", openTime: "06:00", closeTime: "22:30", isSunday: false },
  { day: "Friday", hours: "6:00 AM – 10:30 PM", openTime: "06:00", closeTime: "22:30", isSunday: false },
  { day: "Saturday", hours: "6:00 AM – 10:30 PM", openTime: "06:00", closeTime: "22:30", isSunday: false },
  { day: "Sunday", hours: "6:00 AM – 4:30 PM", openTime: "06:00", closeTime: "16:30", isSunday: true }
];
