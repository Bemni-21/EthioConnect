const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const CATEGORIES = [
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

async function main() {
  console.log("Seeding EthioConnect…");

  // Categories
  for (const c of CATEGORIES) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  const hash = await bcrypt.hash("admin123", 10);
  const clientHash = await bcrypt.hash("client123", 10);
  const providerHash = await bcrypt.hash("provider123", 10);

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@ethioconnect.et" },
    update: {},
    create: { name: "EthioConnect Admin", email: "admin@ethioconnect.et", passwordHash: hash, role: "ADMIN" },
  });

  // Demo client
  const client = await prisma.user.upsert({
    where: { email: "client@ethioconnect.et" },
    update: {},
    create: { name: "Demo Client", email: "client@ethioconnect.et", phone: "+251 911 000 000", passwordHash: clientHash, role: "CLIENT" },
  });

  // Demo providers
  const demoProviders = [
    {
      owner: { name: "Abraham Tadesse", email: "abraham@boleplumbing.et" },
      businessName: "Bole Plumbing Services",
      bio: "Licensed plumber with 12 years of experience serving Bole, Kirkos and Yeka. Specializing in leak detection, water heater installation, bathroom & kitchen fittings, and drainage unblocking. We use quality CPVC and PPR pipes and provide a 3-month warranty on all repairs.\n\nAvailable Monday–Saturday, 8:00–18:00. Emergency call-outs on weekends.",
      city: "Addis Ababa", subcity: "Bole", woreda: "Woreda 03",
      categories: ["plumbers"],
      pricingType: "FIXED", startingPrice: 500,
      phone: "+251 911 123 456", telegram: "@boleplumbing", whatsapp: "+251911123456",
      isVerified: true,
      reviews: [
        { rating: 5, comment: "Fixed our kitchen leak within an hour. Very professional and fair price." },
        { rating: 5, comment: "Installed our water heater, clean work and explained everything." },
        { rating: 4, comment: "Good service, arrived a bit late but quality work." },
      ],
    },
    {
      owner: { name: "Mekdes Lemma", email: "mekdes@addiselectric.et" },
      businessName: "Addis Electric Solutions",
      bio: "Certified electricians for homes and small businesses: full house wiring, LED lighting installation, breaker panel upgrades, inverter & solar setup, and safety inspections. Serving all Addis Ababa subcities.\n\nFree site inspection for projects above 5,000 ETB.",
      city: "Addis Ababa", subcity: "Kirkos", woreda: null,
      categories: ["electricians"],
      pricingType: "HOURLY", startingPrice: 350,
      phone: "+251 913 234 567", telegram: "@addiselectric", whatsapp: null,
      isVerified: true,
      reviews: [
        { rating: 5, comment: "Rewired our entire house. Tidy cabling, great communication." },
        { rating: 5, comment: "Fast response for a breaker panel issue. Highly recommended!" },
      ],
    },
    {
      owner: { name: "Dawit Haile", email: "dawit@gondarmech.et" },
      businessName: "Gondar Auto Care",
      bio: "Full-service auto garage: engine diagnostics, brake pads, oil service, tire alignment, clutch and suspension repair for Toyota, Hyundai, Kia and Isuzu models. Genuine spare parts available on request.\n\nPickup & drop-off available within Gondar city.",
      city: "Gondar", subcity: null, woreda: null,
      categories: ["mechanics"],
      pricingType: "NEGOTIABLE", startingPrice: null,
      phone: "+251 920 345 678", telegram: null, whatsapp: "+251920345678",
      isVerified: false,
      reviews: [
        { rating: 4, comment: "Honest pricing, explained what was wrong with my brake system." },
        { rating: 5, comment: "My car runs like new after the service. Trusted garage." },
        { rating: 4, comment: "Quality work, waiting area is basic but fine." },
        { rating: 5, comment: "Great alignment service, handled my SUV carefully." },
      ],
    },
    {
      owner: { name: "Sara Girma", email: "sara@hawassatutors.et" },
      businessName: "Hawassa Excellence Tutoring",
      bio: "Private tutoring in Mathematics, Physics, Chemistry and English for grades 7–12, plus university entrance exam (EHEECE) preparation. Small group (max 4 students) and one-on-one sessions, in Amharic or English.\n\nOnline tutoring via Telegram video also available.",
      city: "Hawassa", subcity: null, woreda: null,
      categories: ["tutors"],
      pricingType: "HOURLY", startingPrice: 250,
      phone: "+251 912 456 789", telegram: "@hawassatutors", whatsapp: null,
      isVerified: true,
      reviews: [
        { rating: 5, comment: "My daughter's math grade went from 55 to 82 in one term!" },
        { rating: 5, comment: "Very patient teacher, great exam preparation materials." },
      ],
    },
    {
      owner: { name: "Kaleb Misgan", email: "kaleb@addissalon.et" },
      businessName: "Kaleb's Premier Barbershop",
      bio: "Modern barbershop in Lideta: haircuts, fades, beard trimming, hot towel shaves and kids' haircuts. Clean tools, sterilized equipment, walk-ins welcome.\n\nOpen daily 9:00–20:00. Appointments via Telegram preferred.",
      city: "Addis Ababa", subcity: "Lideta", woreda: "Woreda 05",
      categories: ["salons"],
      pricingType: "FIXED", startingPrice: 150,
      phone: "+251 910 567 890", telegram: "@kalebbbarber", whatsapp: "+251910567890",
      isVerified: false,
      reviews: [
        { rating: 5, comment: "Best fade in Lideta, consistent quality every time." },
        { rating: 4, comment: "Nice shop and friendly staff. Can get busy on Saturdays." },
      ],
    },
    {
      owner: { name: "Tigist Alemu", email: "tigist@freshclean.et" },
      businessName: "FreshClean Home Services",
      bio: "Professional home and office cleaning: deep cleaning, move-in/move-out cleaning, kitchen & bathroom sanitization, and weekly maintenance plans. Eco-friendly products available for families with children.\n\nServing Bole, Yeka, Gulele and Akaki Kality.",
      city: "Addis Ababa", subcity: "Yeka", woreda: null,
      categories: ["cleaning"],
      pricingType: "FIXED", startingPrice: 800,
      phone: "+251 921 678 901", telegram: "@freshcleaneth", whatsapp: null,
      isVerified: false,
      reviews: [
        { rating: 5, comment: "Amazing deep clean before our move-in. Spotless!" },
        { rating: 4, comment: "Reliable weekly cleaning, good team." },
      ],
    },
  ];

  for (const d of demoProviders) {
    const user = await prisma.user.upsert({
      where: { email: d.owner.email },
      update: {},
      create: {
        name: d.owner.name,
        email: d.owner.email,
        phone: d.phone,
        passwordHash: providerHash,
        role: "PROVIDER",
      },
    });

    const provider = await prisma.providerProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        businessName: d.businessName,
        bio: d.bio,
        city: d.city,
        subcity: d.subcity,
        woreda: d.woreda,
        pricingType: d.pricingType,
        startingPrice: d.startingPrice,
        phone: d.phone,
        telegram: d.telegram,
        whatsapp: d.whatsapp,
        isVerified: d.isVerified,
        isActive: true,
        categories: { connect: d.categories.map((slug) => ({ slug })) },
      },
    });

    for (const r of d.reviews) {
      const reviewUser = await prisma.user.create({
        data: {
          name: `Reviewer ${Math.random().toString(36).slice(2, 6)}`,
          email: `rev-${Math.random().toString(36).slice(2, 8)}@example.et`,
          passwordHash: clientHash,
          role: "CLIENT",
        },
      });
      await prisma.review.upsert({
        where: { providerId_clientId: { providerId: provider.id, clientId: reviewUser.id } },
        update: {},
        create: { providerId: provider.id, clientId: reviewUser.id, rating: r.rating, comment: r.comment },
      });
    }
  }

  console.log("✅ Seed complete.");
  console.log("   Admin:  admin@ethioconnect.et / admin123");
  console.log("   Client: client@ethioconnect.et / client123");
  console.log("   Provider demo login: abraham@boleplumbing.et / provider123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
