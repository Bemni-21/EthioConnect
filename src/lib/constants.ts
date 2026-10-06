export interface CategoryDef {
  slug: string;
  nameEn: string;
  nameAm: string;
  icon: string;
  description: string;
}

export const CATEGORIES: CategoryDef[] = [
  { slug: "plumbers", nameEn: "Plumbers", nameAm: "ቧንቧ ሠራተኛ", icon: "Droplets", description: "Pipe fitting, leakage repair, water heaters & drainage" },
  { slug: "electricians", nameEn: "Electricians", nameAm: "ኤሌክትሪሽን", icon: "Zap", description: "Wiring, lighting, panel repair & electrical maintenance" },
  { slug: "mechanics", nameEn: "Mechanics", nameAm: "መካኒክ", icon: "Car", description: "Car repair, servicing, tire & body work" },
  { slug: "tutors", nameEn: "Tutors", nameAm: "አስተማሪ", icon: "GraduationCap", description: "Private tutoring for all grades & exam prep" },
  { slug: "salons", nameEn: "Hair Salons & Barbers", nameAm: "ሳሎን & ባርበር", icon: "Scissors", description: "Hairdressing, braiding, barbering & beauty care" },
  { slug: "cleaning", nameEn: "Cleaning Services", nameAm: "የማጣፍ አገልግሎት", icon: "Sparkles", description: "Home, office & deep cleaning" },
  { slug: "freelancers", nameEn: "Freelancers", nameAm: "ፍራላንሰር", icon: "Briefcase", description: "Design, writing, translation & digital services" },
  { slug: "appliance", nameEn: "Appliance Repair", nameAm: "የመሳሪያ ጥገና", icon: "Tv", description: "TV, fridge, washer & AC repair technicians" },
  { slug: "carpentry", nameEn: "Carpentry", nameAm: "ሠላም ሠራተኛ", icon: "Hammer", description: "Furniture making, doors, cabinets & repairs" },
  { slug: "painting", nameEn: "Painting", nameAm: "ስላስላ ሠራተኛ", icon: "Paintbrush", description: "Interior & exterior house painting" },
];

export const CITIES: string[] = [
  "Addis Ababa",
  "Adama",
  "Bahir Dar",
  "Hawassa",
  "Dire Dawa",
  "Mekelle",
  "Gondar",
  "Jimma",
  "Nekemte",
  "Shashamane",
];

export const ADDIS_SUBCITIES: string[] = [
  "Addis Ketema",
  "Akaki Kality",
  "Arada",
  "Bole",
  "Gulele",
  "Yeka",
  "Kirkos",
  "Kolfe Keranio",
  "Lideta",
  "Lemi Kura",
  "Nifas Silk-Lafto",
];

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export const formatETB = (amount: number) =>
  `${amount.toLocaleString("en-US")} ETB`;
