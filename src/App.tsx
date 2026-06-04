import React, { useState, useRef, useEffect } from "react";
import { 
  Camera, 
  UploadCloud, 
  Globe, 
  MapPin, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Info, 
  Sparkles, 
  History, 
  BookOpen, 
  Compass, 
  ExternalLink, 
  AlertCircle, 
  Navigation, 
  Image as ImageIcon,
  Loader2,
  X,
  Play,
  Square,
  Star,
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  Share2,
  Download,
  Palette,
  Copy,
  Ticket,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudSun,
  Wind,
  Thermometer,
  Twitter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ARAnchor {
  label: string;
  x: number;
  y: number;
  description: string;
}

interface NearbyRecommendation {
  name: string;
  type: string;
  info: string;
}

interface LandmarkResult {
  landmarkName: string;
  city: string;
  country: string;
  coordinates: string;
  yearBuilt: string;
  shortHistory: string;
  narrationScript: string;
  arAnchors: ARAnchor[];
  funFacts: string[];
  searchLinks?: Array<{ title: string; uri: string }>;
  nearbyRecommendations?: NearbyRecommendation[];
  isDemo?: boolean;
}

interface TourCheckpoint {
  landmarkName: string;
  city: string;
  country: string;
  url: string;
  desc: string;
}

interface ThemedTour {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  badge: string;
  checkpoints: TourCheckpoint[];
}

const THEMED_TOURS: ThemedTour[] = [
  {
    id: "romance-grandeur-paris",
    title: "Eiffel & Romantic Highlights",
    description: "Discover the breathtaking architectural evolution of Paris. Experience the legendary wrought-iron Eiffel Tower, learn about its secrets, and explore the nearby Parisian trails.",
    estimatedTime: "1h 15m",
    badge: "Romantic & Industrial",
    checkpoints: [
      {
        landmarkName: "Eiffel Tower",
        city: "Paris",
        country: "France",
        url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop",
        desc: "Gustave Eiffel's industrial masterpiece of wrought iron."
      },
      {
        landmarkName: "Statue of Liberty",
        city: "New York (French Roots)",
        country: "USA",
        url: "https://images.unsplash.com/photo-1524008279394-3aed401d4090?w=800&auto=format&fit=crop",
        desc: "Designed by Bartholdi, with Eiffel's iron tower structural skeleton inside."
      }
    ]
  },
  {
    id: "ancient-wonders",
    title: "Ancient Monuments Trail",
    description: "Journey through humanity's oldest surviving wonders. Wander past the ancient Roman travertine stones and unravel the solar dials of Salisbury Plains.",
    estimatedTime: "2h 30m",
    badge: "Classical Antiquity",
    checkpoints: [
      {
        landmarkName: "The Colosseum",
        city: "Rome",
        country: "Italy",
        url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop",
        desc: "Rome's glorious, double-tier Flavian amphitheater."
      },
      {
        landmarkName: "Stonehenge",
        city: "Wiltshire",
        country: "United Kingdom",
        url: "https://images.unsplash.com/photo-1599833975787-5c143f373c30?w=800&auto=format&fit=crop",
        desc: "Prehistoric astronomical monolith circle of Wiltshire."
      }
    ]
  },
  {
    id: "eastern-heritage",
    title: "Spiritual Path of the East",
    description: "Experience the profound sacred structures of the East where imperial love and centuries-old wooden shrines reflect the beauty of devotion.",
    estimatedTime: "1h 45m",
    badge: "Spiritual Heritage",
    checkpoints: [
      {
        landmarkName: "Senso-ji Temple",
        city: "Tokyo",
        country: "Japan",
        url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop",
        desc: "Tokyo's sacred Buddhist temple of Kannon, founded in Asakusa."
      },
      {
        landmarkName: "Taj Mahal",
        city: "Agra",
        country: "India",
        url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop",
        desc: "Shah Jahan's white marble tribute to Mumtaz Mahal."
      }
    ]
  }
];

const LANDMARK_PRESETS: Record<string, LandmarkResult> = {
  "Eiffel Tower": {
    landmarkName: "Eiffel Tower",
    city: "Paris",
    country: "France",
    coordinates: "48.8584° N, 2.2945° E",
    yearBuilt: "1889",
    shortHistory: "Built as the entrance arch for the 1889 World's Fair in celebration of the centennial of the French Revolution, the Eiffel Tower is a globally recognized masterwork of puddle iron craftsmanship by engineer Gustave Eiffel.",
    narrationScript: "Bonjour and welcome to Paris! Looking at the majestic Eiffel Tower before you, did you know that it stands at 330 meters tall and was once the tallest man-made structure in the world? Built in 1889 by Gustave Eiffel, it contains over two million hand-placed rivets. Look closely at the floating tags on your screen to explore the architectural marvels—including the double-deck hydraulic lifts and the towering summit observation desk!",
    arAnchors: [
      { label: "The Summit", x: 50, y: 15, description: "The highest accessible outdoor observation deck in the European Union at 276 meters." },
      { label: "Hydraulic Elevators", x: 30, y: 75, description: "Original historic double-deck elevators designed to work on the curving legs of the tower." },
      { label: "Wrought Iron Lattice", x: 68, y: 45, description: "Constructed using 18,018 iron pieces joined by 2.5 million individual rivets." }
    ],
    funFacts: [
      "Thermal Expansion: The tower grows up to 15 centimeters taller in the summer heat and shrinks in winter.",
      "Hand Painted: It is entirely repainted by hand every 7 years using 60 tons of custom 'Eiffel Tower Brown' shading."
    ],
    searchLinks: [
      { title: "Official Eiffel Tower Site", uri: "https://www.toureiffel.paris/en" },
      { title: "Britannica: Eiffel Tower History", uri: "https://www.britannica.com/topic/Eiffel-Tower" }
    ]
  },
  "The Colosseum": {
    landmarkName: "The Colosseum",
    city: "Rome",
    country: "Italy",
    coordinates: "41.8902° N, 12.4922° E",
    yearBuilt: "80 AD",
    shortHistory: "The Colosseum, also known as the Flavian Amphitheatre, is an oval amphitheatre in the centre of the city of Rome, Italy. Built of travertine limestone, tuff, and brick-faced concrete, it was the largest amphitheatre ever built at the time and held up to 65,000 spectators.",
    narrationScript: "Welcome to Rome! Behold the mighty Colosseum, the grandest amphitheatre of the ancient world. Commissioned by Emperor Vespasian in 72 AD and completed under Titus in 80 AD, this marvel of travertine and concrete hosted dramatic gladiatorial spectacles, mock sea battles, and theatrical plays. Touch the floating AR anchors on your screen to inspect the imperial arches, the underground hypogeum layout, and the legendary arena floor!",
    arAnchors: [
      { label: "Arena Floor", x: 50, y: 65, description: "The wooden floor covered with sand where gladiators and animals once fought, now partially reconstructed." },
      { label: "The Hypogeum", x: 45, y: 80, description: "The intricate network of tunnels and cages underneath the arena where gladiators and beasts were kept." },
      { label: "Imperial Archways", x: 25, y: 35, description: "A system of 80 radial entrance arches allowing crowds of 50,000+ to exit or enter in minutes." }
    ],
    funFacts: [
      "Vast Spectacle: More than 400,000 people and 1 million animals are estimated to have died within its walls during games.",
      "Travertine Source: The massive stone structures were bound together by 300 tons of iron clamps rather than mortar."
    ],
    searchLinks: [
      { title: "Parco Archeologico del Colosseo", uri: "https://parcocolosseo.it/en" },
      { title: "History Channel: Colosseum History", uri: "https://www.history.com/topics/ancient-history/colosseum" }
    ]
  },
  "Senso-ji Temple": {
    landmarkName: "Senso-ji Temple",
    city: "Tokyo",
    country: "Japan",
    coordinates: "35.7148° N, 139.7967° E",
    yearBuilt: "645 AD",
    shortHistory: "Senso-ji is Tokyo's oldest and most prestigious Buddhist temple, dedicated to the Bodhisattva Kannon. Founded in 645 AD, it is situated in the historic cultural ward of Asakusa and remains a vibrant spiritual heart of Japan.",
    narrationScript: "Kon'nichiwa and welcome to Asakusa, Tokyo! Enter through the majestic Kaminarimon Gate to Seng-oji temple, Tokyo's oldest spiritual sanctuary dating back to 645 AD. Legend says two fishermen discovered a golden statue of Kannon, the goddess of mercy, in the nearby Sumida River, prompting the temple's construction. Witness the towering five-story pagoda and Nakamise shopping street through our floating AR lens tags!",
    arAnchors: [
      { label: "Kaminarimon Gate", x: 50, y: 70, description: "The Outer Gate features a colossal 700-kilogram red paper lantern representing Thunder and Wind." },
      { label: "Five-Story Pagoda", x: 25, y: 30, description: "Reaching 53 meters, it is a magnificent replica storing sacred Buddhist relics." },
      { label: "Incense Burner (Jokoro)", x: 70, y: 75, description: "A huge bronze incense burner; travelers bathe themselves in its smoke for health and good fortune." }
    ],
    funFacts: [
      "Spiritual Survivors: The sacred Kannon statue is said to be permanently buried beneath the temple main hall, never shown to public.",
      "Historic Shopping: The bustling approach, Nakamise-dori, has provided pilgrims with snacks and souvenirs since the Edo period."
    ],
    searchLinks: [
      { title: "Senso-ji Official Website", uri: "https://www.senso-ji.jp/english" },
      { title: "Go Tokyo: Asakusa & Sensoji", uri: "https://www.gotokyo.org/en/spot/1" }
    ]
  },
  "Statue of Liberty": {
    landmarkName: "Statue of Liberty",
    city: "New York",
    country: "USA",
    coordinates: "40.6892° N, 74.0445° W",
    yearBuilt: "1886",
    shortHistory: "A colossal neoclassical sculpture on Liberty Island in New York Harbor, designed by Frédéric Auguste Bartholdi and built by Gustave Eiffel. A gift from the people of France, it represents Libertas, the Roman goddess of freedom.",
    narrationScript: "Welcome to New York Harbor! Facing you is the Statue of Liberty, dedicated on October 28, 1886. Designed by sculptor Bartholdi with an internal iron frame built by Gustave Eiffel, her copper skin has oxidized to this beautiful green patina. Look closely at the floating tags to explore her crown representing the seven continents, her golden torch, and the broken chains at her feet!",
    arAnchors: [
      { label: "The Golden Torch", x: 62, y: 15, description: "The original torch was replaced in 1986 with a copper flame gilded in 24K gold leaf." },
      { label: "The Crown", x: 45, y: 25, description: "Features 25 windows and 7 rays symbolizing the seven seas and continents of the world." },
      { label: "The Tablet", x: 30, y: 35, description: "Inscribed with JULY IV MDCCLXXVI (July 4, 1776), commemorating the Declaration of Independence." }
    ],
    funFacts: [
      "Copper Source: The exterior is made of copper sheets just 2.4 millimeters thick—the same thinness as two pennies stacked together.",
      "High Winds: In heavy storms, Liberty can sway up to 3 inches, and her golden torch can sway up to 5 inches!"
    ],
    searchLinks: [
      { title: "NPS: Statue of Liberty Site", uri: "https://www.nps.gov/stli/index.htm" },
      { title: "The Liberty Statue Foundation", uri: "https://www.statueofliberty.org" }
    ]
  },
  "Taj Mahal": {
    landmarkName: "Taj Mahal",
    city: "Agra",
    country: "India",
    coordinates: "27.1751° N, 78.0421° E",
    yearBuilt: "1648",
    shortHistory: "The Taj Mahal is an ivory-white marble mausoleum on the south bank of the Yamuna river in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal.",
    narrationScript: "Welcome to Agra! You are gazing at the Taj Mahal, the ultimate monument to eternal love. Constructed between 1632 and 1653 by Mughal Emperor Shah Jahan for his beloved queen Mumtaz Mahal, it employed over 20,000 artisans. Its pure white Makrana marble changes hue depending on the hour of the day. Map the floating anchors to inspect the symmetrical dome, flanking minarets, and the paradise garden pools!",
    arAnchors: [
      { label: "Symmetrical Dome", x: 50, y: 30, description: "An onion-shaped double dome rising 35 meters, crafted in perfectly symmetrical white marble." },
      { label: "Yamuna Reflecting Pool", x: 50, y: 85, description: "A long reflecting pool aligned with the central axis, mirroring the pristine white monument." },
      { label: "Pietra Dura Inlays", x: 40, y: 50, description: "Intricate floral wall decorations inlaid with semi-precious stones like lapis lazuli and jasper." }
    ],
    funFacts: [
      "Color Shifts: The Taj Mahal appears pinkish in the morning, milky white in the afternoon, and golden under moonlight.",
      "Strict Symmetry: The entire complex is perfectly symmetrical, with the sole exception of Shah Jahan's own cenotaph next to his wife's."
    ],
    searchLinks: [
      { title: "Archaeological Survey of India: Taj Mahal", uri: "https://www.tajmahal.gov.in" },
      { title: "UNESCO Monument Profile: Taj Mahal", uri: "https://whc.unesco.org/en/list/252" }
    ]
  },
  "Stonehenge": {
    landmarkName: "Stonehenge",
    city: "Wiltshire",
    country: "United Kingdom",
    coordinates: "51.1789° N, 1.8262° W",
    yearBuilt: "3000 BC - 2000 BC",
    shortHistory: "Stonehenge is a prehistoric monument in Wiltshire, England. It consists of an outer ring of vertical sarsen standing stones, each around 13 feet high, seven feet wide, and weighing around 25 tons, topped by connecting horizontal lintel stones.",
    narrationScript: "Greetings from the Salisbury Plains! Behold Stonehenge, one of the world's most mysterious Neolithic landmarks, erected between 3000 BC and 2000 BC. Aligning perfectly with the midsummer sunrise and midwinter sunset, this circle of giant sarsen and bluestones has puzzled historians for millennia. Map the floating anchors to study the sarsen lintels, sacrificial heel stone, and the solar alignment layout!",
    arAnchors: [
      { label: "Sarsen Ring", x: 50, y: 55, description: "Massive sandstone blocks weighing up to 25 tons, transported over 15 miles from the Marlborough Downs." },
      { label: "Heel Stone", x: 75, y: 45, description: "A single rough sarsen stone marking the avenue where the sun rises on the Summer Solstice." },
      { label: "Lintel Mortise Joints", x: 35, y: 30, description: "Prehistoric interlocking joints connecting horizontal stone lintels to vertical uprights." }
    ],
    funFacts: [
      "Bluestone Mystery: The smaller bluestones are believed to have been dragged over 140 miles from the Preseli Hills in Wales.",
      "Astronomy Clock: The avenue points precisely towards the Solstice sunrise, indicating highly advanced astronomical systems."
    ],
    searchLinks: [
      { title: "English Heritage: Stonehenge", uri: "https://www.english-heritage.org.uk/visit/places/stonehenge" },
      { title: "National Geographic: Stonehenge Discoveries", uri: "https://www.nationalgeographic.com/history/article/stonehenge" }
    ]
  }
};

const SEED_REVIEWS: Record<string, Array<{ author: string; rating: number; text: string; date: string }>> = {
  "Eiffel Tower": [
    { author: "Elena Rostova", rating: 5, text: "Absolutely stunning at sunset! The floating AR points pointed out the original Hydraulic elevators which I never knew about! A must-see.", date: "2026-05-18" },
    { author: "Marcus Thompson", rating: 4, text: "Incredible ironwork. The audio narrator was super engaging. Long lines in person, but scanning here was seamless!", date: "2026-05-24" }
  ],
  "The Colosseum": [
    { author: "Giacomo Ross", rating: 5, text: "The ancient hypogeum was brought to life through the AR overlays. Mindblowing historic details! Highly recommend exploring this trail.", date: "2026-04-12" },
    { author: "Karah S.", rating: 5, text: "A spectacular travertine wonder. Seeing the gladiators' lift locations mapped via AR was an unexpected thrill.", date: "2026-05-02" }
  ],
  "Senso-ji Temple": [
    { author: "Yuki Tanaka", rating: 5, text: "Such a peaceful and historic heart of Asakusa. The incense Jokoro description was very informative.", date: "2026-03-30" },
    { author: "Chris Powell", rating: 4, text: "Beautiful red paper lantern. The narrated tour guided me through Nakamise's history perfectly.", date: "2026-05-15" }
  ],
  "Statue of Liberty": [
    { author: "Sarah Jenkins", rating: 5, text: "Unbelievable sculpture! Loved learning about the oxidized copper thickness and Eiffel's steel skeleton. Iconic.", date: "2026-05-20" }
  ],
  "Taj Mahal": [
    { author: "Rajesh Kumar", rating: 5, text: "The absolute pinnacle of Mughal architecture. Symmetrical beauty is mesmerizing. Elegant AR mapping.", date: "2026-05-11" }
  ],
  "Stonehenge": [
    { author: "Arthur Pendelton", rating: 4, text: "Mysterious sarsen circle of Salisbury. Reading about solar alignments under solstices was wonderful.", date: "2026-05-05" }
  ]
};

const SAMPLES = [
  {
    name: "Eiffel Tower",
    city: "Paris",
    country: "France",
    url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop",
    desc: "Puddle iron lattice tower in Paris, constructed for the 1889 World's Fair."
  },
  {
    name: "The Colosseum",
    city: "Rome",
    country: "Italy",
    url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop",
    desc: "Ancient Roman gladiatorial amphitheater carved in travertine stone."
  },
  {
    name: "Senso-ji Temple",
    city: "Tokyo",
    country: "Japan",
    url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop",
    desc: "Tokyo's oldest ancient Buddhist temple founded in 645 AD."
  },
  {
    name: "Statue of Liberty",
    city: "New York",
    country: "USA",
    url: "https://images.unsplash.com/photo-1524008279394-3aed401d4090?w=800&auto=format&fit=crop",
    desc: "Iconic copper monument of freedom presented by France in 1886."
  },
  {
    name: "Taj Mahal",
    city: "Agra",
    country: "India",
    url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop",
    desc: "White-marble tomb constructed by Emperor Shah Jahan for Mumtaz Mahal."
  },
  {
    name: "Stonehenge",
    city: "Wiltshire",
    country: "United Kingdom",
    url: "https://images.unsplash.com/photo-1599833975787-5c143f373c30?w=800&auto=format&fit=crop",
    desc: "Prehistoric ring of standing stones dating to 3000 BC."
  }
];

function parseCoordinates(coordStr: string): { lat: number; lng: number } {
  let lat = 48.8584; // Default to Paris
  let lng = 2.2945;
  if (!coordStr) return { lat, lng };

  try {
    if (coordStr.toLowerCase().includes("gps") || coordStr.toLowerCase().includes("coordinate")) {
      return { lat, lng };
    }
    const parts = coordStr.split(',');
    if (parts.length >= 2) {
      const latPart = parts[0].trim().toUpperCase();
      const lngPart = parts[1].trim().toUpperCase();

      const latMatch = latPart.match(/(-?[\d.]+)/);
      if (latMatch) {
        lat = parseFloat(latMatch[1]);
        if (latPart.includes('S')) {
          lat = -lat;
        }
      }

      const lngMatch = lngPart.match(/(-?[\d.]+)/);
      if (lngMatch) {
        lng = parseFloat(lngMatch[1]);
        if (lngPart.includes('W')) {
          lng = -lng;
        }
      }
    }
  } catch (error) {
    console.error("Coordinate parse error:", error);
  }
  return { lat, lng };
}

function getWeatherConditionFromCode(code: number): string {
  if (code === 0) return "Clear Sky";
  if (code === 1 || code === 2 || code === 3) return "Partly Cloudy";
  if (code === 45 || code === 48) return "Foggy Mist";
  if (code === 51 || code === 53 || code === 55) return "Light Drizzle";
  if (code === 56 || code === 57) return "Freezing Drizzle";
  if (code === 61 || code === 63 || code === 65) return "Rainy Condition";
  if (code === 66 || code === 67) return "Freezing Rain";
  if (code === 71 || code === 73 || code === 75) return "Snowy Winter";
  if (code === 77) return "Flurries";
  if (code === 80 || code === 81 || code === 82) return "Rain Showers";
  if (code === 85 || code === 86) return "Snow Showers";
  if (code === 95) return "Thunderstorm";
  if (code === 96 || code === 99) return "Storm with Hail";
  return "Mellow Weather";
}

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [webcamActive, setWebcamActive] = useState<boolean>(false);
  const [loadingCamera, setLoadingCamera] = useState<boolean>(false);
  const [webcamError, setWebcamError] = useState<string>("");
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanningStep, setScanningStep] = useState<string>("");
  const [result, setResult] = useState<LandmarkResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Localization
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("holosight_language") || "English";
    }
    return "English";
  });

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("holosight_language", lang);
    }
  };

  // Gamification & Badges
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("holosight_badges");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse badges", e);
        }
      }
    }
    return [];
  });

  const [showBadgesModal, setShowBadgesModal] = useState<boolean>(false);

  // When a result is recognized, award a badge
  useEffect(() => {
    if (result && !result.isDemo) {
      setUnlockedBadges(prev => {
        if (!prev.includes(result.landmarkName)) {
          const updated = [...prev, result.landmarkName];
          if (typeof window !== "undefined") {
            localStorage.setItem("holosight_badges", JSON.stringify(updated));
          }
          return updated;
        }
        return prev;
      });
    }
  }, [result?.landmarkName]);

  // Walking tours states
  const [activeTour, setActiveTour] = useState<ThemedTour | null>(null);
  const [currentCheckpointIndex, setCurrentCheckpointIndex] = useState<number>(0);
  const [showTourSuccess, setShowTourSuccess] = useState<boolean>(false);

  // Reviews states
  const [reviews, setReviews] = useState<Record<string, Array<{ author: string; rating: number; text: string; date: string }>>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("holosight_landmark_reviews");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse reviews", e);
        }
      }
    }
    return SEED_REVIEWS;
  });

  const [authorName, setAuthorName] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("holosight_explorer_author") || "";
    }
    return "";
  });

  const [formRating, setFormRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>("");
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  // Active detail tab state
  const [activeInfoTab, setActiveInfoTab] = useState<"ar_guide" | "reviews" | "souvenir" | "nearby">("ar_guide");
  
  // Digital Souvenir Configuration states
  const [souvenirTheme, setSouvenirTheme] = useState<"imperial_gold" | "arcane_obsidian" | "cyberpunk_neon" | "nouveau_cream">("imperial_gold");
  const [souvenirCaptionChoice, setSouvenirCaptionChoice] = useState<"chronicle" | "narrative" | "custom">("chronicle");
  const [customSouvenirText, setCustomSouvenirText] = useState<string>("");
  const [selectedHighlights, setSelectedHighlights] = useState<Record<string, boolean>>({});
  const [exportingCard, setExportingCard] = useState<boolean>(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // Initialize souvenir highlights when landmark changes
  useEffect(() => {
    if (result) {
      const initialHighlights: Record<string, boolean> = {};
      result.arAnchors.forEach(anchor => {
        initialHighlights[anchor.label] = true;
      });
      setSelectedHighlights(initialHighlights);
      setCustomSouvenirText("");
    }
  }, [result?.landmarkName]);

  // Weather state
  const [weatherData, setWeatherData] = useState<{
    temp: number;
    windSpeed: number;
    weatherCode: number;
    conditionText: string;
    loading: boolean;
    error: string | null;
  } | null>(null);

  // Fetch real-time weather data for current landmark coordinates
  useEffect(() => {
    if (!result) {
      setWeatherData(null);
      return;
    }

    let isMounted = true;
    const fetchWeather = async () => {
      setWeatherData({
        temp: 0,
        windSpeed: 0,
        weatherCode: 0,
        conditionText: "",
        loading: true,
        error: null,
      });

      const { lat, lng } = parseCoordinates(result.coordinates);

      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&temperature_unit=celsius&windspeed_unit=kmh`
        );
        if (!response.ok) {
          throw new Error("Could not reach weather forecast servers.");
        }
        const data = await response.json();
        if (data.current_weather && isMounted) {
          const temp = data.current_weather.temperature;
          const windSpeed = data.current_weather.windspeed;
          const weatherCode = data.current_weather.weathercode;
          const conditionText = getWeatherConditionFromCode(weatherCode);

          setWeatherData({
            temp,
            windSpeed,
            weatherCode,
            conditionText,
            loading: false,
            error: null,
          });
        }
      } catch (err: any) {
        console.error("Failed to load weather for coordinates:", lat, lng, err);
        if (isMounted) {
          setWeatherData({
            temp: 0,
            windSpeed: 0,
            weatherCode: 0,
            conditionText: "Mellow Weather",
            loading: false,
            error: "Unable to retrieve real-time weather",
          });
        }
      }
    };

    fetchWeather();

    return () => {
      isMounted = false;
    };
  }, [result?.coordinates, result?.landmarkName]);
  
  // Interactive Anchor popover state
  const [selectedAnchor, setSelectedAnchor] = useState<ARAnchor | null>(null);
  const [hoveredAnchor, setHoveredAnchor] = useState<ARAnchor | null>(null);

  // Audio Tour Spoken Narration state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [narrationSupported, setNarrationSupported] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCheckpoint = (landmarkName: string, imageUrl: string) => {
    setScanning(true);
    setScanningStep("CALIBRATING OPTICAL TRACKING...");
    setSelectedAnchor(null);
    handleStopNarration();
    setActiveInfoTab("ar_guide"); // Reset tab to guide on checkpoints
    
    setTimeout(() => {
      setImage(imageUrl);
      const preset = LANDMARK_PRESETS[landmarkName];
      if (preset) {
        setResult(preset);
        // Delay visual narration slightly for premium transition feeling
        setTimeout(() => {
          handlePlayNarration(preset.narrationScript);
        }, 600);
      } else {
        setResult({
          landmarkName: landmarkName,
          city: "Simulated Destination",
          country: "Expedition Trail",
          coordinates: "GPS Locked",
          yearBuilt: "Established",
          shortHistory: "A majestic checkpoint part of your chosen themed walking tour. Explore the surroundings on-foot!",
          narrationScript: `Welcome to ${landmarkName}! A beautiful highlight of our historical walking trails.`,
          arAnchors: [
            { label: "Check-point Overview", x: 50, y: 50, description: "A high importance waypoint on your walking tour route." }
          ],
          funFacts: ["Waypoint registered successfully."]
        });
      }
      setScanning(false);
    }, 850);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) return;
    
    const newReview = {
      author: authorName.trim() || "Guest Traveler",
      rating: formRating,
      text: reviewText.trim(),
      date: new Date().toISOString().substring(0, 10)
    };

    const updatedReviews = { ...reviews };
    const landmarkName = result.landmarkName;
    if (!updatedReviews[landmarkName]) {
      updatedReviews[landmarkName] = [];
    }
    
    updatedReviews[landmarkName] = [newReview, ...updatedReviews[landmarkName]];
    
    setReviews(updatedReviews);
    localStorage.setItem("holosight_landmark_reviews", JSON.stringify(updatedReviews));
    if (typeof window !== "undefined") {
      localStorage.setItem("holosight_explorer_author", authorName.trim());
    }
    
    setReviewText("");
    setFormRating(5);
    setSubmissionFeedback("CHRONICLE REGISTERED SUCCESSFULLY!");
    setTimeout(() => setSubmissionFeedback(null), 3000);
  };

  const handleShareSouvenirText = () => {
    if (!result) return;
    
    let chronicleQuote = "";
    if (souvenirCaptionChoice === "chronicle") {
      const lReviews = reviews[result.landmarkName] || [];
      if (lReviews.length > 0) {
        chronicleQuote = lReviews[0].text;
      } else {
        chronicleQuote = "Exquisitely preserved monuments mapped in hyper-reality. Absolute architectural triumph.";
      }
    } else if (souvenirCaptionChoice === "narrative") {
      chronicleQuote = result.narrationScript;
    } else {
      chronicleQuote = customSouvenirText.trim() || "Captured via optical geolocation lens.";
    }

    let starRating = 5;
    const currentReviews = reviews[result.landmarkName] || [];
    if (currentReviews.length > 0) {
      starRating = currentReviews[0].rating;
    } else {
      starRating = formRating;
    }

    let starsStr = "";
    for (let i = 1; i <= 5; i++) {
      starsStr += i <= starRating ? "★" : "☆";
    }

    const activeLabels = Object.keys(selectedHighlights).filter(label => selectedHighlights[label]);

    const travelerCode = (authorName.trim() || "GUEST_EXPLORER").toUpperCase();

    const shareTemplate = `🏅 HOLOSIGHT DIGITAL SOUVENIR PIN
----------------------------------------
📌 LANDMARK:  ${result.landmarkName} (${result.city}, ${result.country})
📅 RECORD DATE: 2026-06-01 UTC
🌐 GPS GEOLOCK: ${result.coordinates}
👤 EXPLORER ID: ${travelerCode}
⭐ TRAILER SCORE: ${starsStr} (${starRating}/5)

🖋️ CHRONICLE INSPIRATION:
"${chronicleQuote}"

✨ AR HIGHLIGHTS DISCOVERED:
${activeLabels.map(lbl => `• [x] ${lbl}`).join("\n")}

🏛️ Holosight AI-AR Explorer Waypoint Certified.`;

    navigator.clipboard.writeText(shareTemplate).then(() => {
      setShareFeedback("TRAVELOGUE COPIED TO CLIPBOARD!");
      setTimeout(() => setShareFeedback(null), 3000);
    }).catch(err => {
      console.error("Failed to copy text", err);
    });
  };

  const handleShareLandmarkDetail = async () => {
    if (!result) return;

    const shareTitle = `Explore ${result.landmarkName} with Holosight`;
    const shareText = `${result.landmarkName} in ${result.city}, ${result.country}, founded around ${result.yearBuilt}. Here is a historical snapshot: ${result.shortHistory || result.narrationScript}`;
    const shareUrl = window.location.origin + window.location.pathname;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        setShareFeedback("LANDMARK SHARED SUCCESSFULLY!");
        setTimeout(() => setShareFeedback(null), 3000);
      } catch (err: any) {
        console.error("Web Share failed:", err);
        if (err.name !== "AbortError") {
          fallbackCopyToClipboard(shareTitle, shareText, shareUrl);
        }
      }
    } else {
      fallbackCopyToClipboard(shareTitle, shareText, shareUrl);
    }
  };

  const fallbackCopyToClipboard = (title: string, text: string, url: string) => {
    const formattedMessage = `🏛️ ${title}\n\n📍 Location: ${result?.city}, ${result?.country}\n📅 Era: ${result?.yearBuilt}\n\n📖 About:\n${text}\n\n🔗 Explore here: ${url}`;
    navigator.clipboard.writeText(formattedMessage).then(() => {
      setShareFeedback("COPIED SHARE DETAILS TO CLIPBOARD!");
      setTimeout(() => setShareFeedback(null), 3000);
    }).catch(err => {
      console.error("Failed to copy share elements:", err);
    });
  };

  const handleTweetLandmark = () => {
    if (!result) return;
    const tweetText = encodeURIComponent(`Just explored ${result.landmarkName} in ${result.city}, ${result.country} using Holosight! 🏛️✨\n\n`);
    const tweetUrl = encodeURIComponent(window.location.origin + window.location.pathname);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`, '_blank');
  };

  const handleDownloadSouvenirCard = async () => {
    if (!result) return;
    setExportingCard(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 800;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not acquire 2D context");

      let colors = {
        bg: "#0c0d12",
        border: "#d4af37",
        accent: "#fbbf24",
        textPrimary: "#ffffff",
        textSecondary: "#94a3b8",
        highlightBg: "rgba(212,175,55,0.1)",
        tagBorder: "rgba(212,175,55,0.3)"
      };

      if (souvenirTheme === "arcane_obsidian") {
        colors = {
          bg: "#000000",
          border: "#374151",
          accent: "#e5e7eb",
          textPrimary: "#f3f4f6",
          textSecondary: "#9ca3af",
          highlightBg: "rgba(255,255,255,0.05)",
          tagBorder: "rgba(255,255,255,0.15)"
        };
      } else if (souvenirTheme === "cyberpunk_neon") {
        colors = {
          bg: "#0b0c20",
          border: "#ec4899",
          accent: "#06b6d4",
          textPrimary: "#f8fafc",
          textSecondary: "#67e8f9",
          highlightBg: "rgba(6,182,212,0.1)",
          tagBorder: "rgba(236,72,153,0.4)"
        };
      } else if (souvenirTheme === "nouveau_cream") {
        colors = {
          bg: "#fcfbf7",
          border: "#854d0e",
          accent: "#78350f",
          textPrimary: "#1c1917",
          textSecondary: "#57534e",
          highlightBg: "rgba(120,53,15,0.05)",
          tagBorder: "rgba(120,53,15,0.25)"
        };
      }

      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, 600, 800);

      ctx.strokeStyle = colors.border;
      ctx.lineWidth = 4;
      ctx.strokeRect(15, 15, 570, 770);

      ctx.strokeStyle = colors.tagBorder;
      ctx.lineWidth = 1;
      ctx.strokeRect(22, 22, 556, 756);

      const drawCornerGuide = (cx: number, cy: number, length: number) => {
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - length, cy);
        ctx.lineTo(cx + length, cy);
        ctx.moveTo(cx, cy - length);
        ctx.lineTo(cx, cy + length);
        ctx.stroke();
      };
      drawCornerGuide(30, 30, 10);
      drawCornerGuide(570, 30, 10);
      drawCornerGuide(30, 770, 10);
      drawCornerGuide(570, 770, 10);

      ctx.textAlign = "center";
      ctx.fillStyle = colors.accent;
      ctx.font = "bold 11px monospace";
      ctx.fillText("✦ HOLOSIGHT EXPLORER EXPEDITION SOUVENIR ✦", 300, 48);

      ctx.fillStyle = colors.textSecondary;
      ctx.font = "8px monospace";
      const uId = `RECORD_ID: HS-${result.yearBuilt.replace(/\s+/g, "")}-${result.city.substring(0,3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      ctx.fillText(uId, 300, 65);

      ctx.strokeStyle = colors.border;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(40, 80);
      ctx.lineTo(560, 80);
      ctx.stroke();

      const wrapText = (cCtx: CanvasRenderingContext2D, txt: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        const words = txt.split(' ');
        let line = '';
        let currentY = y;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = cCtx.measureText(testLine);
          const testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            cCtx.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        cCtx.fillText(line, x, currentY);
      };

      const renderImageAndPostText = () => {
        ctx.textAlign = "left";

        ctx.fillStyle = colors.textPrimary;
        ctx.font = "bold 23px Georgia, serif";
        ctx.fillText(result.landmarkName, 45, 415);

        ctx.fillStyle = colors.accent;
        ctx.font = "11px monospace";
        ctx.fillText(`📍 ${result.coordinates}`, 45, 436);

        ctx.textAlign = "right";
        ctx.fillStyle = colors.textSecondary;
        ctx.font = "11px monospace";
        ctx.fillText(`Established: ${result.yearBuilt}`, 555, 436);

        ctx.strokeStyle = colors.tagBorder;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(40, 450);
        ctx.lineTo(560, 450);
        ctx.stroke();

        ctx.textAlign = "left";
        ctx.fillStyle = colors.textPrimary;
        ctx.font = "bold 10px monospace";
        ctx.fillText("REGISTERED CHRONOLOGIST", 45, 475);

        ctx.fillStyle = colors.accent;
        ctx.font = "bold 13px sans-serif";
        const expName = (authorName.trim() || localStorage.getItem("holosight_explorer_author") || "Guest Explorer").toUpperCase();
        ctx.fillText(expName, 45, 495);

        ctx.font = "14px sans-serif";
        let starRating = 5;
        const currentReviews = reviews[result.landmarkName] || [];
        if (currentReviews.length > 0) {
          starRating = currentReviews[0].rating;
        } else {
          starRating = formRating;
        }

        let starsStr = "";
        for (let i = 1; i <= 5; i++) {
          starsStr += i <= starRating ? "★ " : "☆ ";
        }
        ctx.fillStyle = colors.accent;
        ctx.fillText(starsStr, 45, 515);

        ctx.textAlign = "right";
        ctx.fillStyle = colors.textSecondary;
        ctx.font = "10px monospace";
        ctx.fillText("WAYPOINT DATE", 555, 475);
        ctx.fillStyle = colors.textPrimary;
        ctx.font = "bold 11px monospace";
        ctx.fillText("2026-06-01 UTC", 555, 495);

        ctx.textAlign = "left";
        ctx.fillStyle = colors.textPrimary;
        ctx.font = "bold 10px monospace";
        ctx.fillText("EXPLORER CHRONICLE LOG", 45, 545);

        let chronicleQuote = "";
        if (souvenirCaptionChoice === "chronicle") {
          const lReviews = reviews[result.landmarkName] || [];
          if (lReviews.length > 0) {
            chronicleQuote = lReviews[0].text;
          } else {
            chronicleQuote = "Exquisitely preserved monuments mapped in hyper-reality. Absolute architectural triumph.";
          }
        } else if (souvenirCaptionChoice === "narrative") {
          chronicleQuote = result.narrationScript;
        } else {
          chronicleQuote = customSouvenirText.trim() || "Captured via optical geolocation lens.";
        }

        ctx.fillStyle = colors.highlightBg;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(40, 560, 520, 75, 8);
        } else {
          ctx.rect(40, 560, 520, 75);
        }
        ctx.fill();

        ctx.strokeStyle = colors.tagBorder;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = colors.textPrimary;
        ctx.font = "italic 11px Georgia, serif";
        
        const maxWordsWidth = 490;
        const startTextX = 55;
        const startTextY = 582;
        const wrappedLineHeight = 16;
        const truncatedQuote = chronicleQuote.length > 175 ? chronicleQuote.substring(0, 172) + "..." : chronicleQuote;
        wrapText(ctx, `"${truncatedQuote}"`, startTextX, startTextY, maxWordsWidth, wrappedLineHeight);

        ctx.fillStyle = colors.textSecondary;
        ctx.font = "bold 9px monospace";
        ctx.fillText("AR OPTIC SPECIFICATIONS", 45, 660);

        const activeLabels = Object.keys(selectedHighlights).filter(label => selectedHighlights[label]);
        let badgeX = 45;
        ctx.font = "9px monospace";
        
        activeLabels.slice(0, 3).forEach((label) => {
          const badgeText = `● ${label.toUpperCase()}`;
          const badgeWidth = ctx.measureText(badgeText).width + 12;
          
          ctx.fillStyle = colors.highlightBg;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(badgeX, 672, badgeWidth, 18, 4);
          } else {
            ctx.rect(badgeX, 672, badgeWidth, 18);
          }
          ctx.fill();
          
          ctx.strokeStyle = colors.border;
          ctx.stroke();
          
          ctx.fillStyle = colors.accent;
          ctx.fillText(badgeText, badgeX + 6, 684);
          
          badgeX += badgeWidth + 8;
        });

        if (activeLabels.length === 0) {
          ctx.fillStyle = colors.textSecondary;
          ctx.font = "italic 10px sans-serif";
          ctx.fillText("No anchors selected", 45, 684);
        }

        // Stamp
        ctx.strokeStyle = colors.border;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(500, 715, 35, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = colors.tagBorder;
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.arc(500, 715, 31, 0, Math.PI * 2);
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.fillStyle = colors.accent;
        ctx.font = "bold 7px monospace";
        ctx.fillText("HOLOSIGHT", 500, 712);
        ctx.fillText("CERTIFIED", 500, 721);
        ctx.font = "6px monospace";
        ctx.fillStyle = colors.textSecondary;
        ctx.fillText("AR EXCURSION", 500, 730);

        try {
          const dataUrl = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.download = `HOLOSIGHT_SOUVENIR_${result.landmarkName.replace(/\s+/g, "_")}.png`;
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (err) {
          console.error("Tainted canvas export block - security restriction.", err);
        }
        setExportingCard(false);
      };

      const drawFallbackVectors = () => {
        ctx.strokeStyle = colors.border;
        ctx.lineWidth = 3;
        ctx.strokeRect(38, 98, 524, 284);

        ctx.fillStyle = "#07080c";
        ctx.fillRect(40, 100, 520, 280);

        ctx.strokeStyle = colors.tagBorder;
        ctx.lineWidth = 0.5;
        for (let j = 0; j <= 520; j += 40) {
          ctx.beginPath();
          ctx.moveTo(40 + j, 100);
          ctx.lineTo(560 - j, 380);
          ctx.stroke();
        }
        for (let k = 0; k <= 280; k += 40) {
          ctx.beginPath();
          ctx.moveTo(40, 100 + k);
          ctx.lineTo(560, 380 - k);
          ctx.stroke();
        }

        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(300, 240, 60, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(300, 240, 10, 0, Math.PI * 2);
        ctx.fillStyle = colors.border;
        ctx.fill();

        ctx.textAlign = "center";
        ctx.fillStyle = colors.accent;
        ctx.font = "bold 10px monospace";
        ctx.fillText("GEOLOCATION SATELLITE PATHWAY COORDINATES LOCKED", 300, 220);
        ctx.fillText(`TRAILER REFERENCE: ${result.landmarkName.toUpperCase()}`, 300, 260);

        renderImageAndPostText();
      };

      if (image) {
        const imgObj = new Image();
        imgObj.crossOrigin = "anonymous";
        
        imgObj.onload = () => {
          try {
            ctx.strokeStyle = colors.border;
            ctx.lineWidth = 3;
            ctx.strokeRect(38, 98, 524, 284);

            ctx.drawImage(imgObj, 40, 100, 520, 280);
            renderImageAndPostText();
          } catch (err) {
            console.warn("Failing image write layer, fallback to safe mesh vectors", err);
            drawFallbackVectors();
          }
        };

        imgObj.onerror = () => {
          console.warn("Could not load crossOrigin image securely, falling back to blueprint mesh vector art.");
          drawFallbackVectors();
        };

        imgObj.src = image;
      } else {
        drawFallbackVectors();
      }

    } catch (e) {
      console.error("Export failure occurred", e);
      setExportingCard(false);
    }
  };

  // Initialize SpeechSynthesis confirmation
  useEffect(() => {
    if (typeof window !== "undefined") {
      setNarrationSupported("speechSynthesis" in window);
    }
  }, []);

  // Cleanup webcam stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [stream]);

  // Activate device camera facing outside (environment) if possible
  const startWebcam = async () => {
    setLoadingCamera(true);
    setWebcamError("");
    setResult(null);
    setError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1080 }, height: { ideal: 1080 } }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setWebcamActive(true);
      setImage(null);
    } catch (err: any) {
      console.error("Camera access failed", err);
      setWebcamError("Camera access denied or unavailable. Please upload a photo or try our sample views below!");
      setWebcamActive(false);
    } finally {
      setLoadingCamera(false);
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setWebcamActive(false);
  };

  // Take a real snapshot from the active video stream
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      
      if (context) {
        // Set canvas to square bounding box of active capture
        const size = Math.min(video.videoWidth, video.videoHeight);
        canvas.width = size;
        canvas.height = size;
        
        // Draw centered square
        const sx = (video.videoWidth - size) / 2;
        const sy = (video.videoHeight - size) / 2;
        
        context.drawImage(video, sx, sy, size, size, 0, 0, size, size);
        
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setImage(dataUrl);
        stopWebcam();
      }
    }
  };

  // Convert uploaded files to base64 encoding
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      setResult(null);
      setError(null);
      stopWebcam();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImage(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Select a preset high-resolution sample image to scan
  const handleSelectSample = async (sampleUrl: string) => {
    setResult(null);
    setError(null);
    stopWebcam();
    setScanning(true);
    setScanningStep("Converting sample coordinates...");
    
    try {
      // Helper to fetch Unsplash image and convert to Base64 to bypass proxy limitations or send clean payload to GenAI
      const res = await fetch(sampleUrl);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setScanning(false);
      };
      reader.readAsDataURL(blob);
    } catch {
      // Direct assignment fallback
      setImage(sampleUrl);
      setScanning(false);
    }
  };

  // Spoken narrative utilizing client browser SpeechSynthesis with controls
  const handlePlayNarration = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    // High quality configurations
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.02;
    
    // Choose professional, clear English voice if loaded
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(
      v => v.lang.includes("en") && 
      (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("Daniel") || v.name.includes("Hazel"))
    );
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };
    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleStopNarration = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  // Call Express API endpoint to trigger Gemini landmark analysis and googleSearch history grounding
  const triggerARScan = async () => {
    if (!image) return;
    setScanning(true);
    setError(null);
    setSelectedAnchor(null);
    handleStopNarration();

    // Staged step-by-step visual scan HUD feedback for an immersive AR terminal feeling
    const stages = [
      "Calibrating optical frame analyzer...",
      "Uploading coordinates to AI cluster...",
      "Executing web search grounding for deep archives...",
      "Parsing architectural history...",
      "Structuring floating AR Anchors..."
    ];

    let stageIdx = 0;
    setScanningStep(stages[0]);
    const stageInterval = setInterval(() => {
      if (stageIdx < stages.length - 1) {
        stageIdx++;
        setScanningStep(stages[stageIdx]);
      }
    }, 1200);

    try {
      const response = await fetch("/api/recognize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ image, language: selectedLanguage })
      });

      if (!response.ok) {
        throw new Error(`Cloud server returned ${response.status}: Failed to analyze.`);
      }

      const parsed: LandmarkResult = await response.json();
      setResult(parsed);
      
      // Auto-trigger the narrated spoken clip immediately for an ultra AR vibe!
      if (parsed.narrationScript) {
        setTimeout(() => {
          handlePlayNarration(parsed.narrationScript);
        }, 1500);
      }
    } catch (err: any) {
      console.error(err);
      setError("AI was unable to process this frame. Please try another landmark photo or select one of our premium sample cities!");
    } finally {
      clearInterval(stageInterval);
      setScanning(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    setSelectedAnchor(null);
    handleStopNarration();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f8fafc] flex flex-col font-sans selection:bg-gold selection:text-slate-950 pb-16">
      
      {/* Immersive Top AR Banner */}
      <header className="border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 z-50 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gold/10 border border-gold/30 text-gold">
              <Compass className="w-5 h-5 animate-pulse-slow" />
              <div className="absolute inset-0 border border-gold/25 rounded-lg scale-110 animate-ping-slow pointer-events-none" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-2">
                HoloSight <span className="text-gold text-xs px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20">AR Tourism</span>
              </h1>
              <p className="text-xs text-slate-400 tracking-wide font-mono">OPTICAL SENSOR MATRIX // GROUNDED HISTORIAN</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="relative group">
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="appearance-none cursor-pointer bg-[#121212] border border-white/10 hover:border-gold/30 text-slate-300 hover:text-white rounded-lg px-3 py-1.5 pr-8 text-xs font-mono font-medium outline-none transition-all"
              >
                <option value="English">ENG</option>
                <option value="Sinhala">SIN</option>
                <option value="French">FRA</option>
                <option value="Spanish">ESP</option>
                <option value="Japanese">JPN</option>
              </select>
              <Globe className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>

            {/* Badges Button */}
            <button
              onClick={() => setShowBadgesModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121212] hover:bg-gold/10 text-gold rounded-lg border border-gold/20 hover:border-gold transition-all text-xs font-mono font-bold tracking-wide"
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">BADGES</span>
              <span className="bg-gold text-black rounded-full px-1.5 py-0.5 text-[9px] ml-1">{unlockedBadges.length}</span>
            </button>

            {/* Real UTC Active HUD tracker */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#121212] rounded border border-white/10 text-[10px] font-mono text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span>SAT_SYS_UP: 2026-06-01</span>
            </div>
            {image && (
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121212] hover:bg-[#1a1a1a] text-slate-300 hover:text-white transition-all text-xs font-mono font-medium border border-white/15"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                DOCK NEW PICTURE
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:px-8">
        <AnimatePresence mode="wait">
          {!image && !webcamActive && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left Column: Capture Hub and Preset Landmarks */}
              <div className="lg:col-span-8 space-y-8">
                <div className="p-8 rounded-2xl glass-slate border border-white/10 relative overflow-hidden bg-[#0a0a0a]">
                  <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-gold/30 select-none">
                    MATRIX_REG: F_TOUR
                  </div>
                  <h2 className="text-3xl font-bold font-serif tracking-tight text-white mb-3 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-gold" /> Discover the World's Stories
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                    Aim your browser camera at any monument, upload a holiday photo, or explore our premium global samples to activate interactive spatial annotations and live narrator-guided streams.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    {/* Device Camera Button */}
                    <button
                      onClick={startWebcam}
                      className="flex flex-col items-center justify-center p-6 rounded-xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent hover:from-gold/10 hover:border-gold/40 transition-all text-center group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Camera className="w-6 h-6" />
                      </div>
                      <span className="font-semibold text-white text-sm">Use Device Camera</span>
                      <span className="text-xs text-slate-400 mt-1">Real-time landmark capture</span>
                    </button>

                    {/* Drag and Drop/File Upload zone */}
                    <label className="flex flex-col items-center justify-center p-6 rounded-xl border border-white/10 bg-black/40 hover:bg-black/60 hover:border-gold/30 transition-all text-center cursor-pointer group">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileUpload} 
                      />
                      <div className="w-12 h-12 rounded-full bg-[#121212] border border-white/10 text-slate-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6 text-gold" />
                      </div>
                      <span className="font-semibold text-white text-sm">Upload Photo</span>
                      <span className="text-xs text-slate-400 mt-1">Drag file or browse storage</span>
                    </label>
                  </div>

                  {webcamError && (
                    <div className="mt-4 p-3 bg-red-950/30 border border-red-500/30 text-red-300 rounded-lg text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{webcamError}</span>
                    </div>
                  )}
                </div>

                {/* City Preset Selection Grid */}
                <div>
                  <h3 className="text-base font-semibold font-serif tracking-tight text-gold mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gold" /> Preset Landmark Gallery
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {SAMPLES.map((sample, ix) => (
                      <button
                        key={ix}
                        onClick={() => handleSelectSample(sample.url)}
                        className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] hover:border-gold/55 group transition-all text-left h-36 cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                        <img 
                          src={sample.url} 
                          alt={sample.name} 
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                          <span className="text-[10px] uppercase tracking-wider font-mono text-gold block mb-0.5">{sample.city}, {sample.country}</span>
                          <span className="font-bold text-white text-sm block group-hover:text-gold transition-colors">{sample.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Curated Historical Walking Tours & Guides */}
              <div className="lg:col-span-4 space-y-6">
                {/* Walking Trails widget */}
                <div className="p-6 rounded-2xl border border-white/10 bg-[#0a0a0a] space-y-4">
                  <div className="flex items-center gap-2 text-gold">
                    <Navigation className="w-5 h-5 text-gold" />
                    <h3 className="text-base font-semibold font-serif text-white">Curated Walking Trails</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Select a curated path below to sequentially visit and discover famous regional points of interest.
                  </p>
                  
                  <div className="space-y-3 pt-1">
                    {THEMED_TOURS.map((tour) => (
                      <div 
                        key={tour.id} 
                        className="p-4 rounded-xl border border-white/5 bg-black/60 hover:bg-[#111111] hover:border-gold/30 transition-all space-y-2 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[9px] font-mono font-bold tracking-widest text-gold uppercase px-1.5 py-0.5 rounded bg-gold/10 border border-gold/15">
                            {tour.badge}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            ⏱️ {tour.estimatedTime}
                          </span>
                        </div>
                        <h4 className="text-xs font-serif font-bold text-white group-hover:text-gold transition-colors">{tour.title}</h4>
                        <p className="text-[11px] text-slate-400 leading-normal line-clamp-2">
                          {tour.description}
                        </p>
                        <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between pt-1 border-t border-white/5">
                          <span>📍 {tour.checkpoints.length} Checkpoints</span>
                          <button
                            onClick={() => {
                              setActiveTour(tour);
                              setCurrentCheckpointIndex(0);
                              const cp = tour.checkpoints[0];
                              startCheckpoint(cp.landmarkName, cp.url);
                            }}
                            className="text-[10px] font-mono text-gold group-hover:underline flex items-center gap-1 uppercase cursor-pointer font-bold"
                          >
                            Explore Trail →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rules sidebar widget */}
                <div className="p-6 rounded-2xl border border-white/10 bg-[#0a0a0a] space-y-4">
                  <h3 className="text-sm font-semibold font-serif text-white flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gold" /> Recognition Guidance
                  </h3>
                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="flex gap-2.5">
                      <span className="text-gold font-mono text-[10px] font-bold">01/</span>
                      <p><strong className="text-white">Focal Check:</strong> Frame landmarks tightly in optical captures.</p>
                    </div>
                    <div className="flex gap-2.5">
                      <span className="text-gold font-mono text-[10px] font-bold">02/</span>
                      <p><strong className="text-white">Interactive Pins:</strong> Click spatial tags to hear spoken simulation transcripts.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Active Webcam Viewport */}
          {webcamActive && (
            <motion.div 
              key="camera-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto flex flex-col items-center"
            >
              <div className="w-full aspect-square rounded-2xl border-2 border-gold/40 relative overflow-hidden bg-black shadow-2xl shadow-gold/5">
                {/* Overlay Grid lines for AR scanner look */}
                <div className="absolute inset-0 border border-white/5 grid grid-cols-3 grid-rows-3 pointer-events-none z-10" />
                {/* Target reticle corners (Sophisticated Dark Gold Accents) */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-gold pointer-events-none z-10" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-gold pointer-events-none z-10" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-gold pointer-events-none z-10" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-gold pointer-events-none z-10" />

                <video 
                  ref={videoRef}
                  playsInline
                  autoPlay
                  className="w-full h-full object-cover"
                />

                {/* Scrolling scan line */}
                <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent animate-scan z-10 shadow-[0_0_15px_rgba(212,175,55,0.8)]" />

                {/* Sensor telemetry */}
                <div className="absolute bottom-4 left-4 font-mono text-[9px] text-gold bg-black/90 py-1.5 px-3 rounded border border-white/10 z-10 tracking-widest uppercase">
                  REC_SYS // CALIBRATING OPTICAL SENSOR
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={capturePhoto}
                  className="px-6 py-3 rounded-xl bg-gold hover:bg-amber-400 text-slate-950 font-bold border border-gold/30 flex items-center gap-2 shadow-lg shadow-gold/20 active:scale-95 transition-all text-sm cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-slate-950" />
                  CAPTURE MONUMENT
                </button>
                <button
                  onClick={stopWebcam}
                  className="px-5 py-3 rounded-xl bg-[#121212] hover:bg-[#1a1a1a] text-slate-300 font-semibold border border-white/10 text-sm cursor-pointer"
                >
                  CANCEL
                </button>
              </div>
            </motion.div>
          )}

          {/* Active Landmark Photo - Scanning or Loaded Panel */}
          {image && !webcamActive && (
            <motion.div
              key="analyze-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {showTourSuccess && activeTour ? (
                /* Celebration Modal / Certified badge */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl border-2 border-gold/40 bg-gradient-to-b from-black to-[#050505] text-center max-w-lg mx-auto shadow-2xl relative overflow-hidden space-y-6 my-12"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/10 via-gold to-gold/10" />
                  
                  <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/30 text-gold flex items-center justify-center mx-auto relative mt-4">
                    <Award className="w-10 h-10 text-gold" />
                    <div className="absolute inset-0 border border-gold/20 rounded-full scale-110 animate-ping pointer-events-none" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono tracking-widest text-gold uppercase block">GOLD RANK EXPEDITION SEAL</span>
                    <h3 className="text-2xl font-serif font-bold text-white">Tour Expedition Finished!</h3>
                    <p className="text-xs text-slate-300 leading-normal max-w-sm mx-auto font-sans">
                      Congratulations! You completed the entire walking trail for <strong className="text-white">{activeTour.title}</strong>, validating all sequential checkpoints and custom audio descriptions.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#111] border border-white/5 space-y-2 text-left">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>TRAILER ID:</span>
                      <span className="text-slate-300 uppercase">EXPLORER_#{activeTour.id}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>DESTINATIONS IDENTIFIED:</span>
                      <span className="text-emerald-400 font-bold">🏅 {activeTour.checkpoints.length} / {activeTour.checkpoints.length} LOCKED</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>EXPEDITION COMPLETED ON:</span>
                      <span className="text-slate-300 font-sans">2026-06-01 UTC</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setActiveTour(null);
                        setShowTourSuccess(false);
                        handleReset();
                      }}
                      className="flex-1 py-3 rounded-xl bg-gold hover:bg-amber-400 text-slate-950 font-bold border border-gold/30 text-xs font-mono uppercase cursor-pointer"
                    >
                      CLAIM BADGE & RETURN HOME
                    </button>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Persistent Active Tour Excursion Progress Banner */}
                  {activeTour && (
                    <div className="p-6 rounded-2xl border border-gold/25 bg-gold/5 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden backdrop-blur-md animate-pulse-slow">
                      <div className="absolute top-0 right-0 p-3 font-mono text-[8px] text-gold/30">
                        TRAIL_INDEX: {currentCheckpointIndex + 1} OF {activeTour.checkpoints.length}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-gold/10 border border-gold/20 text-gold shrink-0">
                          <Navigation className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono tracking-widest text-[#f8fafc]/60 uppercase bg-white/10 px-1.5 py-0.5 rounded border border-white/5">
                              ACTIVE TOUR EXCURSION
                            </span>
                            <span className="text-[9.5px] font-mono text-gold font-bold">
                              ⏱️ {activeTour.estimatedTime} ESTIMATED
                            </span>
                          </div>
                          <h4 className="text-base font-serif font-bold text-white mt-1">
                            {activeTour.title}
                          </h4>
                          <p className="text-xs text-slate-300 font-sans">
                            Current Station: <strong className="text-gold font-sans">{activeTour.checkpoints[currentCheckpointIndex].landmarkName}</strong>
                          </p>
                        </div>
                      </div>
                      
                      {/* Navigation Button Controls */}
                      <div className="flex items-center gap-2 mt-2 md:mt-0">
                        <button
                          onClick={() => {
                            if (currentCheckpointIndex > 0) {
                              const nextIdx = currentCheckpointIndex - 1;
                              setCurrentCheckpointIndex(nextIdx);
                              startCheckpoint(activeTour.checkpoints[nextIdx].landmarkName, activeTour.checkpoints[nextIdx].url);
                            }
                          }}
                          disabled={currentCheckpointIndex === 0}
                          className="p-2.5 rounded-lg bg-[#121212] hover:bg-[#1a1a1a] text-white border border-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer flex items-center justify-center"
                          title="Previous Checkpoint"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>

                        {/* Sequential Station Indicators */}
                        <div className="hidden sm:flex items-center gap-1.5 px-3">
                          {activeTour.checkpoints.map((cp, idx) => (
                            <div
                              key={idx}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                idx === currentCheckpointIndex 
                                  ? "bg-gold scale-125 ring-2 ring-gold/40 shadow-[0_0_8px_rgba(212,175,55,0.7)]" 
                                  : idx < currentCheckpointIndex 
                                    ? "bg-emerald-500" 
                                    : "bg-white/20"
                              }`}
                              title={cp.landmarkName}
                            />
                          ))}
                        </div>

                        {currentCheckpointIndex < activeTour.checkpoints.length - 1 ? (
                          <button
                            onClick={() => {
                              const nextIdx = currentCheckpointIndex + 1;
                              setCurrentCheckpointIndex(nextIdx);
                              startCheckpoint(activeTour.checkpoints[nextIdx].landmarkName, activeTour.checkpoints[nextIdx].url);
                            }}
                            className="px-4 py-2 rounded-lg bg-gold hover:bg-amber-400 text-slate-950 font-bold border border-gold/30 text-xs font-mono flex items-center gap-1.5 hover:shadow-[0_0_12px_rgba(212,175,55,0.2)] transition-all cursor-pointer"
                          >
                            NEXT SITE <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setShowTourSuccess(true)}
                            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold border border-emerald-500/30 text-xs font-mono flex items-center gap-1.5 hover:shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
                          >
                            COMPLETE TRAIL <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Photo Viewer Container Panel */}
                    <div className="lg:col-span-6 space-y-4">
                      <div className="relative aspect-square w-full rounded-2xl border border-white/10 bg-black overflow-hidden shadow-2xl">
                        
                        {/* Floating AR Dots System Overlay - Rendered AFTER Successful response */}
                        {result && !scanning && (
                          <div className="absolute inset-0 z-20 pointer-events-none">
                            {result.arAnchors.map((anchor, idx) => {
                              const isActive = selectedAnchor?.label === anchor.label;
                              const isHovered = hoveredAnchor?.label === anchor.label;
                              return (
                                <div
                                  key={idx}
                                  style={{ left: `${anchor.x}%`, top: `${anchor.y}%` }}
                                  className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                                  onMouseEnter={() => setHoveredAnchor(anchor)}
                                  onMouseLeave={() => setHoveredAnchor(null)}
                                >
                                  {/* Pulsing radar point rings */}
                                  <button
                                    onClick={() => setSelectedAnchor(isActive ? null : anchor)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center relative transition-all cursor-pointer ${
                                      isActive 
                                        ? "bg-gold text-slate-950 scale-125 ring-4 ring-gold/30" 
                                        : "bg-[#0a0a0a]/90 hover:bg-gold hover:text-slate-950 text-gold ring-2 ring-gold/40"
                                    }`}
                                  >
                                    <span className="absolute inset-0 rounded-full border border-gold/40 animate-ping-slow pointer-events-none" />
                                    <Compass className={`w-4 h-4 ${isActive ? "rotate-45" : ""}`} />
                                  </button>

                                  {/* AR Anchor popover (Hover or Click) */}
                                  <AnimatePresence>
                                    {(isActive || isHovered) && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="absolute left-10 top-0 w-64 p-3 rounded-xl border border-gold/30 bg-black/95 text-left backdrop-blur-md shadow-2xl z-50 pointer-events-all"
                                      >
                                        <div className="flex items-center justify-between gap-2 mb-1.5 border-b border-white/10 pb-1">
                                          <span className="font-bold text-xs text-white uppercase tracking-tight">{anchor.label}</span>
                                          <span className="text-[9px] font-mono text-gold font-semibold px-1 rounded bg-gold/15">AR_TARGET</span>
                                        </div>
                                        <p className="text-slate-300 text-[11px] leading-relaxed font-sans">{anchor.description}</p>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Image Viewer Element */}
                        <img 
                          src={image} 
                          alt="Captured tourist snap" 
                          className="w-full h-full object-cover"
                        />

                        {/* Holographic Hologram line covering target when scanning */}
                        {scanning && (
                          <div className="absolute inset-0 bg-black/50 z-10">
                            {/* Scanning lasers */}
                            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent animate-scan shadow-[0_0_20px_rgba(212,175,55,0.9)]" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/85 backdrop-blur-sm z-30">
                              <Loader2 className="w-10 h-10 text-gold animate-spin mb-4" />
                              <h4 className="font-serif font-medium text-lg text-white mb-1">AI AR Scanning...</h4>
                              <p className="text-xs font-mono text-gold/85 min-h-[1.5rem] tracking-wider uppercase">
                                {scanningStep}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Static guide details overlay inside image */}
                        {result && !scanning && (
                          <div className="absolute bottom-4 left-4 right-4 p-3 py-2.5 rounded-xl border border-white/10 bg-black/90 backdrop-blur-md z-10 flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-0.5">GEOLOCATION LOCKED</span>
                              <span className="font-semibold text-white truncate block text-[13px] font-serif">{result.coordinates}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-0.5">ESTABLISHED</span>
                              <span className="font-bold text-gold block text-[13px]">{result.yearBuilt}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Reset action and info text */}
                      <div className="flex gap-4 items-center justify-between">
                        <button
                          onClick={handleReset}
                          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors font-mono uppercase cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5 text-gold" /> Discard optical file
                        </button>

                        {!result && !scanning && (
                          <button
                            onClick={triggerARScan}
                            className="px-6 py-3 rounded-xl bg-gold hover:bg-amber-400 text-slate-950 font-bold border border-gold/30 flex items-center gap-2 shadow-lg shadow-gold/20 active:scale-95 transition-all text-sm animate-pulse-slow cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4 text-slate-950" />
                            SCAN WITH AR VISION
                          </button>
                        )}
                      </div>

                      {error && (
                        <div className="p-4 bg-red-950/30 border border-red-500/30 text-red-300 rounded-lg text-xs flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}
                    </div>

                    {/* Tour Guide & Traveler Reviews Split HUD Column */}
                    <div className="lg:col-span-6 space-y-6">
                      <AnimatePresence mode="wait">
                        {result ? (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                          >
                            {/* Info & Reviews Tab select layout */}
                            <div className="flex border-b border-white/10 gap-4 sm:gap-6 overflow-x-auto scroller-hidden">
                              <button
                                onClick={() => setActiveInfoTab("ar_guide")}
                                className={`pb-3 text-xs uppercase tracking-wider font-mono font-bold transition-all relative shrink-0 cursor-pointer ${
                                  activeInfoTab === "ar_guide" ? "text-gold" : "text-slate-500 hover:text-slate-300"
                                }`}
                              >
                                Guided AR Telemetry
                                {activeInfoTab === "ar_guide" && (
                                  <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gold" />
                                )}
                              </button>
                              <button
                                onClick={() => setActiveInfoTab("reviews")}
                                className={`pb-3 text-xs uppercase tracking-wider font-mono font-bold transition-all relative flex items-center gap-2 shrink-0 cursor-pointer ${
                                  activeInfoTab === "reviews" ? "text-gold" : "text-slate-500 hover:text-slate-300"
                                }`}
                              >
                                Traveler Chronicles
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 font-bold font-mono">
                                  {reviews[result.landmarkName]?.length || 0}
                                </span>
                                {activeInfoTab === "reviews" && (
                                  <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gold" />
                                )}
                              </button>
                              <button
                                onClick={() => setActiveInfoTab("nearby")}
                                className={`pb-3 text-xs uppercase tracking-wider font-mono font-bold transition-all relative flex items-center gap-1.5 shrink-0 cursor-pointer ${
                                  activeInfoTab === "nearby" ? "text-gold" : "text-slate-500 hover:text-slate-300"
                                }`}
                              >
                                <Compass className="w-3.5 h-3.5 text-gold shrink-0" />
                                Nearby Insights
                                {activeInfoTab === "nearby" && (
                                  <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gold" />
                                )}
                              </button>
                              <button
                                onClick={() => setActiveInfoTab("souvenir")}
                                className={`pb-3 text-xs uppercase tracking-wider font-mono font-bold transition-all relative flex items-center gap-1.5 shrink-0 cursor-pointer ${
                                  activeInfoTab === "souvenir" ? "text-gold" : "text-slate-500 hover:text-slate-300"
                                }`}
                              >
                                <Ticket className="w-3.5 h-3.5 text-gold shrink-0" />
                                Digital Souvenir
                                {activeInfoTab === "souvenir" && (
                                  <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gold" />
                                )}
                              </button>
                            </div>

                            {activeInfoTab === "ar_guide" ? (
                              <div className="space-y-6">
                                {shareFeedback && (
                                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/35 text-emerald-300 rounded-xl text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 justify-center animate-bounce">
                                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>{shareFeedback}</span>
                                  </div>
                                )}

                                {/* Major Landmark Title Card */}
                                <div className="p-6 rounded-2xl glass-slate border border-white/10 relative overflow-hidden bg-[#0a0a0a]">
                                  {result.isDemo && (
                                    <div className="absolute top-0 right-0 p-4">
                                      <span className="px-2 py-0.5 border border-gold/20 rounded bg-gold/10 text-gold text-[9px] font-mono uppercase">
                                        Demo Mode
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2 text-xs font-mono text-gold tracking-wider">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>{result.city.toUpperCase()}, {result.country.toUpperCase()}</span>
                                      </div>
                                      <h2 className="text-3xl font-serif font-bold tracking-tight text-white">
                                        {result.landmarkName}
                                      </h2>
                                    </div>

                                    <div className="flex gap-2 self-start sm:self-center">
                                      <button
                                        type="button"
                                        onClick={handleTweetLandmark}
                                        className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500 hover:text-white text-sky-400 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md tracking-wider shrink-0 active:scale-95"
                                        title="Share on X (Twitter)"
                                      >
                                        <Twitter className="w-3.5 h-3.5 shrink-0" />
                                        TWEET
                                      </button>
                                      <button
                                        type="button"
                                        onClick={handleShareLandmarkDetail}
                                        className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase border border-gold/30 bg-gold/5 hover:bg-gold hover:text-slate-950 text-gold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md tracking-wider shrink-0 active:scale-95"
                                      >
                                        <Share2 className="w-3.5 h-3.5 shrink-0" />
                                        SHARE
                                      </button>
                                    </div>
                                  </div>

                                  {/* Weather Indicator widget row */}
                                  {weatherData && (
                                    <div className="mb-5 p-3.5 rounded-xl border border-white/5 bg-black/40 flex items-center justify-between gap-4">
                                      <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-gold/5 border border-gold/15 text-gold shrink-0">
                                          {weatherData.loading ? (
                                            <Loader2 className="w-4 h-4 animate-spin text-gold" />
                                          ) : weatherData.weatherCode === 0 ? (
                                            <Sun className="w-4 h-4 text-gold animate-spin-slow" />
                                          ) : [1, 2, 3].includes(weatherData.weatherCode) ? (
                                            <CloudSun className="w-4 h-4 text-amber-400" />
                                          ) : [45, 48].includes(weatherData.weatherCode) ? (
                                            <Cloud className="w-4 h-4 text-slate-400" />
                                          ) : [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherData.weatherCode) ? (
                                            <CloudRain className="w-4 h-4 text-cyan-400" />
                                          ) : [71, 73, 75, 77, 85, 86].includes(weatherData.weatherCode) ? (
                                            <CloudSnow className="w-4 h-4 text-blue-200" />
                                          ) : [95, 96, 99].includes(weatherData.weatherCode) ? (
                                            <CloudLightning className="w-4 h-4 text-yellow-400 animate-pulse" />
                                          ) : (
                                            <CloudSun className="w-4 h-4 text-gold" />
                                          )}
                                        </div>
                                        <div className="text-left">
                                          <div className="flex items-center gap-1.5">
                                            <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block font-bold leading-none">REAL-TIME WEATHER</span>
                                            {weatherData.loading && <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping" />}
                                          </div>
                                          <span className="text-xs font-semibold text-slate-200 block mt-0.5">
                                            {weatherData.loading ? "Retrieving forecasts..." : weatherData.conditionText}
                                          </span>
                                        </div>
                                      </div>

                                      {!weatherData.loading && (
                                        <div className="flex items-center gap-4 text-right">
                                          <div className="space-y-0.5">
                                            <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block leading-none">TEMP</span>
                                            <span className="text-sm font-semibold font-mono text-white flex items-center justify-end gap-0.5">
                                              <Thermometer className="w-3.5 h-3.5 text-gold shrink-0" />
                                              {weatherData.temp}°C
                                            </span>
                                          </div>
                                          <div className="space-y-0.5">
                                            <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block leading-none">WIND</span>
                                            <span className="text-sm font-semibold font-mono text-slate-300 flex items-center justify-end gap-0.5">
                                              <Wind className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                              {weatherData.windSpeed} <span className="text-[8px] font-sans text-slate-500 uppercase ml-0.5 font-bold">km/h</span>
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Historical background paragraph */}
                                  <div className="space-y-3">
                                    <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-white/10 pb-2">
                                      <History className="w-3.5 h-3.5 text-gold" /> Historical profile
                                    </h3>
                                    <p className="text-sm text-slate-300 leading-relaxed font-sans">
                                      {result.shortHistory}
                                    </p>
                                  </div>
                                </div>

                                {/* Interactive AR Spoken Audio clip */}
                                <div className="p-6 rounded-2xl border border-white/10 bg-[#0a0a0a] relative overflow-hidden space-y-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="p-1.5 rounded bg-gold/10 border border-gold/25 text-gold">
                                        <Volume2 className="w-4 h-4" />
                                      </div>
                                      <span className="text-xs font-mono font-medium text-white tracking-wider uppercase">Spoken Guide Transcript</span>
                                    </div>
                                    
                                    {/* Animated graphic equalizer */}
                                    {isPlayingAudio && (
                                      <div className="flex items-end gap-0.5 h-4 w-6 pointer-events-none">
                                        <span className="w-1 bg-gold rounded-t animate-sound-1" />
                                        <span className="w-1 bg-gold rounded-t animate-sound-2" />
                                        <span className="w-1 bg-gold rounded-t animate-sound-3" />
                                        <span className="w-1 bg-gold rounded-t animate-sound-4" />
                                        <span className="w-1 bg-gold rounded-t animate-sound-5" />
                                      </div>
                                    )}
                                  </div>

                                  <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-4">
                                    <p className="text-sm text-amber-100/90 hover:text-white transition-colors leading-relaxed font-serif italic text-center px-2">
                                      "{result.narrationScript}"
                                    </p>

                                    <div className="flex items-center justify-center gap-3">
                                      {isPlayingAudio ? (
                                        <button
                                          onClick={handleStopNarration}
                                          className="px-5 py-2.5 rounded-lg border border-white/10 bg-[#121212] hover:bg-[#1a1a1a] text-slate-300 flex items-center gap-2 text-xs font-mono cursor-pointer"
                                        >
                                          <Square className="w-3.5 h-3.5 text-slate-300 fill-slate-300" />
                                          PAUSE AUDIO GUIDE
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handlePlayNarration(result.narrationScript)}
                                          className="px-5 py-2.5 rounded-lg bg-gold hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-2 text-xs font-mono shadow-md shadow-gold/10 cursor-pointer"
                                        >
                                          <Play className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                                          PLAY AUDIO GUIDE
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {!narrationSupported && (
                                    <p className="text-[10px] text-slate-500 font-mono text-center">
                                      * SpeechSynthesis is unsupported inside standard sandbox. Read transcription.
                                    </p>
                                  )}
                                </div>

                                {/* Floating anchors alert instruction flag */}
                                <div className="p-4 rounded-xl border border-white/10 bg-black/40 text-xs flex items-center gap-3">
                                  <Info className="w-4 h-4 text-gold shrink-0" />
                                  <span className="text-slate-400 leading-normal">
                                    Click on the floating <strong className="text-white">spatial AR radar pins</strong> mapped on top of your photo to explore individual details or architectural focal zones.
                                  </span>
                                </div>

                                {/* Fun facts indicators */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {result.funFacts.map((fact, id) => (
                                    <div key={id} className="p-4 rounded-xl border border-gold/10 bg-gold/5 flex gap-3">
                                      <Compass className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                                      <div className="space-y-1">
                                        <span className="font-mono text-[9px] text-gold uppercase tracking-widest block font-bold">FACT REVEAL</span>
                                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{fact}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Historic search links */}
                                {result.searchLinks && result.searchLinks.length > 0 && (
                                  <div className="space-y-3">
                                    <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-white/10 pb-2">
                                      <BookOpen className="w-3.5 h-3.5 text-gold" /> Google Search Verified Sources
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                      {result.searchLinks.map((link, lid) => (
                                        <a
                                          key={lid}
                                          href={link.uri}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-slate-300 hover:text-white hover:border-gold/45 transition-all font-mono"
                                        >
                                          <span>{link.title}</span>
                                          <ExternalLink className="w-3 h-3 text-slate-400" />
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : activeInfoTab === "reviews" ? (
                              /* Interactive reviews layout */
                              <div className="space-y-6">
                                {/* Overall cumulative rating scorecard card */}
                                <div className="p-6 rounded-2xl border border-white/10 bg-[#0a0a0a] flex items-center gap-6">
                                  <div className="text-center shrink-0 border-r border-white/10 pr-6">
                                    <span className="text-4xl font-serif font-bold text-white block">
                                      {(() => {
                                        const rList = reviews[result.landmarkName] || [];
                                        return rList.length > 0 
                                          ? (rList.reduce((sum, item) => sum + item.rating, 0) / rList.length).toFixed(1)
                                          : "5.0";
                                      })()}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1 block">
                                      OUT OF 5
                                    </span>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-semibold text-white mb-1.5">Traveler Rating Average</h4>
                                    <div className="flex items-center gap-2">
                                      {(() => {
                                        const rList = reviews[result.landmarkName] || [];
                                        const avgNum = rList.length > 0 
                                          ? Math.round(rList.reduce((sum, item) => sum + item.rating, 0) / rList.length)
                                          : 5;
                                        return (
                                          <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                              <Star 
                                                key={s}
                                                className={`w-3.5 h-3.5 ${
                                                  s <= avgNum 
                                                    ? "text-gold fill-gold" 
                                                    : "text-slate-600 fill-transparent stroke-slate-500"
                                                }`} 
                                              />
                                            ))}
                                          </div>
                                        );
                                      })()}
                                      <span className="text-xs text-slate-400 font-mono">
                                        ({reviews[result.landmarkName]?.length || 0} chronicled review{(reviews[result.landmarkName]?.length || 0) !== 1 ? "s" : ""})
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-normal mt-2 font-sans">
                                      All chronologies are digitally cataloged in local browser sequence.
                                    </p>
                                  </div>
                                </div>

                                {/* Form to submit new traveler chronicle reviews */}
                                <form 
                                  onSubmit={handleReviewSubmit}
                                  className="p-6 rounded-2xl border border-gold/15 bg-gradient-to-b from-[#0e0e0e] to-[#080808] space-y-4"
                                >
                                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                    <h4 className="text-xs uppercase font-mono tracking-wider text-gold font-bold">Write Traveler Chronicle</h4>
                                    <span className="text-[9px] font-mono text-slate-500 uppercase">STATION RECORDER</span>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                      <label className="text-[10px] font-mono text-slate-400 uppercase block">Your Explorer Name</label>
                                      <input 
                                        type="text"
                                        placeholder="Guest Traveler"
                                        required
                                        value={authorName}
                                        onChange={(e) => setAuthorName(e.target.value)}
                                        className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold transition-colors font-sans"
                                      />
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="text-[10px] font-mono text-slate-400 uppercase block">Landmark Score</label>
                                      <div className="flex h-10 items-center p-2 rounded-lg bg-black border border-white/10">
                                        {/* Render interactive rating scale stars matching prompt instructions */}
                                        <div className="flex gap-1">
                                          {[1, 2, 3, 4, 5].map((s) => (
                                            <button
                                              key={s}
                                              type="button"
                                              onClick={() => setFormRating(s)}
                                              className="transition-colors cursor-pointer hover:scale-110 p-0.5"
                                            >
                                              <Star 
                                                className={`w-4 h-4 ${
                                                  s <= formRating 
                                                    ? "text-gold fill-gold" 
                                                    : "text-slate-600 fill-transparent stroke-slate-500"
                                                }`} 
                                              />
                                            </button>
                                          ))}
                                        </div>
                                        <span className="text-xs font-bold text-gold font-mono ml-auto">
                                          {formRating} / 5
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-mono text-slate-400 uppercase block">Chronicle Narrative</label>
                                    <textarea
                                      placeholder="Share your physical experience, historic observations, or transit details about this marvelous architecture..."
                                      rows={3}
                                      required
                                      value={reviewText}
                                      onChange={(e) => setReviewText(e.target.value)}
                                      className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold transition-colors leading-relaxed font-sans"
                                    />
                                  </div>

                                  <div className="flex items-center justify-between gap-4 pt-1">
                                    <span className="text-[10px] font-mono text-emerald-400 leading-tight block">
                                      {submissionFeedback || ""}
                                    </span>
                                    <button
                                      type="submit"
                                      className="px-5 py-2 rounded-lg bg-gold hover:bg-amber-400 text-slate-950 font-bold border border-gold/30 text-xs font-mono uppercase transition-all shrink-0 cursor-pointer"
                                    >
                                      LOG CHRONICLE
                                    </button>
                                  </div>
                                </form>

                                {/* Chronicles List */}
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                    <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold">
                                      Recent Chronicles Database ({reviews[result.landmarkName]?.length || 0})
                                    </h4>
                                  </div>

                                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                                    {(!reviews[result.landmarkName] || reviews[result.landmarkName].length === 0) ? (
                                      <div className="p-8 text-center rounded-xl border border-[#111] border-dashed text-xs text-slate-500 font-mono">
                                        No entries found in traveler chronicles database. Be the first to catalog!
                                      </div>
                                    ) : (
                                      reviews[result.landmarkName].map((review, rIdx) => (
                                        <div 
                                          key={rIdx} 
                                          className="p-4 rounded-xl border border-white/5 bg-black/40 space-y-2 text-left"
                                        >
                                          <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                              <span className="text-xs font-bold text-slate-200">{review.author}</span>
                                              <span className="text-[9px] font-mono font-bold tracking-widest text-emerald-400 uppercase px-1 rounded bg-emerald-500/10 border border-emerald-500/15">
                                                VERIFIED
                                              </span>
                                            </div>
                                            <span className="text-[10px] font-mono text-slate-500">
                                              {review.date}
                                            </span>
                                          </div>
                                          <div>
                                            <div className="flex gap-1">
                                              {[1, 2, 3, 4, 5].map((s) => (
                                                <Star 
                                                  key={s}
                                                  className={`w-3 h-3 ${
                                                    s <= review.rating 
                                                      ? "text-gold fill-gold" 
                                                      : "text-slate-600 fill-transparent stroke-slate-500"
                                                  }`} 
                                                />
                                              ))}
                                            </div>
                                          </div>
                                          <p className="text-xs text-slate-300 leading-relaxed font-sans">
                                            {review.text}
                                          </p>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              /* Interactive Digital Souvenir layout */
                              <div className="space-y-6">
                                {/* Title Card */}
                                <div className="p-5 rounded-2xl glass-slate border border-white/10 bg-[#0a0a0a] flex items-center justify-between gap-4">
                                  <div className="space-y-1 text-left">
                                    <h4 className="font-serif font-bold text-white text-lg flex items-center gap-2">
                                      <Award className="w-5 h-5 text-gold" />
                                      Explorer Digital Keepsake
                                    </h4>
                                    <p className="text-xs text-slate-400 font-sans">
                                      Export your landmark identification, ratings, and active AR highlight tags into a stylized certificate.
                                    </p>
                                  </div>
                                </div>

                                {shareFeedback && (
                                  <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-mono font-bold tracking-wide flex items-center gap-2 justify-center animate-bounce">
                                    <Check className="w-4 h-4 text-emerald-400" />
                                    <span>{shareFeedback}</span>
                                  </div>
                                )}

                                {/* Interactive Card Customization Live Display */}
                                <div className="p-1 rounded-2xl border border-white/5 bg-[#070708]/30">
                                  {/* GORGEOUS INDIVIDUAL CARD PREVIEW FOR PHYSICAL COLLECTIBLE CARD */}
                                  <div className="flex justify-center py-2">
                                    <div
                                      className={`w-full max-w-sm rounded-2xl border p-5 space-y-4 shadow-xl transition-all relative overflow-hidden text-left ${
                                        souvenirTheme === "imperial_gold"
                                          ? "bg-[#0c0d12] border-gold text-white shadow-gold/5"
                                          : souvenirTheme === "arcane_obsidian"
                                          ? "bg-black border-zinc-800 text-zinc-100 shadow-white/5"
                                          : souvenirTheme === "cyberpunk_neon"
                                          ? "bg-[#090a1a] border-pink-500 text-white shadow-pink-500/5 font-sans"
                                          : "bg-[#fdfbf7] border-amber-800 text-stone-900 shadow-amber-900/5 font-serif"
                                      }`}
                                      style={{
                                        boxShadow:
                                          souvenirTheme === "imperial_gold"
                                            ? "0 8px 30px rgba(212,175,55,0.18)"
                                            : souvenirTheme === "cyberpunk_neon"
                                            ? "0 8px 30px rgba(236,72,153,0.18)"
                                            : "0 8px 25px rgba(0,0,0,0.30)",
                                        fontFamily: souvenirTheme === "nouveau_cream" ? "'Georgia', serif" : "inherit"
                                      }}
                                    >
                                      {/* Subtle Background grids for high-fidelity look */}
                                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
                                        <div className="w-full h-full bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
                                      </div>

                                      {/* Elegant Card Header */}
                                      <div className="flex justify-between items-center text-[10px] font-mono tracking-widest uppercase border-b border-white/10 pb-2 border-slate-200/10 mb-2">
                                        <span className={souvenirTheme === "nouveau_cream" ? "text-amber-800 font-bold" : "text-gold font-bold"}>
                                          ✦ HOLOSIGHT PASSPORT ✦
                                        </span>
                                        <span className="opacity-60 text-[8px]">
                                          CODE: {result.city.substring(0,3).toUpperCase()}-{result.yearBuilt.replace(/\s+/g, "")}
                                        </span>
                                      </div>

                                      {/* Central Card Snapshot Display */}
                                      <div className="relative rounded-lg overflow-hidden border border-white/10 aspect-[16/10] bg-black">
                                        {image ? (
                                          <img
                                            src={image}
                                            alt={result.landmarkName}
                                            className="w-full h-full object-cover"
                                            referrerPolicy="no-referrer"
                                          />
                                        ) : (
                                          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-zinc-950 text-center text-slate-500">
                                            <Globe className="w-8 h-8 animate-spin-slow text-gold/30 mb-2" />
                                            <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">GEOIMAGE LOCKING...</span>
                                          </div>
                                        )}
                                        {/* Absolute Coordinate Stamp overlay */}
                                        <div className="absolute bottom-1.5 right-2 bg-black/80 px-2 py-0.5 rounded text-[8px] font-mono text-white tracking-wider flex items-center gap-1 border border-white/5">
                                          <MapPin className="w-2.5 h-2.5 text-gold shrink-0" style={{ color: souvenirTheme === "nouveau_cream" ? "#78350f" : "#d4af37" }} />
                                          {result.coordinates.split(',')[0]}
                                        </div>
                                      </div>

                                      {/* Metadata */}
                                      <div className="space-y-1">
                                        <div className="flex justify-between items-baseline gap-2">
                                          <h3 className={`font-bold tracking-tight ${souvenirTheme === "nouveau_cream" ? "text-stone-900 text-lg font-serif" : "text-white text-base font-serif"}`}>
                                            {result.landmarkName}
                                          </h3>
                                          <span className="text-[9px] font-mono opacity-60 shrink-0">Est. {result.yearBuilt}</span>
                                        </div>
                                        <p className="text-[11px] opacity-65 flex items-center gap-1 font-sans">
                                          📍 {result.city}, {result.country}
                                        </p>
                                      </div>

                                      {/* Dynamic Chronicle review note displays */}
                                      <div className={`p-3.5 rounded-xl text-xs leading-relaxed border font-sans text-left ${
                                        souvenirTheme === "nouveau_cream" 
                                          ? "bg-amber-900/[0.03] border-amber-900/15 text-stone-800 italic" 
                                          : "bg-black/35 border-white/5 text-slate-300 italic"
                                      }`}>
                                        {(() => {
                                          let textToShow = "";
                                          if (souvenirCaptionChoice === "chronicle") {
                                            const lReviews = reviews[result.landmarkName] || [];
                                            textToShow = lReviews.length > 0 ? lReviews[0].text : "Exquisitely preserved monuments mapped in hyper-reality. Absolute architectural triumph.";
                                          } else if (souvenirCaptionChoice === "narrative") {
                                            textToShow = result.narrationScript;
                                          } else {
                                            textToShow = customSouvenirText.trim() || "Captured with custom optical geolenses.";
                                          }
                                          return textToShow.length > 150 ? textToShow.substring(0, 147) + "..." : textToShow || "No caption logged";
                                        })()}
                                      </div>

                                      {/* Footer specs badges & Certificate validation Seal */}
                                      <div className="flex justify-between items-center pt-1">
                                        <div className="space-y-1.5 text-left">
                                          <span className="text-[8px] font-mono uppercase tracking-widest opacity-50 block">Active AR Hotspots</span>
                                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                                            {Object.keys(selectedHighlights)
                                              .filter((h) => selectedHighlights[h])
                                              .slice(0, 2)
                                              .map((highlight) => (
                                                <span
                                                  key={highlight}
                                                  className={`px-1.5 py-0.5 rounded text-[8px] font-mono uppercase border shrink-0 ${
                                                    souvenirTheme === "nouveau_cream"
                                                      ? "bg-amber-900/5 border-amber-900/20 text-amber-900 font-bold"
                                                      : souvenirTheme === "cyberpunk_neon"
                                                      ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-300"
                                                      : "bg-gold/5 border-gold/25 text-gold"
                                                  }`}
                                                >
                                                  {highlight}
                                                </span>
                                              ))}
                                            {Object.keys(selectedHighlights).filter((h) => selectedHighlights[h]).length === 0 && (
                                              <span className="text-[9px] opacity-40 italic font-sans animate-pulse">None selected</span>
                                            )}
                                          </div>
                                        </div>

                                        {/* Sealed badge */}
                                        <div className={`w-11 h-11 rounded-full border flex flex-col justify-center items-center shrink-0 shadow-lg ${
                                          souvenirTheme === "nouveau_cream"
                                            ? "border-amber-800 text-amber-900"
                                            : souvenirTheme === "cyberpunk_neon"
                                            ? "border-pink-500 text-pink-400"
                                            : "border-gold text-gold"
                                        }`}>
                                          <Award className="w-4 h-4 shrink-0" />
                                          <span className="text-[5px] font-semibold uppercase tracking-tighter">CERTIFIED</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Customization Controllers list Card */}
                                <div className="p-6 rounded-2xl border border-white/10 bg-[#0a0a0a] space-y-6 text-left">
                                  {/* Theme select pills */}
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider flex items-center gap-1.5">
                                      <Palette className="w-3.5 h-3.5 text-gold" />
                                      1. Select Card Background Motif
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                      {[
                                        { id: "imperial_gold", name: "Imperial Gold", color: "from-yellow-600 to-amber-400" },
                                        { id: "arcane_obsidian", name: "Arcane Obsidian", color: "from-zinc-700 to-zinc-900" },
                                        { id: "cyberpunk_neon", name: "Cyberpunk Neon", color: "from-pink-500 to-cyan-400" },
                                        { id: "nouveau_cream", name: "Nouveau Cream", color: "from-amber-100 to-stone-200 text-stone-900" }
                                      ].map((theme) => (
                                        <button
                                          key={theme.id}
                                          type="button"
                                          onClick={() => setSouvenirTheme(theme.id as any)}
                                          className={`px-3 py-2 rounded-xl text-left border text-xs font-mono font-medium transition-all flex items-center justify-between gap-3 cursor-pointer ${
                                            souvenirTheme === theme.id
                                              ? "border-gold bg-gold/10 text-white shadow shadow-gold/5"
                                              : "border-white/5 bg-black/40 text-slate-400 hover:border-white/10 hover:text-slate-200"
                                          }`}
                                        >
                                          <span>{theme.name}</span>
                                          <span className={`w-8 h-2 rounded bg-gradient-to-r ${theme.color} shrink-0`} />
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Explorer signature input */}
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">
                                      2. Chronologist Signature Identifier (Explorer Code)
                                    </label>
                                    <input
                                      type="text"
                                      value={authorName}
                                      onChange={(e) => {
                                        setAuthorName(e.target.value);
                                        if (typeof window !== "undefined") {
                                          localStorage.setItem("holosight_explorer_author", e.target.value);
                                        }
                                      }}
                                      placeholder="ENTER EXPLORER CODE..."
                                      className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-xs font-mono tracking-wide text-white focus:outline-none focus:border-gold transition-colors text-left"
                                    />
                                  </div>

                                  {/* Caption source selection pills */}
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">
                                      3. Personal Kept Chronicle Content Source
                                    </label>
                                    <div className="flex rounded-xl bg-black border border-white/10 p-1">
                                      {[
                                        { id: "chronicle", label: "My Review" },
                                        { id: "narrative", label: "AR Narration" },
                                        { id: "custom", label: "Type Custom Note" }
                                      ].map((tab) => (
                                        <button
                                          key={tab.id}
                                          type="button"
                                          onClick={() => setSouvenirCaptionChoice(tab.id as any)}
                                          className={`flex-1 text-center py-2 text-[10px] uppercase font-mono font-bold rounded-lg transition-all cursor-pointer ${
                                            souvenirCaptionChoice === tab.id
                                              ? "bg-gold text-slate-950 font-bold"
                                              : "text-slate-400 hover:text-slate-200"
                                          }`}
                                        >
                                          {tab.label}
                                        </button>
                                      ))}
                                    </div>

                                    {souvenirCaptionChoice === "custom" && (
                                      <textarea
                                        rows={3}
                                        value={customSouvenirText}
                                        onChange={(e) => setCustomSouvenirText(e.target.value.substring(0, 150))}
                                        placeholder="Type customized journal log text to imprint directly on the souvenir postcard card (supports up to 150 characters)..."
                                        className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-xs font-sans text-slate-200 focus:outline-none focus:border-gold/50 transition-colors text-left"
                                      />
                                    )}

                                    {souvenirCaptionChoice === "chronicle" && (
                                      <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-400 text-left">
                                        {(reviews[result.landmarkName] || []).length > 0 ? (
                                          <p className="italic">"{reviews[result.landmarkName][0].text}"</p>
                                        ) : (
                                          <p className="text-amber-500/80 italic font-medium flex items-center gap-1.5">
                                            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                                            No personal reviews written. Write a review in the "Traveler Chronicles" tab or select another source!
                                          </p>
                                        )}
                                      </div>
                                    )}

                                    {souvenirCaptionChoice === "narrative" && (
                                      <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-400 italic text-left">
                                        "{result.narrationScript}"
                                      </div>
                                    )}
                                  </div>

                                  {/* AR hotspots check-checklist */}
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">
                                      4. Check Active Architectural Hotspots to Feature
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                      {result.arAnchors.map((anchor) => {
                                        const isSelected = selectedHighlights[anchor.label] ?? false;
                                        return (
                                          <button
                                            key={anchor.label}
                                            type="button"
                                            onClick={() => {
                                              setSelectedHighlights(prev => ({
                                                ...prev,
                                                [anchor.label]: !isSelected
                                              }));
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-[10px] font-mono border flex items-center gap-1.5 transition-all cursor-pointer ${
                                              isSelected
                                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                                                : "bg-black/30 border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-400"
                                            }`}
                                          >
                                            {isSelected ? <Check className="w-3 h-3 text-emerald-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />}
                                            {anchor.label}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Compilation Actions and download button triggers */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/10">
                                    <button
                                      type="button"
                                      onClick={handleDownloadSouvenirCard}
                                      disabled={exportingCard}
                                      className="py-3.5 rounded-xl bg-gold hover:bg-amber-400 text-slate-950 font-bold border border-gold/30 flex items-center justify-center gap-2 shadow-lg shadow-gold/20 active:scale-95 transition-all text-sm cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                      {exportingCard ? (
                                        <>
                                          <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                                          COMPILING POSTCARD ENGINE...
                                        </>
                                      ) : (
                                        <>
                                          <Download className="w-4 h-4 text-slate-950" />
                                          DOWNLOAD PNG SOUVENIR
                                        </>
                                      )}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={handleShareSouvenirText}
                                      className="py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 flex items-center justify-center gap-2 active:scale-95 transition-all font-mono tracking-wide text-xs cursor-pointer"
                                    >
                                      <Copy className="w-4 h-4 text-slate-300" />
                                      COPY SHARE TRAVELOGUE
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {activeInfoTab === "nearby" && (
                              <div className="space-y-6">
                                <div className="p-6 rounded-2xl glass-slate border border-white/10 bg-[#0a0a0a]">
                                  <h3 className="text-sm uppercase font-mono tracking-wider text-gold flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
                                    <Compass className="w-4 h-4" /> AI Nearby Recommendations
                                  </h3>
                                  {result.nearbyRecommendations && result.nearbyRecommendations.length > 0 ? (
                                    <div className="space-y-4">
                                      {result.nearbyRecommendations.map((rec, i) => (
                                        <div key={i} className="p-4 rounded-xl border border-white/5 bg-black/40">
                                          <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-200">{rec.name}</h4>
                                            <span className="text-[9px] px-2 py-0.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 font-mono tracking-wider uppercase">
                                              {rec.type}
                                            </span>
                                          </div>
                                          <p className="text-xs text-slate-400 italic">"{rec.info}"</p>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-slate-400 text-sm text-center py-6 italic border border-white/5 rounded-xl border-dashed">
                                      No nearby recommendations available for this location.
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                          </motion.div>
                        ) : (
                          // Unscanned Frame Telemetry Placeholder Component (Sophisticated Dark Style)
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-16 px-8 rounded-2xl border border-dashed border-white/10 bg-[#0a0a0a] flex flex-col items-center justify-center text-center space-y-4"
                          >
                            <div className="w-14 h-14 rounded-full bg-black border border-white/10 text-gold flex items-center justify-center animate-pulse-slow">
                              <ImageIcon className="w-6 h-6 text-gold" />
                            </div>
                            <div className="space-y-1 max-w-sm">
                              <h4 className="font-serif font-medium text-white text-base">Optic Capture Mounted</h4>
                              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                                Click the glowing gold "Scan with AR Vision" button to trigger the historical search engine and start vocal tour guides!
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Gamification Badges Modal */}
      <AnimatePresence>
        {showBadgesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-2xl glass-slate"
            >
              <button
                onClick={() => setShowBadgesModal(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/30">
                  <Award className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-white tracking-tight">Traveler Badges</h3>
                  <p className="text-xs text-slate-400 font-mono">YOUR UNLOCKED DISCOVERIES</p>
                </div>
              </div>

              {unlockedBadges.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto scroller-hidden">
                  {unlockedBadges.map((badge, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-center p-4 bg-black/40 border border-gold/20 rounded-xl text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-gold/5 flex items-center justify-center border border-gold/10 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                        <Award className="w-6 h-6 text-gold drop-shadow-md" />
                      </div>
                      <span className="text-xs font-bold font-sans text-slate-200">{badge}</span>
                      <span className="text-[9px] font-mono text-gold uppercase tracking-widest">Unlocked</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <History className="w-5 h-5 text-slate-500" />
                  </div>
                  <p className="text-sm font-medium text-slate-300">No Badges Yet</p>
                  <p className="text-xs text-slate-500 max-w-[250px]">
                    Scan your first landmark with AR vision to unlock your first traveler badge!
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden off-screen canvas used purely for video frame snapshots */}
      <canvas ref={canvasRef} className="hidden" />

    </div>
  );
}
