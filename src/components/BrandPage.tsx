import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, FilterState } from '../types';
import ProductCard from './ProductCard';
import { useI18n } from '../lib/i18n';
// @ts-ignore
import mascotSheet from '../assets/images/moviq_mascot_sheet_15pose_1784494483953.jpg';
import { 
  ChevronRight, 
  Home, 
  SlidersHorizontal, 
  RotateCcw, 
  ChevronDown, 
  Check, 
  Sparkles, 
  Star, 
  TrendingUp, 
  Award, 
  Clock, 
  BookOpen, 
  Compass, 
  Eye, 
  ArrowRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { SIZES, COLORS, CATEGORIES } from '../data/products';

interface BrandDetails {
  id: string;
  name: string;
  logo: string;
  banner: string;
  headline: string;
  arabicHeadline?: string;
  description: string;
  arabicDescription?: string;
  history: string;
  arabicHistory?: string;
  philosophy: string;
  arabicPhilosophy?: string;
  gallery: string[];
}

const BRAND_METADATA: Record<string, BrandDetails> = {
  nike: {
    id: 'nike',
    name: 'Nike',
    logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80',
    headline: 'Move Faster. Live Better.',
    arabicHeadline: 'تحرك أسرع. عِش أفضل.',
    description: 'Pushing the boundaries of performance and style. Nike has redefined athletic footwear through ground-breaking innovation and timeless design across decades of culture.',
    arabicDescription: 'ندفع حدود الأداء والأناقة. أعادت نايكي تعريف الأحذية الرياضية من خلال الابتكارات الرائدة والتصاميم الخالدة عبر عقود من الثقافة.',
    history: 'Founded in 1964 as Blue Ribbon Sports by Bill Bowerman and Phil Knight, the brand officially became Nike Inc. in 1971. Its journey began with a simple waffle iron running sole, evolving into the world\'s most dominant force in sports, lifestyle, and global streetwear culture.',
    arabicHistory: 'تأسست في عام 1964 كشركة بلو ريبون سبورتس بواسطة بيل باورمان وفيل نايت، وأصبحت رسميًا شركة نايكي في عام 1971. بدأت رحلتها بنعل حذاء جري بسيط مصنوع يدويًا، لتتطور إلى القوة الأكثر هيمنة في العالم في مجال الرياضة والموضة وثقافة الشارع العالمية.',
    philosophy: 'To bring inspiration and innovation to every athlete in the world. Nike believes that if you have a body, you are an athlete, shaping apparel and footwear to redefine human potential.',
    arabicPhilosophy: 'جلب الإلهام والابتكار لكل رياضي في العالم. تؤمن نايكي أنه إذا كان لديك جسد، فأنت رياضي، مما يشكل الملابس والأحذية لإعادة تعريف الإمكانات البشرية الكامنة.',
    gallery: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80'
    ]
  },
  jordan: {
    id: 'jordan',
    name: 'Jordan',
    logo: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=1600&q=80',
    headline: 'Fly High. Rule the Court.',
    arabicHeadline: 'حلّق عاليًا. تسيد الملعب.',
    description: 'High-top royalty and ultimate court legacy. The Jordan brand represents the pinnacle of basketball heritage, retro cultural status, and high-performance design.',
    arabicDescription: 'ملوكية التصميم وإرث الملاعب المطلق. تمثل علامة جوردان قمة تراث كرة السلة، والمكانة الثقافية الكلاسيكية، والتصميم عالي الأداء.',
    history: 'Launched in 1984 exclusively for Hall of Famer Michael Jordan during his rookie season with the Chicago Bulls, the Air Jordan line transcended the court to build an independent brand empire in 1997, fusing athletic excellence with raw street credibility.',
    arabicHistory: 'أُطلقت في عام 1984 حصريًا للأسطورة مايكل جوردان خلال موسمه الأول مع شيكاغو بولز، وتجاوزت تشكيلة إير جوردان حدود الملعب لتبني إمبراطورية تجارية مستقلة في عام 1997، تدمج بين التميز الرياضي ومصداقية ثقافة الشارع.',
    philosophy: 'Defying gravity both on and off the court. Jordan inspires greatness through premium craftsmanship, legendary retros, and cutting-edge performance basketball systems designed for game-changers.',
    arabicPhilosophy: 'تحدي الجاذبية داخل الملعب وخارجه. تلهم جوردان العظمة من خلال الحرفية المتميزة، والإصدارات الكلاسيكية الأسطورية، وأنظمة كرة السلة عالية الأداء المصممة لصناع التغيير.',
    gallery: [
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&q=80',
      'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=600&q=80',
      'https://images.unsplash.com/photo-1508150148166-ac5acdfa88c7?w=600&q=80',
      'https://images.unsplash.com/photo-1518002171953-a080ee81be41?w=600&q=80'
    ]
  },
  adidas: {
    id: 'adidas',
    name: 'Adidas',
    logo: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1600&q=80',
    headline: 'Impossible Is Nothing.',
    arabicHeadline: 'لا شيء مستحيل.',
    description: 'Classics perfected with authentic athletic heritage. Embracing premium craftsmanship and archival aesthetics, Adidas delivers comfort, precision, and unmistakable subculture icons.',
    arabicDescription: 'كلاسيكيات متقنة مع تراث رياضي أصيل. تحتضن أديداس الحرفية الفاخرة والجماليات الأرشيفية لتوفير الراحة والدقة وأيقونات الثقافة الفريدة.',
    history: 'Originating in Germany by Adolf \'Adi\' Dassler in 1949, Adidas established its status on soccer pitches and track lanes. It became a global lifestyle phenomenon through historic musical alignments, most notably Run-D.M.C. and the growth of Adidas Originals.',
    arabicHistory: 'بدأت في ألمانيا على يد أدولف "أدي" داسلر في عام 1949، ورسخت أديداس مكانتها في ملاعب كرة القدم ومضامير الجري. أصبحت ظاهرة أسلوب حياة عالمية من خلال شراكات موسيقية تاريخية، أبرزها مع فرقة Run-D.M.C ونمو قسم أديداس أوريجينالز.',
    philosophy: 'Through sport, we have the power to change lives. Blending functional German engineering with subcultural prestige to support creators who challenge traditional athletic conventions.',
    arabicPhilosophy: 'من خلال الرياضة، لدينا القدرة على تغيير الحياة. نمزج الهندسة الألمانية الوظيفية مع الهيبة الثقافية لدعم المبدعين الذين يتحدون الاتفاقيات الرياضية التقليدية.',
    gallery: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80',
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&q=80',
      'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&q=80',
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&q=80'
    ]
  },
  'new-balance': {
    id: 'new-balance',
    name: 'New Balance',
    logo: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=1600&q=80',
    headline: 'Worn by Supermodels and Dads.',
    arabicHeadline: 'يرتديه عارضو الأزياء والآباء على حد سواء.',
    description: 'The standard of modern craftsmanship and premium comfort. Merging retro technical runners with premium pigskin suede, New Balance embodies effortless refinement and athletic heritage.',
    arabicDescription: 'معيار الحرفية الحديثة والراحة الفائقة. يدمج نيو بالانس بين أحذية الجري التقنية الكلاسيكية والجلد السويدي الفاخر ليمثل الأناقة الرياضية البسيطة والراقية.',
    history: 'Founded in Boston in 1906 as the New Balance Arch Support Company, the brand focused on orthopedic products before releasing its first running shoe, the Trackster, in 1960. Today, its \'Made in USA/UK\' lines represent the absolute peak of sneaker craftsmanship.',
    arabicHistory: 'تأسست في بوسطن عام 1906 كشركة نيو بالانس لدعم قوس القدم، وركزت العلامة التجارية على المنتجات التقويمية قبل إطلاق أول حذاء جري لها، تراكستر، عام 1960. اليوم، تمثل خطوط إنتاجها في أمريكا وبريطانيا القمة المطلقة لحرفية الأحذية الرياضية.',
    philosophy: 'Independent since 1906. Choosing function and quality over loud marketing, creating balanced footwear with advanced cushioning systems and meticulous material premium selections.',
    arabicPhilosophy: 'مستقلون منذ عام 1906. نختار الوظيفة والجودة على التسويق الصاخب، ونصنع أحذية متوازنة مع أنظمة توسيد متقدمة واختيارات دقيقة للمواد الممتازة.',
    gallery: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80',
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
      'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&q=80'
    ]
  },
  balenciaga: {
    id: 'balenciaga',
    name: 'Balenciaga',
    logo: 'https://images.unsplash.com/photo-1534330207526-8e81f10ec6fc?w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1534330207526-8e81f10ec6fc?w=1600&q=80',
    headline: 'Avant-Garde. Redefined Couture.',
    arabicHeadline: 'طليعية متفردة. إعادة تعريف الهوت كوتور.',
    description: 'Architectural rebellion and luxury avant-garde. Balenciaga challenges conventional sneaker silhouettes through bold, oversized shapes, multi-layered mesh, and high-fashion proportions.',
    arabicDescription: 'تمرد معماري وطليعية فاخرة. تتحدى بالنسياغا أشكال الأحذية الرياضية التقليدية من خلال أشكال جريئة ضخمة، وشبكات متعددة الطبقات، وتفاصيل الأزياء الراقية.',
    history: 'Established in Spain in 1919 by legendary couturier Cristóbal Balenciaga, who was hailed as \'the master of us all\' by Christian Dior. Under contemporary visionaries, the house has pioneered luxury streetwear, creating high-concept runway footwear icons like the Triple S.',
    arabicHistory: 'تأسست في إسبانيا عام 1919 على يد مصمم الأزياء الأسطوري كريستوبال بالنسياغا، الذي أشاد به كريستيان ديور بوصفه "سيدنا جميعًا". وتحت رعاية المبدعين المعاصرين، رادت الدار ملابس الشارع الفاخرة، وخلقت أيقونات أحذية مدرج الطيران عالية المفهوم مثل تريبل إس.',
    philosophy: 'Radical architectural volume and structural subversion. Balenciaga merges high-fashion conceptual art with urban street utility, treating footwear as physical sculpture.',
    arabicPhilosophy: 'حجم معماري راديكالي وتخريب هيكلي جريء. تدمج بالنسياغا المفهوم الفني للأزياء الراقية مع فائدة الشارع الحضرية، وتتعامل مع الأحذية كمنحوتات مادية ملموسة.',
    gallery: [
      'https://images.unsplash.com/photo-1534330207526-8e81f10ec6fc?w=600&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&q=80',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80'
    ]
  },
  dior: {
    id: 'dior',
    name: 'Dior',
    logo: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=1600&q=80',
    headline: 'Pure Atelier Excellence.',
    arabicHeadline: 'تميز الأتيليه الخالص.',
    description: 'Atelier haute couture meets premium streetwear. Handcrafted in Italy with luxurious leather, Dior reimagines performance running and vintage court style under pure haute couture standards.',
    arabicDescription: 'أزياء الأتيليه الراقية تلتقي مع أسلوب الشارع الممتاز. صُنعت يدويًا في إيطاليا من الجلد الفاخر، وتُعيد ديور تصور أحذية الجري والملاعب الكلاسيكية وفقًا لأرقى معايير الهوت كوتور.',
    history: 'Founded in Paris in 1946 by Christian Dior, who introduced the revolutionary \'New Look\' to global fashion. Today, the Dior Men division merges historic Parisian elegance with high-tier streetwear collaborations, creating some of the most sought-after collector pieces on earth.',
    arabicHistory: 'تأسست في باريس عام 1946 على يد كريستيان ديور، الذي قدم "المظهر الجديد" الثوري للأزياء العالمية. اليوم، يدمج قسم ديور للرجال الأناقة الباريسية التاريخية مع تعاونات الشارع الراقية لإنتاج قطع تجميعية مرغوبة للغاية.',
    philosophy: 'Preserving flawless French heritage while embracing contemporary youth culture. Every pair of Dior sneakers is crafted in specialized Italian workshops, marrying hand-sewn luxury with modern street style.',
    arabicPhilosophy: 'الحفاظ على الإرث الفرنسي الخالي من العيوب مع احتضان ثقافة الشباب المعاصرة. يتم تصنيع كل زوج من أحذية ديور الرياضية في ورش عمل إيطالية متخصصة، ليتزوج الترف المخيط يدويًا بأسلوب الشارع الحديث.',
    gallery: [
      'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&q=80',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80'
    ]
  },
  asics: {
    id: 'asics',
    name: 'Asics',
    logo: 'https://images.unsplash.com/photo-1626379616459-b2ce1d9decbc?w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1626379616459-b2ce1d9decbc?w=1600&q=80',
    headline: 'Sound Mind, Sound Body.',
    arabicHeadline: 'عقل سليم في جسم سليم.',
    description: 'Japanese technical innovation and unmatched support. Asics delivers retro running silhouettes combined with modern Gel cushioning for the ultimate hybrid of performance and urban aesthetic.',
    arabicDescription: 'الابتكار التقني الياباني والدعم غير المسبوق. تقدم أسيكس صور ظلية جريئة للجري الكلاسيكي جنبًا إلى جنب مع توسيد هلام حديث لتوفير الهجين النهائي بين الأداء والجماليات الحضرية.',
    history: 'Formed in Kobe, Japan in 1949 by Kihachiro Onitsuka under the name Onitsuka Co., the brand became ASICS in 1977. Its long history is filled with iconic high-mileage running innovations and a dedicated dedication to biomechanical science.',
    arabicHistory: 'تأسست في كوبي باليابان عام 1949 على يد كيهاتشيرو أونيتسوكا تحت اسم شركة أونيتسوكا، وأصبحت العلامة التجارية أسيكس في عام 1977. تاريخها الطويل مليء بابتكارات الجري الشهيرة لمسافات طويلة وتفاني مخصص لعلوم الميكانيكا الحيوية.',
    philosophy: 'Anima Sana In Corpore Sano — A Sound Mind in a Sound Body. Crafting shoes with precision Gel-technology that offer incredible structural comfort while promoting holistic physical wellness.',
    arabicPhilosophy: 'الروح السليمة في الجسد السليم. صياغة أحذية مع تقنية الجل الدقيقة التي توفر راحة هيكلية مذهلة مع تعزيز العافية البدنية الشاملة.',
    gallery: [
      'https://images.unsplash.com/photo-1626379616459-b2ce1d9decbc?w=600&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80'
    ]
  },
  vans: {
    id: 'vans',
    name: 'Vans',
    logo: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1600&q=80',
    headline: 'Off The Wall Since 1966.',
    arabicHeadline: 'متمردون وخارج الصندوق منذ عام 1966.',
    description: 'Raw skate culture and California heritage. Vans offers the legendary waffle-sole sneakers that defined generations of skateboarders, artists, and alternative music cultures.',
    arabicDescription: 'ثقافة التزلج الخام والتراث الكاليفورني العريق. تقدم فانس أحذية رياضية بنعل وافل الأسطوري الذي حدد أجيالاً من المتزلجين والفنانين وثقافات الموسيقى البديلة.',
    history: 'Opened in Anaheim, California in 1966 by Paul Van Doren, the Van Doren Rubber Company manufactured shoes on-premises and sold them directly to the public. Skateboarders immediately adopted the sticky waffle sole, transforming Vans into an permanent symbol of youth counter-culture.',
    arabicHistory: 'افتتحت في أناهايم بكاليفورنيا عام 1966 على يد بول فان دورين، وصنعت شركة فان دورين للمطاط الأحذية في مبانيها وباعتها مباشرة للجمهور. تبنى المتزلجون على الفور نعل الوافل اللزج، مما حول فانس إلى رمز دائم للثقافة المضادة للشباب.',
    philosophy: 'Enabling creative self-expression in youth culture. Embracing simple canvas designs, vulcanized rubber constructions, and a bold attitude that welcomes active creators of all disciplines.',
    arabicPhilosophy: 'تمكين التعبير الإبداعي عن الذات في ثقافة الشباب. احتضان تصاميم القماش البسيطة، وهياكل المطاط المفلكن، وموقف جريء يرحب بالمبدعين النشطين من جميع التخصصات.',
    gallery: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80',
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&q=80',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80'
    ]
  },
  puma: {
    id: 'puma',
    name: 'Puma',
    logo: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1600&q=80',
    headline: 'Forever Faster.',
    arabicHeadline: 'أسرع للأبد.',
    description: 'Sleek motorsport speed and athletic power. Puma merges performance sports with lifestyle aesthetics, delivering classic retros and highly technical designs that stand out in any crowd.',
    arabicDescription: 'سرعة رياضة السيارات الأنيقة والقوة الرياضية الكبيرة. تدمج بوما بين الرياضات عالية الأداء والجماليات العصرية، وتقدم إصدارات كلاسيكية وتصميمات تقنية ممتازة.',
    history: 'Established in 1948 by Rudolf Dassler in Herzogenaurach, Germany, following a split from his brother Adi (founder of Adidas). Puma went on to create legendary athletic milestones, from Usain Bolt\'s record-shattering gold runs to classic tennis courts.',
    arabicHistory: 'تأسست في عام 1948 من قبل رودولف داسلر في هرتسوغن آوراخ بألمانيا، بعد انقسام من شقيقه عدي (مؤسس أديداس). واصلت بوما خلق معالم رياضية أسطورية، من جولات يوسين بولت الذهبية المحطمة للأرقام القياسية إلى ملاعب التنس الكلاسيكية.',
    philosophy: 'To be the fastest sports brand in the world. Driving forward with bravery, confidence, and determination, Puma shapes product lines that marry speed, comfort, and bold street expressions.',
    arabicPhilosophy: 'أن نكون أسرع علامة تجارية رياضية في العالم. من خلال المضي قدمًا بشجاعة وثقة وتصميم، تصمم بوما خطوط إنتاج تتزوج فيها السرعة بالراحة وتعبيرات الشارع الجريئة.',
    gallery: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
      'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&q=80',
      'https://images.unsplash.com/photo-1626379616459-b2ce1d9decbc?w=600&q=80'
    ]
  },
  converse: {
    id: 'converse',
    name: 'Converse',
    logo: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1600&q=80',
    headline: 'The Classic Canvas Shield.',
    arabicHeadline: 'درع القماش الكلاسيكي الخالد.',
    description: 'The original court sneaker that conquered music and style. From basketball beginnings to rock-and-roll stages, Converse represents the ultimate democratic canvas for personal style.',
    arabicDescription: 'الحذاء الرياضي الأصلي للملاعب الذي غزا الموسيقى والأناقة. من بدايات كرة السلة إلى مسارح الروك أند رول، تمثل كونفرس لوحة قماشية ديمقراطية مثالية للأسلوب الشخصي الفريد.',
    history: 'Started in Malden, Massachusetts in 1908 by Marquis Mills Converse, the brand introduced the All Star basketball shoe in 1917. Endorsed by player Chuck Taylor in 1921, the silhouette transitioned into the ultimate canvas sneaker of rock, punk, grunge, and hip-hop history.',
    arabicHistory: 'بدأت في مالدن بماساتشوستس عام 1908 على يد ماركيز ميلز كونفرس، وقدمت العلامة التجارية حذاء كرة السلة أول ستار عام 1917. ومع اعتماد اللاعب تشاك تايلور له عام 1921، انتقل التصميم ليصبح الحذاء القماشي المطلق في تاريخ الروك والبانك والجرونج والهيب هوب.',
    philosophy: 'Created on the court, adopted by culture. Offering minimalist canvas shoes that act as a blank canvas for individuals, enabling authentic self-expression through decades of classic design.',
    arabicPhilosophy: 'صُنع في الملعب، وتبنته الثقافة. نقدم أحذية قماشية بسيطة تعمل كقماش فارغ للأفراد، مما يتيح التعبير الحقيقي عن الذات عبر عقود من التصميم الكلاسيكي البسيط.',
    gallery: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80',
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&q=80',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80'
    ]
  }
};

const getBrandMetadata = (brandId: string): BrandDetails => {
  const normalizedId = brandId.toLowerCase().replace(/\s+/g, '-');
  if (BRAND_METADATA[normalizedId]) {
    return BRAND_METADATA[normalizedId];
  }
  
  const displayName = brandId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    id: normalizedId,
    name: displayName,
    logo: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1600&q=80',
    headline: 'Unparalleled Quality & Legacy.',
    arabicHeadline: 'جودة وإرث لا مثيل لهما.',
    description: `Exceptional luxury footwear curated from the house of ${displayName}. Explore our authenticated hand-delivered inventory designed for elite lifestyle collectors.`,
    arabicDescription: `أحذية رياضية فاخرة ومختارة بعناية من دار ${displayName}. اكتشف مجموعتنا المعتمدة والمسلّمة يدويًا والمصممة خصيصًا لعشاق النخبة.`,
    history: `The story of ${displayName} is built on dedication to quality and athletic expression. For years, the brand has remained at the vanguard of materials research, supporting icons and collectors worldwide.`,
    arabicHistory: `قصة ${displayName} مبنية على التفاني في الجودة والتعبير الرياضي الفريد. لسنوات عديدة، بقيت العلامة التجارية في طليعة أبحاث المواد، ودعم الرموز والمجمعين في جميع أنحاء العالم.`,
    philosophy: 'To treat footwear as high art. Combining structural support with the world\'s finest materials to deliver timeless design codes that outlast temporary industry trends.',
    arabicPhilosophy: 'التعامل مع الأحذية كفن راقٍ. الجمع بين الدعم الهيكلي وأجود المواد في العالم لتقديم رموز تصميم خالدة تدوم أكثر من اتجاهات الصناعة المؤقتة.',
    gallery: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80',
      'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&q=80'
    ]
  };
};

const getMascotSpritePosition = (state: string) => {
  switch (state) {
    case 'idle':
      return '0% 0%';          // 01 - Idle
    case 'welcome':
      return '25% 0%';         // 02 - Welcome
    case 'pointing':
      return '50% 0%';         // 03 - Pointing
    case 'thinking':
      return '75% 0%';         // 04 - Thinking
    case 'celebration':
      return '100% 0%';        // 05 - Celebration
    default:
      return '25% 0%';         // Default to welcome
  }
};

interface BrandPageProps {
  brandId: string;
  products: Product[];
  wishlist: string[];
  onWishlistToggle: (id: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
  onNavigateTo: (path: string) => void;
}

export default function BrandPage({
  brandId,
  products,
  wishlist,
  onWishlistToggle,
  onQuickView,
  onAddToCart,
  onNavigateTo
}: BrandPageProps) {
  const { t, lang } = useI18n();
  const isArabic = lang === 'ar';

  const brandDetails = useMemo(() => getBrandMetadata(brandId), [brandId]);

  const [showIntro, setShowIntro] = useState(false);
  const [mascotMessage, setMascotMessage] = useState("");

  // Trigger intro animation when brandId changes, only if not visited yet
  useEffect(() => {
    try {
      const visited = localStorage.getItem(`moviq_visited_brand_${brandId}`);
      if (!visited) {
        const messages = [
          `Welcome to the ${brandDetails.name} Collection.`,
          "Explore our latest arrivals.",
          "Best sellers are waiting for you."
        ];
        const chosenMessage = messages[Math.floor(Math.random() * messages.length)];
        setMascotMessage(chosenMessage);
        setShowIntro(true);

        const timer = setTimeout(() => {
          setShowIntro(false);
          try {
            localStorage.setItem(`moviq_visited_brand_${brandId}`, 'true');
          } catch (err) {}
        }, 2200);

        return () => clearTimeout(timer);
      } else {
        setShowIntro(false);
      }
    } catch (e) {
      setShowIntro(false);
    }
  }, [brandId, brandDetails.name]);

  // Brand-specific filter state
  const [filters, setFilters] = useState<FilterState>({
    brand: brandDetails.name,
    category: 'All Collections',
    size: '',
    color: '',
    priceRange: [0, 50000],
    searchQuery: '',
    sortBy: 'most-popular',
    gender: 'all',
    availability: 'all'
  });

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Synchronize filter when brand details change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      brand: brandDetails.name,
      category: 'All Collections',
      size: '',
      color: '',
      priceRange: [0, 50000],
      searchQuery: '',
      gender: 'all',
      availability: 'all',
      sortBy: 'most-popular'
    }));
    setCurrentPage(1);
  }, [brandDetails]);

  // Extract products belonging ONLY to this brand
  const brandProductsRaw = useMemo(() => {
    return products.filter(p => p.brand.toLowerCase() === brandDetails.name.toLowerCase());
  }, [products, brandDetails.name]);

  // Apply filters to brand products
  const filteredProducts = useMemo(() => {
    return brandProductsRaw.filter(p => {
      // Category Filter
      if (filters.category !== 'All Collections' && p.category !== filters.category) return false;
      
      // Size Filter
      if (filters.size && !p.sizes.includes(filters.size)) return false;
      
      // Color Filter
      if (filters.color && !p.colors.some(c => c.name === filters.color)) return false;
      
      // Price Filter
      if (p.salePrice < filters.priceRange[0] || p.salePrice > filters.priceRange[1]) return false;
      
      // Gender Filter
      if (filters.gender && filters.gender !== 'all') {
        const charCodeSum = p.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        if (filters.gender === 'men') {
          const isMen = charCodeSum % 2 === 0 || charCodeSum % 3 === 0;
          if (!isMen) return false;
        } else if (filters.gender === 'women') {
          const isWomen = charCodeSum % 2 !== 0 || charCodeSum % 5 === 0;
          if (!isWomen) return false;
        }
      }

      // Availability Filter
      if (filters.availability && filters.availability === 'in-stock') {
        const charCodeSum = p.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const inStock = charCodeSum % 9 !== 0;
        if (!inStock) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'bestselling':
          return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        case 'low-high':
          return a.salePrice - b.salePrice;
        case 'high-low':
          return b.salePrice - a.salePrice;
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'most-popular':
        case 'featured':
        default:
          return b.rating - a.rating;
      }
    });
  }, [brandProductsRaw, filters]);

  // Statistics calculation for SECTION 2
  const statistics = useMemo(() => {
    if (brandProductsRaw.length === 0) {
      return { total: 0, bestSellers: 0, newArrivals: 0, avgRating: 4.8 };
    }
    const total = brandProductsRaw.length;
    const bestSellers = brandProductsRaw.filter(p => p.isBestSeller || p.rating >= 4.7).length;
    const newArrivals = brandProductsRaw.filter(p => p.isNew).length;
    const sumRating = brandProductsRaw.reduce((sum, p) => sum + p.rating, 0);
    const avgRating = parseFloat((sumRating / total).toFixed(1));
    return { total, bestSellers, newArrivals, avgRating };
  }, [brandProductsRaw]);

  // Featured marquee product for SECTION 5
  const featuredProduct = useMemo(() => {
    if (brandProductsRaw.length === 0) return null;
    // Find highest rated best seller or just first sneaker
    const candidates = brandProductsRaw.filter(p => p.isBestSeller);
    if (candidates.length > 0) return candidates[0];
    return brandProductsRaw[0];
  }, [brandProductsRaw]);

  // Trending products for SECTION 6 (up to 3 products)
  const trendingProducts = useMemo(() => {
    if (brandProductsRaw.length === 0) return [];
    // Sort by rating desc
    const sorted = [...brandProductsRaw].sort((a, b) => b.rating - a.rating);
    return sorted.slice(0, 3);
  }, [brandProductsRaw]);

  // Customers Also Bought for SECTION 7 (4 products from other brands)
  const recommendations = useMemo(() => {
    const otherBrandsProducts = products.filter(p => p.brand.toLowerCase() !== brandDetails.name.toLowerCase());
    const sorted = [...otherBrandsProducts].sort((a, b) => b.rating - a.rating);
    return sorted.slice(0, 4);
  }, [products, brandDetails.name]);

  // Recently Viewed for SECTION 10 (stored locally, seeded with default luxury sneakers)
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('moviq_recently_viewed_sneakers');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as string[];
        if (parsed && parsed.length > 0) {
          setRecentlyViewedIds(parsed);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Seed with high end products initially so it's beautifully populated
    const seeds = products.slice(0, 4).map(p => p.id);
    localStorage.setItem('moviq_recently_viewed_sneakers', JSON.stringify(seeds));
    setRecentlyViewedIds(seeds);
  }, [products]);

  // Map product IDs to product objects for SECTION 10
  const recentlyViewedProducts = useMemo(() => {
    return recentlyViewedIds
      .map(id => products.find(p => p.id === id))
      .filter((p): p is Product => !!p)
      .slice(0, 4);
  }, [recentlyViewedIds, products]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(0, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const hasMore = paginatedProducts.length < filteredProducts.length;

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const hasActiveFilters =
    filters.category !== 'All Collections' ||
    filters.size !== '' ||
    filters.color !== '' ||
    filters.priceRange[1] < 50000 ||
    filters.gender !== 'all' ||
    filters.availability !== 'all';

  const handleResetFilters = () => {
    setFilters(prev => ({
      ...prev,
      category: 'All Collections',
      size: '',
      color: '',
      priceRange: [0, 50000],
      searchQuery: '',
      gender: 'all',
      availability: 'all',
      sortBy: 'most-popular'
    }));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen pb-24 text-white bg-[#030303]" id={`brand-boutique-view-${brandDetails.id}`}>
      
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-[#030303] flex flex-col items-center justify-center overflow-hidden"
            id="brand-luxury-intro-overlay"
          >
            {/* Soft, beautiful luxury ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_65%)] pointer-events-none" />

            {/* Skip Button in top-right */}
            <button
              onClick={() => {
                setShowIntro(false);
                try {
                  localStorage.setItem(`moviq_visited_brand_${brandId}`, 'true');
                } catch (e) {}
              }}
              className="absolute top-8 right-8 font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-500 hover:text-white transition-colors duration-300 pb-0.5 border-b border-neutral-900 hover:border-neutral-400 cursor-pointer flex items-center gap-1 z-50"
              id="skip-luxury-intro-btn"
            >
              Skip Intro &rarr;
            </button>

            {/* Center Container */}
            <div className="relative flex flex-col items-center max-w-lg px-6 text-center">
              
              {/* Brand Typography Header with Scale, Tracking & Fade */}
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-1"
              >
                <h1 className="font-serif text-5xl sm:text-7xl font-light tracking-[0.3em] uppercase text-white leading-none">
                  {brandDetails.name}
                </h1>
              </motion.div>

              {/* Just Arrived Accent Text */}
              <motion.p
                initial={{ opacity: 0, tracking: "0.15em" }}
                animate={{ opacity: 1, tracking: "0.3em" }}
                transition={{ delay: 0.4, duration: 1.0, ease: "easeOut" }}
                className="font-serif italic text-amber-500/90 text-sm sm:text-base uppercase mt-3"
              >
                "Just Arrived"
              </motion.p>

              {/* Divider */}
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "80px", opacity: 0.3 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="h-[1px] bg-amber-500 my-8" 
              />

              {/* Mascot welcome segment */}
              <div className="relative flex flex-col items-center mt-4">
                {/* MOVIQ Mascot representation */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", damping: 20, stiffness: 120 }}
                  className="relative w-24 h-24 bg-transparent flex items-center justify-center rounded-full"
                  style={{ perspective: 800 }}
                >
                  {/* Subtle soft glowing aura */}
                  <div className="absolute inset-2 bg-amber-500/10 blur-xl rounded-full -z-10" />

                  {/* Left Wing Accent */}
                  <svg
                    className="absolute right-[65%] top-[12%] w-[45%] h-[45%] pointer-events-none -z-10 overflow-visible"
                    viewBox="0 0 100 100"
                  >
                    <path
                      d="M 85,75 C 50,45 20,60 10,85 C 35,90 60,82 85,75 Z"
                      fill="url(#goldGradMascotIntro)"
                      stroke="#444"
                      strokeWidth="0.5"
                    />
                    <path
                      d="M 78,73 C 45,52 30,68 20,90 C 40,90 60,82 78,73 Z"
                      fill="url(#goldGradMascotIntro)"
                      opacity="0.8"
                    />
                  </svg>

                  {/* Right Wing Accent */}
                  <svg
                    className="absolute left-[65%] top-[12%] w-[45%] h-[45%] pointer-events-none -z-10 overflow-visible"
                    viewBox="0 0 100 100"
                  >
                    <path
                      d="M 15,75 C 50,45 80,60 90,85 C 65,90 40,82 15,75 Z"
                      fill="url(#goldGradMascotIntro)"
                      stroke="#444"
                      strokeWidth="0.5"
                    />
                    <path
                      d="M 22,73 C 55,52 70,68 80,90 C 60,90 40,82 22,73 Z"
                      fill="url(#goldGradMascotIntro)"
                      opacity="0.8"
                    />
                  </svg>

                  {/* Circle Masked Sprite */}
                  <div className="w-[88%] h-[88%] flex items-center justify-center relative overflow-hidden bg-black shadow-[0_8px_24px_rgba(0,0,0,0.6)] border border-neutral-800 rounded-full">
                    <div
                      className="absolute inset-0 bg-no-repeat rounded-full"
                      style={{
                        backgroundImage: `url(${mascotSheet})`,
                        backgroundSize: '500% 300%',
                        backgroundPosition: getMascotSpritePosition('welcome'),
                      }}
                    />
                  </div>
                </motion.div>

                {/* Speech Bubble */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1.1, type: "spring", damping: 18, stiffness: 150 }}
                  className="mt-6 bg-neutral-900/95 border border-amber-500/20 px-6 py-4 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] max-w-sm relative"
                  id="brand-intro-speech-bubble"
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-neutral-900 border-t border-l border-amber-500/20 rotate-45" />
                  <span className="text-amber-500 text-[9px] tracking-[0.2em] font-extrabold uppercase block mb-1">
                    MOVIQ Mascot
                  </span>
                  <p className="text-neutral-200 text-xs font-light leading-relaxed tracking-wide">
                    "{mascotMessage}"
                  </p>
                </motion.div>
              </div>

            </div>

            {/* SVG Gradients for Wings */}
            <svg className="absolute w-0 h-0 invisible" aria-hidden="true">
              <defs>
                <linearGradient id="goldGradMascotIntro" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="50%" stopColor="#F3E5AB" />
                  <stop offset="100%" stopColor="#AA7C11" />
                </linearGradient>
                <linearGradient id="silverGradMascotIntro" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="50%" stopColor="#E5E7EB" />
                  <stop offset="100%" stopColor="#9CA3AF" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 11: Breadcrumb Navigation (Placed elegantly at top bar) */}
      <div className="bg-neutral-950/60 border-b border-neutral-900 py-3.5 px-4 sm:px-6 lg:px-8 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold">
          <div className="flex items-center gap-2 text-neutral-400 select-none">
            <button
              onClick={() => onNavigateTo('/')}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Home size={12} className="text-amber-500/80" />
              <span>{t('Home')}</span>
            </button>
            <ChevronRight size={10} className="text-neutral-700" />
            <span className="text-neutral-500">{t('Brands')}</span>
            <ChevronRight size={10} className="text-neutral-700" />
            <span className="text-amber-500 font-black">{t(brandDetails.name)}</span>
          </div>
          <span className="text-[9px] text-neutral-600 bg-neutral-900 border border-neutral-800/80 px-2.5 py-1 rounded-full font-mono">
            {t('Luxury Boutique Experience')}
          </span>
        </div>
      </div>

      {/* SECTION 1: Large Hero Banner */}
      <div className="relative h-[480px] sm:h-[620px] w-full bg-neutral-950 border-b border-neutral-900 overflow-hidden flex items-center">
        {/* Parallax Background with Framer Motion */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.55 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={brandDetails.banner}
            alt={brandDetails.name}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        
        {/* Luxury Vignettes and Dark Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40" />
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-neutral-950/80 via-neutral-950/30 to-transparent pointer-events-none" />

        {/* Hero Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Headline and Descriptions */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Brand Logo & Tag Badge */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full border border-neutral-800 bg-neutral-950 flex items-center justify-center p-0.5 shadow-2xl">
                  <img
                    src={brandDetails.logo}
                    alt={`${brandDetails.name} Logo`}
                    className="w-full h-full object-cover rounded-full filter grayscale"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="h-8 w-[1px] bg-neutral-800" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500 font-extrabold flex items-center gap-1">
                  <Sparkles size={11} className="animate-pulse" />
                  {t('Authenticated Drop')}
                </span>
              </motion.div>

              {/* Brand Name */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h2 className="font-serif text-[18px] sm:text-[22px] text-neutral-400 uppercase tracking-[0.4em] leading-none mb-2">
                  {t('The House Of')}
                </h2>
                <h1 className="font-serif text-5xl sm:text-7xl lg:text-8.5xl font-black tracking-[0.12em] text-white uppercase leading-none select-all">
                  {t(brandDetails.name)}
                </h1>
              </motion.div>

              {/* Luxury Headline */}
              <motion.h3 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="font-serif text-2xl sm:text-4xl text-amber-500 font-light italic tracking-wider leading-tight"
              >
                {isArabic ? brandDetails.arabicHeadline : brandDetails.headline}
              </motion.h3>

              {/* Short premium description */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed tracking-wide max-w-2xl"
              >
                {isArabic ? brandDetails.arabicDescription : brandDetails.description}
              </motion.p>
            </div>
            
            {/* Right Column: Dynamic floating visual ornament */}
            <div className="hidden lg:flex lg:col-span-4 justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                className="relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-amber-500/10 rounded-3xl blur-3xl group-hover:bg-amber-500/20 transition-all duration-700" />
                <div className="relative border border-neutral-800/80 bg-neutral-900/60 p-5 rounded-3xl backdrop-blur-sm max-w-[280px] shadow-2xl transition-all duration-500 hover:border-neutral-700">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-950/80 mb-4 p-2 relative">
                    <img 
                      src={brandDetails.logo} 
                      alt="Brand Signature" 
                      className="w-full h-full object-contain filter grayscale group-hover:scale-110 transition-transform duration-700" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-bold block mb-1">{t('Moviq Registry')}</span>
                    <h4 className="font-serif text-sm tracking-widest font-bold text-white uppercase">{brandDetails.name} {t('Boutique')}</h4>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>

      {/* SECTION 2: Brand Statistics */}
      <div className="relative z-10 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-0.5 bg-neutral-900 border border-neutral-800/60 rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Stat 1: Total Products */}
          <div className="bg-neutral-950/90 p-6 sm:p-8 flex flex-col items-center text-center justify-center border-r border-neutral-900">
            <span className="text-amber-500/80 mb-2.5 block"><Award size={20} /></span>
            <span className="text-3xl sm:text-4.5xl font-mono font-black text-white leading-none tracking-tight block">
              {statistics.total}
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-bold mt-2 Block">
              {t('Creations Available')}
            </span>
          </div>

          {/* Stat 2: Best Sellers */}
          <div className="bg-neutral-950/90 p-6 sm:p-8 flex flex-col items-center text-center justify-center md:border-r border-neutral-900">
            <span className="text-amber-500/80 mb-2.5 block"><TrendingUp size={20} /></span>
            <span className="text-3xl sm:text-4.5xl font-mono font-black text-white leading-none tracking-tight block">
              {statistics.bestSellers}
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-bold mt-2 Block">
              {t('Best Sellers')}
            </span>
          </div>

          {/* Stat 3: New Arrivals */}
          <div className="bg-neutral-950/90 p-6 sm:p-8 flex flex-col items-center text-center justify-center border-r border-neutral-900">
            <span className="text-amber-500/80 mb-2.5 block"><Clock size={20} /></span>
            <span className="text-3xl sm:text-4.5xl font-mono font-black text-white leading-none tracking-tight block">
              {statistics.newArrivals}
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-bold mt-2 Block">
              {t('New Arrivals')}
            </span>
          </div>

          {/* Stat 4: Avg Rating */}
          <div className="bg-neutral-950/90 p-6 sm:p-8 flex flex-col items-center text-center justify-center">
            <span className="text-amber-500/80 mb-2.5 block"><Star size={20} fill="currentColor" /></span>
            <span className="text-3xl sm:text-4.5xl font-mono font-black text-white leading-none tracking-tight block">
              {statistics.avgRating.toFixed(1)}
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-bold mt-2 Block">
              {t('Average Rating')}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Main Boutique Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        
        {brandProductsRaw.length === 0 ? (
          /* "New products are coming soon." Showcase */
          <div className="text-center py-24 px-8 border border-neutral-900 rounded-3xl bg-neutral-900/10 space-y-6" id="empty-brand-coming-soon">
            <Sparkles className="w-10 h-10 text-amber-500 mx-auto animate-pulse" />
            <h3 className="font-serif text-3xl sm:text-4xl tracking-widest font-light text-white uppercase">
              {isArabic ? 'المنتجات الجديدة قريباً' : 'New products are coming soon.'}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-lg mx-auto leading-relaxed">
              {isArabic 
                ? 'مجموعتنا الجديدة الحصرية لـ هذه الماركة قادمة قريباً جداً في كولكشن الأتيليه الخاص بنا.' 
                : 'Our exclusive high-end pieces for this brand are currently being procured. Please stay tuned for our upcoming private drops.'}
            </p>
            <div className="pt-4">
              <button
                onClick={() => onNavigateTo('/')}
                className="bg-white hover:bg-neutral-200 text-black font-extrabold text-[10px] uppercase tracking-widest px-8 py-4 rounded-none transition-all duration-300 shadow-xl cursor-pointer"
              >
                {t('Return to Catalog')}
              </button>
            </div>
          </div>
        ) : (
          /* Full Luxury Boutique Layout */
          <div className="space-y-24">
            
            {/* SECTION 5: Featured Marquee Showcase */}
            {featuredProduct && (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
                className="relative border border-neutral-800 bg-gradient-to-br from-neutral-900/60 to-neutral-950/60 p-6 sm:p-12 rounded-3xl overflow-hidden shadow-2xl"
                id="featured-collection-section"
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-3xl rounded-full" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-neutral-500/5 blur-3xl rounded-full" />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
                  {/* Visual Left: Image Showcase with Hover Zoom */}
                  <div className="flex justify-center items-center h-80 sm:h-[400px] rounded-2xl bg-neutral-950/40 p-6 relative overflow-hidden group border border-neutral-800/50">
                    <img
                      src={featuredProduct.image}
                      alt={featuredProduct.name}
                      className="max-h-[85%] max-w-[85%] object-contain filter drop-shadow-[0_20px_45px_rgba(255,255,255,0.03)] transform scale-100 group-hover:scale-110 transition-transform duration-1000 ease-[0.16,1,0.3,1]"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-4 left-4 bg-amber-500 text-black text-[9px] tracking-[0.25em] font-black px-3.5 py-1.5 uppercase rounded-full shadow-md">
                      {t('Marquee Creation')}
                    </span>
                  </div>

                  {/* Right: Details & Call to Action */}
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500 font-extrabold block mb-2">
                        {t('Featured Collection')}
                      </span>
                      <h3 className="font-serif text-3xl sm:text-5xl text-white font-black uppercase tracking-wide leading-none">
                        {t(featuredProduct.name)}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center text-amber-500 gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < Math.floor(featuredProduct.rating) ? 'currentColor' : 'none'}
                            className="stroke-[1.5]"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-neutral-400 font-mono">
                        {featuredProduct.rating.toFixed(1)} / 5.0 Rating
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed tracking-wide">
                      {t('Indulge in authentic detailing and uncompromising luxury. Designed as a key milestone of the brand legacy, this sneaker represents the apex of lifestyle collection craftsmanship.')}
                    </p>

                    {/* Specifications List */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800/50">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-neutral-500 block">{t('Release Type')}</span>
                        <span className="text-xs text-white font-bold tracking-wider uppercase font-mono">{featuredProduct.isNew ? t('New Arrival') : t('Limited Drop')}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-neutral-500 block">{t('Heritage status')}</span>
                        <span className="text-xs text-white font-bold tracking-wider uppercase font-mono">{featuredProduct.isBestSeller ? t('Vault Icon') : t('Elite Lifestyle')}</span>
                      </div>
                    </div>

                    <div className="pt-6 flex flex-wrap items-center gap-4">
                      <div className="text-left">
                        <span className="text-[9px] uppercase tracking-widest text-neutral-500 block mb-1">{t('Exclusively At')}</span>
                        <span className="text-xl sm:text-2xl font-serif text-amber-500 font-black tracking-wide">
                          {featuredProduct.salePrice.toLocaleString()} {t('EGP')}
                        </span>
                      </div>
                      <button
                        onClick={() => onQuickView(featuredProduct)}
                        className="bg-white hover:bg-neutral-200 text-black font-extrabold text-[10px] uppercase tracking-[0.25em] py-4 px-8 rounded-none transition-all duration-300 shadow-xl cursor-pointer flex items-center gap-2"
                      >
                        <span>{t('Experience Details')}</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {/* SECTION 6: Trending Products with specific badges */}
            {trendingProducts.length > 0 && (
              <div className="space-y-8" id="trending-products-section">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500 font-extrabold block mb-2">
                      {t('The Current Hype')}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-4xl text-white font-medium uppercase tracking-widest">
                      {t('Trending Products')}
                    </h2>
                  </div>
                  <span className="text-xs text-neutral-500 tracking-wider">
                    {t('Live statistical inventory evaluation of highly covered silhouettes')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {trendingProducts.map((p, index) => {
                    // Custom Badges assigned respectively
                    let badgeLabel = '🔥 Trending';
                    let badgeStyle = 'bg-red-600/10 border-red-500 text-red-500';
                    if (index === 1) {
                      badgeLabel = '⭐ Best Seller';
                      badgeStyle = 'bg-amber-500/10 border-amber-500 text-amber-500';
                    } else if (index === 2) {
                      badgeLabel = '💎 Premium Pick';
                      badgeStyle = 'bg-cyan-500/10 border-cyan-500 text-cyan-500';
                    }

                    return (
                      <div key={p.id} className="space-y-4">
                        <div className={`border py-2 px-4 inline-flex items-center justify-center rounded-full text-[9px] uppercase tracking-[0.25em] font-extrabold ${badgeStyle}`}>
                          <span>{t(badgeLabel)}</span>
                        </div>
                        <ProductCard
                          product={p}
                          isWishlisted={wishlist.includes(p.id)}
                          onWishlistToggle={onWishlistToggle}
                          onQuickView={onQuickView}
                          onAddToCart={onAddToCart}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 3: Filters (Fully Refined Luxury Interface) */}
            <div className="bg-neutral-900/30 border-y border-neutral-800/80 py-8" id="brand-boutique-filters">
              <div className="space-y-6">
                
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-neutral-200 text-black text-xs uppercase tracking-[0.2em] font-black transition-all duration-300 rounded-none cursor-pointer"
                    >
                      <SlidersHorizontal size={14} />
                      <span>{isFiltersOpen ? t('Hide Filter Board') : t('Refine Creations')}</span>
                    </button>
                    <span className="text-xs text-neutral-400 font-medium tracking-wider font-mono">
                      {filteredProducts.length} / {brandProductsRaw.length} {t('Creations Shown')}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    {hasActiveFilters && (
                      <button
                        onClick={handleResetFilters}
                        className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white uppercase tracking-wider font-bold transition-colors cursor-pointer border-b border-dashed border-neutral-700 hover:border-white pb-0.5"
                      >
                        <RotateCcw size={12} />
                        <span>{t('Reset Filters')}</span>
                      </button>
                    )}

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold hidden sm:inline">
                        {t('Sort By:')}
                      </span>
                      <div className="relative">
                        <select
                          id="brand-sort-select"
                          value={filters.sortBy}
                          onChange={(e) => {
                            setFilters(prev => ({ ...prev, sortBy: e.target.value as any }));
                            setCurrentPage(1);
                          }}
                          className="bg-neutral-950 border border-neutral-800 text-white text-xs uppercase tracking-widest font-bold py-2.5 pl-4 pr-10 rounded-none outline-none cursor-pointer appearance-none focus:border-amber-500"
                        >
                          <option value="most-popular">{t('Most Popular')}</option>
                          <option value="newest">{t('Newest')}</option>
                          <option value="bestselling">{t('Best Selling')}</option>
                          <option value="low-high">{t('Price Low to High')}</option>
                          <option value="high-low">{t('Price High to Low')}</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dropdowns */}
                {isFiltersOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 pt-6 border-t border-neutral-800/60"
                  >
                    
                    {/* Collection Category Filter */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-500">{t('Collections')}</h4>
                      <div className="flex flex-col gap-1.5">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setFilters(prev => ({ ...prev, category: prev.category === cat ? 'All Collections' : cat }));
                              setCurrentPage(1);
                            }}
                            className={`text-left text-xs py-2 px-3 transition-colors flex items-center justify-between rounded-none cursor-pointer border ${
                              filters.category === cat 
                                ? 'bg-amber-500 text-black font-black border-amber-500' 
                                : 'text-neutral-400 bg-neutral-950/40 border-neutral-900 hover:text-white hover:border-neutral-800'
                            }`}
                          >
                            <span>{t(cat)}</span>
                            {filters.category === cat && <Check size={12} />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sizing Filter */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-500">{t('Sizes (EU)')}</h4>
                      <div className="grid grid-cols-3 gap-1.5">
                        {SIZES.map((sz) => (
                          <button
                            key={sz}
                            onClick={() => {
                              setFilters(prev => ({ ...prev, size: prev.size === sz ? '' : sz }));
                              setCurrentPage(1);
                            }}
                            className={`border text-xs py-2.5 text-center transition-all cursor-pointer font-bold rounded-none ${
                              filters.size === sz
                                ? 'bg-amber-500 border-amber-500 text-black font-black'
                                : 'bg-neutral-950/40 border-neutral-900 text-neutral-400 hover:border-neutral-700 hover:text-white'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Colors Filter */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-500">{t('Colors')}</h4>
                      <div className="flex flex-wrap gap-2.5">
                        {COLORS.map((col) => (
                          <button
                            key={col.name}
                            onClick={() => {
                              setFilters(prev => ({ ...prev, color: prev.color === col.name ? '' : col.name }));
                              setCurrentPage(1);
                            }}
                            title={t(col.name)}
                            style={{ backgroundColor: col.hex }}
                            className={`w-7.5 h-7.5 rounded-full border relative flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${
                              filters.color === col.name
                                ? 'border-amber-500 scale-105 ring-2 ring-amber-500 ring-offset-2 ring-offset-neutral-950'
                                : 'border-neutral-800'
                            }`}
                          >
                            {filters.color === col.name && (
                              <Check size={12} className={col.name === 'Pure White' || col.name === 'Sail Cream' ? 'text-black font-black' : 'text-white font-black'} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Gender Segment */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-500">{t('Gender')}</h4>
                      <div className="flex flex-col gap-1.5">
                        {[
                          { key: 'all', label: t('All Genders') },
                          { key: 'men', label: t('Men Only') },
                          { key: 'women', label: t('Women Only') }
                        ].map((g) => (
                          <button
                            key={g.key}
                            onClick={() => {
                              setFilters(prev => ({ ...prev, gender: g.key as any }));
                              setCurrentPage(1);
                            }}
                            className={`text-left text-xs py-2 px-3 transition-colors flex items-center justify-between rounded-none cursor-pointer border ${
                              filters.gender === g.key 
                                ? 'bg-amber-500 text-black font-black border-amber-500' 
                                : 'text-neutral-400 bg-neutral-950/40 border-neutral-900 hover:text-white hover:border-neutral-800'
                            }`}
                          >
                            <span>{g.label}</span>
                            {filters.gender === g.key && <Check size={12} />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Availability & Price */}
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-500">{t('Availability')}</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setFilters(prev => ({ ...prev, availability: prev.availability === 'in-stock' ? 'all' : 'in-stock' }));
                              setCurrentPage(1);
                            }}
                            className={`w-full border text-xs py-2.5 text-center transition-all cursor-pointer font-bold rounded-none ${
                              filters.availability === 'in-stock'
                                ? 'bg-amber-500 border-amber-500 text-black'
                                : 'bg-neutral-950/40 border-neutral-900 text-neutral-400 hover:border-neutral-800 hover:text-white'
                            }`}
                          >
                            {t('In Stock Only')}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-xs font-semibold text-neutral-400">
                          <span className="uppercase tracking-widest text-[9px] text-neutral-500 font-bold">{t('Max Price')}</span>
                          <span className="text-white font-bold font-mono">{filters.priceRange[1].toLocaleString()} {t('EGP')}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50000"
                          step="1000"
                          value={filters.priceRange[1]}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], val] }));
                            setCurrentPage(1);
                          }}
                          className="w-full accent-amber-500 cursor-pointer bg-neutral-900 h-1.5 rounded-lg appearance-none"
                        />
                      </div>
                    </div>

                  </motion.div>
                )}

              </div>
            </div>

            {/* SECTION 4: Product Grid */}
            <div className="space-y-8" id="boutique-products-grid">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-24 space-y-4 border border-neutral-900/60 rounded-3xl bg-neutral-900/10">
                  <span className="text-neutral-500 text-sm block font-light italic">
                    {t('No matching luxury creations discovered in our boutique inventory.')}
                  </span>
                  <button
                    onClick={handleResetFilters}
                    className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-bold text-[10px] uppercase tracking-widest px-8 py-3.5 rounded-none transition-colors cursor-pointer"
                  >
                    {t('Reset Search Filters')}
                  </button>
                </div>
              ) : (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                    <AnimatePresence mode="popLayout">
                      {paginatedProducts.map((p) => (
                        <motion.div
                          key={p.id}
                          layout
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <ProductCard
                            product={p}
                            isWishlisted={wishlist.includes(p.id)}
                            onWishlistToggle={onWishlistToggle}
                            onQuickView={onQuickView}
                            onAddToCart={onAddToCart}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Elegant Luxury Pagination / Load More Selector */}
                  {hasMore && (
                    <div className="flex flex-col items-center justify-center pt-8 border-t border-neutral-900/60 space-y-4">
                      <span className="text-[10px] tracking-widest uppercase font-bold text-neutral-500 font-mono">
                        {t('Displaying')} {paginatedProducts.length} {t('of')} {filteredProducts.length} {t('creations')}
                      </span>
                      <button
                        onClick={handleLoadMore}
                        className="group relative bg-white hover:bg-neutral-200 text-black font-extrabold text-[10px] uppercase tracking-[0.25em] py-4 px-10 rounded-none transition-all duration-300 shadow-xl cursor-pointer hover:tracking-[0.28em] flex items-center gap-2"
                      >
                        <span>{t('Load More')}</span>
                        <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* SECTION 7: Customers Also Bought (Recommended related sneakers from other brands) */}
            {recommendations.length > 0 && (
              <div className="space-y-8 pt-12 border-t border-neutral-900/80" id="customers-also-bought-section">
                <div>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500 font-extrabold block mb-2">
                    {t('Styling Complement')}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-4xl text-white font-medium uppercase tracking-widest">
                    {t('Customers Also Bought')}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {recommendations.map((p) => (
                    <div key={p.id}>
                      <ProductCard
                        product={p}
                        isWishlisted={wishlist.includes(p.id)}
                        onWishlistToggle={onWishlistToggle}
                        onQuickView={onQuickView}
                        onAddToCart={onAddToCart}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 8: About The Brand */}
            <div className="relative pt-16 border-t border-neutral-900/80" id="about-brand-section">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* Left: Giant Brand Monogram / Minimal Typography Art */}
                <div className="lg:col-span-4 flex justify-center lg:justify-start">
                  <div className="relative border border-neutral-800/80 bg-neutral-950/80 p-8 sm:p-12 rounded-3xl text-center lg:text-left shadow-xl w-full">
                    <span className="text-8xl sm:text-9.5xl font-serif text-neutral-800/30 leading-none select-none font-bold block">
                      {brandDetails.name.charAt(0)}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-amber-500 font-light mt-4 leading-relaxed">
                      {t('A Legacy of Purity & Performance')}
                    </h3>
                    <div className="h-[2px] w-12 bg-amber-500/80 mt-6 mx-auto lg:mx-0" />
                  </div>
                </div>

                {/* Right: History & Design philosophy details */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5 text-neutral-400">
                      <Clock size={16} className="text-amber-500/85" />
                      <h4 className="text-xs uppercase tracking-[0.25em] font-black">{t('Historical Narrative')}</h4>
                    </div>
                    <p className="text-xs sm:text-[13px] text-neutral-300 font-light leading-relaxed tracking-wide">
                      <span className="text-3xl text-white font-serif float-left mr-2 font-black leading-none">{isArabic ? '' : brandDetails.history.charAt(0)}</span>
                      {isArabic ? brandDetails.arabicHistory : brandDetails.history.slice(1)}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5 text-neutral-400">
                      <Compass size={16} className="text-amber-500/85" />
                      <h4 className="text-xs uppercase tracking-[0.25em] font-black">{t('Design Philosophy')}</h4>
                    </div>
                    <p className="text-xs sm:text-[13px] text-neutral-300 font-light leading-relaxed tracking-wide">
                      {isArabic ? brandDetails.arabicPhilosophy : brandDetails.philosophy}
                    </p>
                    <div className="bg-neutral-950/40 p-4 border border-neutral-900 rounded-xl flex items-center gap-3">
                      <ShieldCheck size={16} className="text-amber-500 shrink-0" />
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 leading-snug">
                        {t('Every product checked, cataloged, and hand-authenticated prior to dispatch.')}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* SECTION 9: Brand Gallery */}
            <div className="space-y-8 pt-12 border-t border-neutral-900/80" id="brand-gallery-section">
              <div>
                <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500 font-extrabold block mb-2">
                  {t('Lifestyle & Aesthetic')}
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl text-white font-medium uppercase tracking-widest">
                  {t('Brand Gallery')}
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {brandDetails.gallery.map((imgSrc, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02, rotate: i % 2 === 0 ? 0.5 : -0.5 }}
                    className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800/80 group cursor-pointer shadow-lg"
                  >
                    <img
                      src={imgSrc}
                      alt={`${brandDetails.name} Gallery ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-90 group-hover:brightness-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-neutral-950/40 opacity-100 group-hover:opacity-0 transition-opacity duration-500" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* SECTION 10: Recently Viewed */}
            {recentlyViewedProducts.length > 0 && (
              <div className="space-y-8 pt-12 border-t border-neutral-900/80" id="recently-viewed-section">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500 font-extrabold block mb-2">
                      {t('Your Browsing History')}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-4xl text-white font-medium uppercase tracking-widest">
                      {t('Recently Viewed')}
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {recentlyViewedProducts.map((p) => (
                    <div key={p.id}>
                      <ProductCard
                        product={p}
                        isWishlisted={wishlist.includes(p.id)}
                        onWishlistToggle={onWishlistToggle}
                        onQuickView={(pTarget) => {
                          // Append to recently viewed IDs array reactively
                          setRecentlyViewedIds(prev => {
                            const updated = [pTarget.id, ...prev.filter(id => id !== pTarget.id)].slice(0, 8);
                            localStorage.setItem('moviq_recently_viewed_sneakers', JSON.stringify(updated));
                            return updated;
                          });
                          onQuickView(pTarget);
                        }}
                        onAddToCart={onAddToCart}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
