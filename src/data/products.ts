import { Product, Review } from '../types';

export const LUXURY_BRANDS = [
  'Nike',
  'Adidas',
  'New Balance',
  'Puma',
  'Asics',
  'Converse',
  'Vans',
  'Jordan',
  'Balenciaga',
  'Valentino',
  'Alexander McQueen',
  'Gucci',
  'Dior',
  'Louis Vuitton',
  'Off-White',
  'Golden Goose',
  'Lanvin',
  'Common Projects'
];

export const CATEGORIES = [
  'All Collections',
  'Retro Classics',
  'Luxury High-End',
  'Performance Athletic',
  'Skate & Street'
];

export const SIZES = ['40', '41', '42', '43', '44', '45'];

export const COLORS = [
  { name: 'Noir Black', hex: '#000000' },
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Wolf Grey', hex: '#808080' },
  { name: 'Crimson Red', hex: '#DC143C' },
  { name: 'Varsity Blue', hex: '#1E90FF' },
  { name: 'Sail Cream', hex: '#F5F5DC' },
  { name: 'Forest Green', hex: '#228B22' },
  { name: 'Midnight Navy', hex: '#191970' }
];

// Curated raw Unsplash premium sneaker photos to rotate for maximum realism
const UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', // Red Nike
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80', // Nike colorful Dunk
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80', // Volt Nike
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80', // White Puma
  'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80', // Orange/White New Balance
  'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80', // Jordan Retro High
  'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&q=80', // Vans Style
  'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80', // Adidas Samba/Gazelle
  'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80', // Vans classic black/white
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80', // Common Projects leather
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80', // Black Running Nike
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80', // Multicolor luxury trainer
  'https://images.unsplash.com/photo-1508150148186-aa68d2f50b84?w=800&q=80', // Luxury dress trainer
  'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&q=80', // Red Converse
  'https://images.unsplash.com/photo-1620138546344-7b2c0b05159d?w=800&q=80', // Yellow High-top
  'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=800&q=80', // Asics technical mesh
  'https://images.unsplash.com/photo-1618677831708-0e7fda3148b4?w=800&q=80', // Retro street low-top
  'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80', // Jordan 4 Black
  'https://images.unsplash.com/photo-1612902377756-414b2139d5e2?w=800&q=80', // New Balance Grey
  'https://images.unsplash.com/photo-1534330207526-8e81f10ec6fc?w=800&q=80', // Chunky Balenciaga style
  'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80', // Blue Adidas Boost
  'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=800&q=80'  // White leather designer shoe
];

interface BaseTemplate {
  name: string;
  description: string;
  details: string[];
  minPrice: number;
  maxPrice: number;
  category: string;
  isLuxury?: boolean;
}

// 3 Highly authentic models per brand * 18 brands = 54 core design archetypes.
// We will generate 2 unique colorways/variants of each to yield exactly 108 products.
const BRAND_ARCHETYPES: Record<string, BaseTemplate[]> = {
  'Nike': [
    {
      name: "Dunk Low Retro",
      description: "Originally created for the hardwood, the Dunk later became a street-style staple. Featuring its classic low-top profile, premium leather overlays, and retro colorways.",
      details: ["Premium full-grain tumbled leather", "Padded low-cut collar", "Perforated toe box for ventilation", "Durable gum rubber outsole"],
      minPrice: 6500, maxPrice: 8000, category: "Retro Classics"
    },
    {
      name: "Air Force 1 '07 Premium",
      description: "The radiance lives on in the Air Force 1. Combining hardwood comfort with off-court flair, this luxury version is finished with metallic details and premium leather trim.",
      details: ["Double-stitched premium leather panels", "Nike Air encapsulation cushioning", "Non-marking translucent rubber sole", "Padded collar support"],
      minPrice: 7000, maxPrice: 9500, category: "Retro Classics"
    },
    {
      name: "ZoomX Vaporfly 3",
      description: "Built for the pursuers of personal bests, the ZoomX Vaporfly 3 offers marathon-level propulsion, extreme stability, and unparalleled energy return with state-of-the-art foam.",
      details: ["Full-length internal carbon fiber Flyplate", "ZoomX foam midsole for responsive cushioning", "Engineered lightweight Flyknit upper", "Waffle outsole traction"],
      minPrice: 10000, maxPrice: 12000, category: "Performance Athletic"
    }
  ],
  'Adidas': [
    {
      name: "Samba OG Leather",
      description: "First developed as an indoor soccer trainer, the Adidas Samba has evolved into a global streetwear icon, marked by its classic T-toe profile and signature gold lettering.",
      details: ["Buttery soft full grain leather", "Authentic suede T-toe design overlay", "Low-profile gum rubber cupsole", "Synthetic leather lining"],
      minPrice: 5500, maxPrice: 7000, category: "Retro Classics"
    },
    {
      name: "Ultraboost Light",
      description: "Experience epic energy return with the lightest Ultraboost ever. Features a revolutionary Light BOOST cushioning system and a highly supportive Primeknit engineered sock upper.",
      details: ["Lightweight BOOST generation foam", "Linear Energy Push system integrated in sole", "Primeknit+ performance engineered textile", "Continental™ natural rubber outsole"],
      minPrice: 8500, maxPrice: 11000, category: "Performance Athletic"
    },
    {
      name: "Gazelle Vintage",
      description: "An exact reissue of the iconic 1991 Gazelle silhouette. Showcases vintage textures, rich suede paneling, and retro proportions for the ultimate casual luxury vibe.",
      details: ["Premium treated cowhide suede upper", "Soft leather lining on heel collar", "OrthoLite® premium comfort sockliner", "Signature textured rubber outsole"],
      minPrice: 6000, maxPrice: 8000, category: "Retro Classics"
    }
  ],
  'New Balance': [
    {
      name: "990v6 Made in USA",
      description: "Crafted without compromise in NB's American workshops. The 990v6 features sleek pigskin suede paneling and propulsive FuelCell midsole cushioning for daily luxury lifestyle.",
      details: ["Handcrafted pigskin suede and mesh", "FuelCell foam delivers propulsive energy return", "ENCAP classic heel cushioning combining durable rim", "Reflective safety accents on N logo"],
      minPrice: 11000, maxPrice: 13000, category: "Performance Athletic"
    },
    {
      name: "550 Court Classic",
      description: "A brilliant recreation of New Balance's archival 1989 low-top basketball shoe. Offering clean retro athletic lines, heavy leather panels, and premium vintage court appeal.",
      details: ["Heavyweight solid premium leather", "Padded breathable mesh tongue", "Non-marking basketball rubber cupsole", "Vintage foam cushioning"],
      minPrice: 6000, maxPrice: 8500, category: "Retro Classics"
    },
    {
      name: "1906R Protection Pack",
      description: "A highly sought-after technical runner redesigned with a rugged, shredded premium suede aesthetic. Perfectly balances high fashion with outstanding foot support.",
      details: ["Deconstructed raw suede and mesh", "N-ergy shock absorbing technical outsole", "ABZORB heel cushioning absorbs severe impact", "Stability Web arch support system"],
      minPrice: 9000, maxPrice: 11500, category: "Performance Athletic"
    }
  ],
  'Puma': [
    {
      name: "Suede Classic XXI",
      description: "The defining street silhouette from Puma, featuring full suede paneling, white contrast formstrips, and a clean low-profile design that has remained classic since 1968.",
      details: ["100% Premium cow suede upper", "Synthetic leather lining inside collar", "Puma Formstrip stitching on sides", "Textured rubber midsole casing"],
      minPrice: 4000, maxPrice: 5500, category: "Retro Classics"
    },
    {
      name: "Palermo OG Leather",
      description: "Directly revived from Puma's 1980s terrace archives, this iconic sneaker features a retro signature tag on the upper, classic gum outsole, and soft luxury construction.",
      details: ["Soft leather base with suede overlays", "Contrast synthetic leather Puma formstrip", "Palermo gold foil branding label", "Classic indoor gum rubber cupsole"],
      minPrice: 5000, maxPrice: 7000, category: "Retro Classics"
    },
    {
      name: "RS-X3 Extreme Runner",
      description: "A bold, bulky sneaker loaded with Puma's proprietary Running System technology. Blends mesh overlays, colorful panels, and extreme comfort padding.",
      details: ["Mesh upper with suede and hotmelt overlays", "Lightweight PU midsole with RS technology", "Bold chunky rubber outsole tread", "Molded comfort sockliner"],
      minPrice: 6000, maxPrice: 9000, category: "Performance Athletic"
    }
  ],
  'Asics': [
    {
      name: "GEL-NYC Retro Runner",
      description: "The GEL-NYC sneaker sources inspiration from heritage and modern performance running styles. Features an engineered midfoot cage structure and supreme gel cushions.",
      details: ["Mesh base with premium suede overlays", "GEL technology cushioning in front and rear", "Dynamic ortholite sockliner padding", "TRUSSTIC support system for arch stability"],
      minPrice: 7000, maxPrice: 9500, category: "Performance Athletic"
    },
    {
      name: "GEL-Kayano 30 Stability",
      description: "The ultimate stability running shoe, loaded with premium 4D Guidance System technology and pureGEL cushioning for an exceptionally plush and responsive feel.",
      details: ["4D Guidance System provides adaptive stability", "PureGEL technology cushioning inside heel", "FF BLAST™ PLUS ECO lightweight foam", "Engineered stretch knit upper"],
      minPrice: 9000, maxPrice: 11000, category: "Performance Athletic"
    },
    {
      name: "GEL-1130 Classic",
      description: "Spanning across decades of design evolution, the GEL-1130 pays homage to retro technical running aesthetics, showcasing heavy metallic details.",
      details: ["Late 2000s stable runner silhouette", "Breathable sandwich mesh underlays", "GEL technology inserts in heel", "TRUSSTIC support structure in midsole"],
      minPrice: 5000, maxPrice: 6800, category: "Retro Classics"
    }
  ],
  'Converse': [
    {
      name: "Chuck 70 Vintage High",
      description: "The premium version of the legendary high-top canvas sneaker. Constructed with extra-durable heavy canvas, vintage stitching, and varnished high-walled glossy midsoles.",
      details: ["12oz premium heavy cotton canvas", "Varnished vintage egret rubber sidewalls", "Winged tongue stitching keeps it locked", "OrthoLite® insole provides premium comfort"],
      minPrice: 3500, maxPrice: 5000, category: "Retro Classics"
    },
    {
      name: "Run Star Hike Platform",
      description: "A high-fashion twist on the classic Chuck, incorporating a chunky, double-stacked platform sole and jagged two-tone trail-inspired rubber outsoles.",
      details: ["High-top organic canvas upper", "Lugged two-tone rubber tread outer sole", "Double-stacked EVA platform midsole", "SmartFOAM premium plush sockliner"],
      minPrice: 4500, maxPrice: 6000, category: "Skate & Street"
    },
    {
      name: "Weapon Low Leather",
      description: "Revived from Converse's 1986 basketball archive. The Weapon low features rich full leather paneling, supportive Y-bar ankle details, and absolute vintage retro flair.",
      details: ["Premium grain leather upper structure", "Retro Y-Bar ankle support construction", "Vintage off-white rubber cupsole", "Padded terry cloth lining"],
      minPrice: 5000, maxPrice: 6500, category: "Retro Classics"
    }
  ],
  'Vans': [
    {
      name: "Old Skool Pro Classic",
      description: "The ultimate skate sneaker that pioneered the iconic side jazz stripe. Upgraded with duracap underlays and ultra-cushioned popcush insoles for elite wear.",
      details: ["Durable canvas and cow suede upper", "Vans signature waffle rubber outsole", "POPCUSH energy-return footbeds", "DURACAP rubber reinforcement underlays"],
      minPrice: 3000, maxPrice: 4500, category: "Skate & Street"
    },
    {
      name: "Classic Slip-On Checkerboard",
      description: "Effortless, classic, and instantly recognizable. The Vans Slip-On is a cultural icon featuring the famous checkerboard canvas motif and comfortable elastic accents.",
      details: ["Sturdy low-profile canvas upper", "Waffle pattern rubber outsole", "Padded leather collar lining", "Elastic side panel accents for easy fit"],
      minPrice: 3000, maxPrice: 4000, category: "Skate & Street"
    },
    {
      name: "Sk8-Hi High-Top Pro",
      description: "The legendary lace-up high-top inspired by classic skate culture, reinforced with protective padded ankle chambers and durable suede toes.",
      details: ["Premium suede toe, tongue and heel caps", "Sturdy canvas midfoot section", "Padded high-top collar support", "Vulcanized rubber sole with waffle grip"],
      minPrice: 3500, maxPrice: 5500, category: "Skate & Street"
    }
  ],
  'Jordan': [
    {
      name: "Air Jordan 1 Retro High OG",
      description: "The absolute pinnacle of sneaker history. Crafted from rich tumbled leather panels, featuring the iconic wings logo and classic air-sole unit in the heel.",
      details: ["Premium full-grain leather upper panels", "Encapsulated Air-Sole cushioning in heel", "High-top supportive padded collar", "Solid rubber cupsole traction"],
      minPrice: 14000, maxPrice: 18000, category: "Retro Classics"
    },
    {
      name: "Air Jordan 4 Retro Premium",
      description: "One of the most loved Jordan silhouettes, updated with luxury leather materials, TPU wing locks, and dual visible air units for premium street wear.",
      details: ["Genuine nubuck or leather base upper", "Visible heel Air-Sole unit for cushions", "Plastic lace lock wings on upper sides", "Unique mesh netting side inserts"],
      minPrice: 12000, maxPrice: 16500, category: "Retro Classics"
    },
    {
      name: "Air Jordan 11 Retro Concord",
      description: "The elegant icon of basketball, famously featuring a shiny premium patent leather wrap, a carbon fiber stability plate, and translucent icy blue outsoles.",
      details: ["High-shine patent leather mudguards", "Ballistic mesh lightweight upper", "Full-length carbon fiber midfoot plate", "Icy translucent rubber outer grips"],
      minPrice: 15000, maxPrice: 18000, category: "Retro Classics"
    }
  ],
  'Balenciaga': [
    {
      name: "Triple S Chunky Trainer",
      description: "The pioneer of the luxury chunky sneaker movement. Features an imposing triple-layered midsole molded from athletic running, basketball, and track elements.",
      details: ["Non-leather construction: mesh, nylon and polyurethane", "Molded triple-stacked heavy outsole", "Size embroidered at the edge of the toe", "Debossed logo on the side and back heel"],
      minPrice: 32000, maxPrice: 42000, category: "Luxury High-End", isLuxury: true
    },
    {
      name: "Track.2 Tech Runner",
      description: "An incredibly complex high-tech high-fashion runner, consisting of over 176 separate panels layered together in a futuristic cage design.",
      details: ["Multi-faceted 176-panel athletic design", "Track debossed metallic branding on heel", "Extremely chunky traction tread lugs", "Dynamic sole design with back reinforcement"],
      minPrice: 36000, maxPrice: 45000, category: "Luxury High-End", isLuxury: true
    },
    {
      name: "Speed Sock Trainer",
      description: "A highly minimalist sock-like high fashion sneaker, constructed in a technical 3D knit upper with an ultra-light ergonomic molded sole.",
      details: ["Ultra-light technical 3D knit textile", "Ergonomic molded sole with No Memory technology", "Balenciaga contrast branding printed on side", "Very flexible: 240g weight feel"],
      minPrice: 32000, maxPrice: 40000, category: "Luxury High-End", isLuxury: true
    }
  ],
  'Valentino': [
    {
      name: "Rockrunner Camo Trainer",
      description: "A sophisticated blend of sporty mesh, camouflage suede, and leather paneling. Completed with Valentino's signature rockstud accents along the heel.",
      details: ["Premium cow suede and mesh fabric", "Camouflage print motif panels", "Signature rubber rockstud heel clips", "Molded tread rubber grip sole"],
      minPrice: 18000, maxPrice: 28000, category: "Luxury High-End", isLuxury: true
    },
    {
      name: "One Stud Leather Trainer",
      description: "A sleek contemporary design showcasing a singular oversized enameled rockstud on the midfoot panel. Handcrafted from pure Italian calfskin leather.",
      details: ["100% Selected Italian calf leather", "4.5cm thick cushioned street midsole", "Oversized iconic enameled metal rockstud", "Handmade in Italy with velvet dustbags"],
      minPrice: 22000, maxPrice: 32000, category: "Luxury High-End", isLuxury: true
    },
    {
      name: "Open Skate Sneaker",
      description: "A luxury take on the bulky 1990s skate sneakers. Built with high-end padded leather, thick contrast bands, and chunky laces.",
      details: ["Extra thick padded calfskin leather tongue", "Contrast colored rubber band detail", "Thick double-weave cotton laces", "V-logo debossing on back heels"],
      minPrice: 25000, maxPrice: 35000, category: "Luxury High-End", isLuxury: true
    }
  ],
  'Alexander McQueen': [
    {
      name: "Oversized Leather Sneaker",
      description: "The absolute classic oversized court sneaker, distinguished by its thick wedge sole and contrast leather heel tabs with gold-foil branding.",
      details: ["100% Premium smooth calf leather", "Chunky 50mm oversized rubber sole", "Contrast colored leather heel counter tabs", "Alexander McQueen gold foil logo signatures"],
      minPrice: 20000, maxPrice: 30000, category: "Luxury High-End", isLuxury: true
    },
    {
      name: "Tread Slick Boot-Sneaker",
      description: "A hybrid design combining a classic canvas lace-up upper with an oversized, rugged heavy-duty industrial rubber lug sole.",
      details: ["Heavy cotton canvas upper structure", "Oversized industrial rubber lug sole base", "Alexander McQueen signature ribbon on heel", "Ribbed rubber toe cap box"],
      minPrice: 24000, maxPrice: 34000, category: "Luxury High-End", isLuxury: true
    },
    {
      name: "Sprint Runner Tech",
      description: "A streamlined athletic lifestyle luxury runner, crafted in white leather with a dynamic 3D rose seal motif appliquéd on the side panel.",
      details: ["Selected calf leather and tech fabric upper", "3D appliquéd Rose Seal emblem on side", "Flexible ergonomic sport runner outer sole", "Alexander McQueen signature script on tongue"],
      minPrice: 28000, maxPrice: 38000, category: "Luxury High-End", isLuxury: true
    }
  ],
  'Gucci': [
    {
      name: "Ace Web Sneaker",
      description: "A timeless low-top retro tennis silhouette, decorated with Gucci's historic green and red webbing strip on the sides and snakeskin heel details.",
      details: ["Ultra-soft white calfskin leather", "Gucci signature green/red web canvas stripe", "Snakeskin-effect metallic contrast heel counters", "Durable flat rubber cupsole"],
      minPrice: 28000, maxPrice: 38000, category: "Luxury High-End", isLuxury: true
    },
    {
      name: "Rhyton Retro Trainer",
      description: "Inspired by chunky old-school sneakers from the 1990s, the Rhyton features a thick chunky sole and archival Gucci vintage graphic print.",
      details: ["Distressed off-white premium leather upper", "Chunky, heavy-cushioned vintage street sole", "Archival Gucci vintage logo graphic print", "Debossed Gucci branding on heel sole"],
      minPrice: 32000, maxPrice: 42000, category: "Luxury High-End", isLuxury: true
    },
    {
      name: "Screener Vintage Trainer",
      description: "A beautiful tribute to retro sportswear, hand-treated to achieve an authentic, lived-in distressed look with vintage Gucci colors.",
      details: ["Hand-distressed vintage treated leather", "Gucci oval enamel metal double-G emblem", "Green/orange web side stripes", "Suede panels on the toe and side lace loops"],
      minPrice: 35000, maxPrice: 45000, category: "Luxury High-End", isLuxury: true
    }
  ],
  'Dior': [
    {
      name: "B23 High-Top Canvas",
      description: "Dior's legendary high-top showcasing transparent canvas overlays revealing the iconic Dior Oblique jacquard canvas underneath.",
      details: ["Dior Oblique jacquard canvas fabric", "Transparent high-performance polyurethane overlays", "Two-tone textured rubber sole with signature logo", "Stitched pull tab and back canvas hook"],
      minPrice: 35000, maxPrice: 48000, category: "Luxury High-End", isLuxury: true
    },
    {
      name: "B30 Athletic Runner",
      description: "A dynamic tech-runner blending mesh, technical fabrics, and calfskin. Accented by the reflective CD logo on the side panels.",
      details: ["Highly breathable multi-weave sandwich mesh", "Reflective grey CD signatures on sides", "Dior B30 lightweight performance foam sole", "Made in Italy by hand"],
      minPrice: 45000, maxPrice: 60000, category: "Luxury High-End", isLuxury: true
    },
    {
      name: "B27 Low-Top Calfskin",
      description: "The ideal urban low-top, combining smooth premium calfskin, CD Icon eyelets, and side panels with embossed Dior Oblique Galaxy leather.",
      details: ["Dior Oblique Galaxy laser-cut leather panels", "Embossed CD Icon eyelets", "Structured flat street rubber cupsole", "Padded leather interior lining"],
      minPrice: 38000, maxPrice: 52000, category: "Luxury High-End", isLuxury: true
    }
  ],
  'Louis Vuitton': [
    {
      name: "LV Trainer Calfskin",
      description: "Designed by Virgil Abloh, the iconic LV Trainer is modeled after vintage basketball sneakers, constructed with 7 hours of sewing per pair.",
      details: ["Grained premium calfskin leather base", "Requires 7 hours of hand-stitching per pair", "Louis Vuitton script debossed on the side", "Micro LV monogram flowers on outsole"],
      minPrice: 50000, maxPrice: 75000, category: "Luxury High-End", isLuxury: true
    },
    {
      name: "Run Away Monogram Runner",
      description: "Louis Vuitton's luxury running sneaker, combining suede, technical mesh, and glazed canvas detailed with the iconic LV Monogram print.",
      details: ["Monogram glazed canvas trims", "Suede calfskin and mesh underlays", "Concealed 2cm wedge inside heel for extra height", "Louis Vuitton plaque in gold-finish metal"],
      minPrice: 45000, maxPrice: 65000, category: "Luxury High-End", isLuxury: true
    },
    {
      name: "LV Skate Chunky Sneaker",
      description: "An outstanding chunky design capturing 2000s skate culture. Adorned with monogram flowers and heavy technical double-laces.",
      details: ["Thick padded mesh and calfskin panels", "Monogram flower embellishment on side and heel", "Chunky double-weave woven laces", "Ergonomic street-skate rubber sole"],
      minPrice: 55000, maxPrice: 80000, category: "Luxury High-End", isLuxury: true
    }
  ],
  'Off-White': [
    {
      name: "Out Of Office 'OOO'",
      description: "Designed by Virgil Abloh, the OOO is a perfect mix of late 80s court aesthetics, styled with the signature arrow logo and plastic zip-tie tag.",
      details: ["Premium grained calfskin leather", "Signature side Arrow leather logo", "Removable plastic zip-tie brand tag", "Padded knit collar interior"],
      minPrice: 16000, maxPrice: 24000, category: "Luxury High-End", isLuxury: true
    },
    {
      name: "Vulcanized Low Tag",
      description: "The signature low-top sneaker featuring high-contrast diagonal stripe midsoles, marble-effect zip tie tags, and a deconstructed canvas upper.",
      details: ["Thick washed cotton canvas base", "Signature diagonal black/white stripe midsole", "Removable marbled plastic zip tie tag", "Deconstructed raw canvas edges"],
      minPrice: 18000, maxPrice: 26000, category: "Luxury High-End", isLuxury: true
    },
    {
      name: "Odsy-1000 Chunky Trainer",
      description: "An industrial-inspired hiking-hybrid trainer, finished with heavy sculpted tooth outsoles, signature arrows, and high-visibility industrial details.",
      details: ["Sculpted aggressive trail-tooth rubber outsole", "Industrial logo pull ribbon on heel", "Translucent technical mesh and suede panels", "Off-White text logo detailing on tongue"],
      minPrice: 20000, maxPrice: 28000, category: "Luxury High-End", isLuxury: true
    }
  ],
  'Golden Goose': [
    {
      name: "Super-Star Distressed",
      description: "Golden Goose's signature sneaker, hand-treated by Italian artisans to achieve an authentic, vintage lived-in look with suede stars.",
      details: ["Handcrafted in Italy to look worn-in", "Contrast colored cowhide suede star detail", "Genuine leather interior with loop pile cotton", "Vintage distressed flat rubber sole"],
      minPrice: 20000, maxPrice: 28000, category: "Luxury High-End", isLuxury: true
    },
    {
      name: "Ball Star Retro Athletic",
      description: "Evokes the nostalgia of American college basketball courts, finished with distressed leather panels, retro numbers, and a distressed star.",
      details: ["Hand-treated distressed crackled leather", "Contrast colored suede star and back tab", "Retro style lettering on heel", "Handmade in Venice, Italy"],
      minPrice: 22000, maxPrice: 32000, category: "Luxury High-End", isLuxury: true
    },
    {
      name: "Dad-Star Chunky Runner",
      description: "The luxury interpretation of the classic dad sneaker, incorporating heavily distressed silver overlays, yellowed midsoles, and mesh panels.",
      details: ["Laminated silver leather overlays", "Heavily distressed and yellowed rubber midsole", "Sandwich athletic retro mesh panels", "GGDB star branding on sides"],
      minPrice: 25000, maxPrice: 35000, category: "Luxury High-End", isLuxury: true
    }
  ],
  'Lanvin': [
    {
      name: "Curb Skate Sneaker",
      description: "An extraordinary skate shoe inspired by the bold proportions of 1990s skate gear, featuring ultra-thick zigzag embroidered laces and padded leather.",
      details: ["Imposing 90s silhouette with padded tongue", "Oversized, woven herringbone zigzag laces", "Premium calfskin, suede and mesh mix", "Molded flat rubber skate outsole"],
      minPrice: 24000, maxPrice: 36000, category: "Luxury High-End", isLuxury: true
    },
    {
      name: "Leather DBB Trainer",
      description: "A clean, luxury minimalist trainer representing the pinnacle of Lanvin's sleek elegance, finished with a contrast patent leather toe cap.",
      details: ["Selected fine calfskin leather base", "Signature patent leather toe cap overlay", "Soft leather lining with cushioned footbed", "Embossed Lanvin crest on heel"],
      minPrice: 22000, maxPrice: 28000, category: "Luxury High-End", isLuxury: true
    },
    {
      name: "Bumpr Vintage Runner",
      description: "An exceptionally lightweight retro running shoe, crafted in technical nylon and suede with an architectural split-heel foam sole.",
      details: ["Technical nylon fabric and suede overlays", "Architectural split-heel foam midsole", "JL logo contrast patch on side", "Very light: 210g weight comfort"],
      minPrice: 25000, maxPrice: 32000, category: "Luxury High-End", isLuxury: true
    }
  ],
  'Common Projects': [
    {
      name: "Original Achilles Low",
      description: "The legendary sneaker that redefined modern minimalist luxury. Handcrafted in Italy with clean sleek lines and stamped with gold foil numbers.",
      details: ["100% Ultra-smooth Italian calfskin leather", "Stamped with signature gold foil serial numbers", "Stitched durable Margom rubber cupsole", "Made in Italy by master shoemakers"],
      minPrice: 18000, maxPrice: 26000, category: "Luxury High-End", isLuxury: true
    },
    {
      name: "Retro Low Leather",
      description: "A gorgeous retro court sneaker boasting subtle contrast heel tabs, off-white vintage-tone rubber outsoles, and the iconic serial number stamp.",
      details: ["Fine smooth calfskin with contrast heel tab", "Gold foil serial numbers on heel side", "Handcrafted Margom vintage off-white cupsole", "OrthoLite® premium comfort leather lining"],
      minPrice: 20000, maxPrice: 28000, category: "Luxury High-End", isLuxury: true
    },
    {
      name: "Tournament High-Top",
      description: "A stunning minimalist high-top lace-up sneaker constructed with premium heavy-grain pebbled leather and gold foil serial details.",
      details: ["Heavy-grain premium pebbled calf leather", "Stitched Margom rubber cupsole", "Gold foil serial numbers on heel side", "Flat wax-coated cotton laces"],
      minPrice: 22000, maxPrice: 30000, category: "Luxury High-End", isLuxury: true
    }
  ]
};

// Generative engine to create exactly 108 products (18 brands * 6 products per brand)
const generateProducts = (): Product[] => {
  const list: Product[] = [];
  let imageIndex = 0;

  LUXURY_BRANDS.forEach((brand) => {
    const templates = BRAND_ARCHETYPES[brand] || BRAND_ARCHETYPES['Nike'];
    
    templates.forEach((tpl, tplIdx) => {
      // Create 2 unique color variants for each of the 3 templates per brand
      const variants = [
        { suffix: " 'Triple Sail'", colorIndex: 1, discount: 0, isNew: true },
        { suffix: " 'Midnight Stealth'", colorIndex: 0, discount: 15, isNew: false }
      ];

      variants.forEach((v, vIdx) => {
        const prodId = `mvq-sneaker-${brand.toLowerCase().replace(/\s/g, '-')}-${tplIdx}-${vIdx}`;
        
        // Dynamic but stable price generations
        const originalPrice = Math.round((tpl.minPrice + (tpl.maxPrice - tpl.minPrice) * (vIdx === 0 ? 0.3 : 0.8)) / 100) * 100;
        const discount = v.discount;
        const salePrice = discount > 0 ? Math.round((originalPrice * (1 - discount / 100)) / 100) * 100 : originalPrice;
        
        const mainImage = UNSPLASH_IMAGES[imageIndex % UNSPLASH_IMAGES.length];
        imageIndex++;
        
        const gallery = [
          mainImage,
          UNSPLASH_IMAGES[(imageIndex + 1) % UNSPLASH_IMAGES.length],
          UNSPLASH_IMAGES[(imageIndex + 3) % UNSPLASH_IMAGES.length]
        ];

        // Size allocations
        const sizeGrid = ['40', '41', '42', '43', '44', '45'];

        // Color allocation
        const primaryColor = COLORS[v.colorIndex % COLORS.length];
        const secondaryColor = COLORS[(v.colorIndex + 3) % COLORS.length];

        // Mock comments
        const reviews: Review[] = [
          {
            id: `${prodId}-rev-1`,
            author: "Sherif K.",
            rating: 5,
            date: "June 24, 2026",
            comment: `Absolutely spectacular! These ${brand} sneakers are 100% authentic. The delivery to Cairo Giza was super fast and came in pristine black double packaging. Will buy again!`
          },
          {
            id: `${prodId}-rev-2`,
            author: "Nadine Y.",
            rating: 4.8,
            date: "May 15, 2026",
            comment: `Top quality materials. Fits extremely well. Very comfy and definitely a statement luxury piece in my sneaker collection.`
          }
        ];

        const rating = parseFloat((4.5 + Math.random() * 0.5).toFixed(1));
        const reviewsCount = Math.floor(10 + Math.random() * 80);

        list.push({
          id: prodId,
          brand: brand,
          name: `${tpl.name}${v.suffix}`,
          image: mainImage,
          gallery: gallery,
          originalPrice: originalPrice,
          salePrice: salePrice,
          discount: discount,
          category: tpl.category, // e.g. "Retro Classics", "Luxury High-End", etc.
          sizes: sizeGrid,
          colors: [primaryColor, secondaryColor],
          description: tpl.description,
          details: tpl.details,
          rating: rating,
          reviewsCount: reviewsCount,
          reviews: reviews,
          isNew: v.isNew,
          isBestSeller: tplIdx === 0 && vIdx === 0,
          isLuxury: tpl.isLuxury || false
        });
      });
    });
  });

  return list;
};

export const PRODUCTS: Product[] = generateProducts();
