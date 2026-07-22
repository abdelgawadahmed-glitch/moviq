import React, { useState } from 'react';
import { useI18n } from '../lib/i18n';

interface HeroProps {
  activeTab?: string;
  selectedBrand?: string;
  onScrollToCatalog?: () => void;
  onSelectBrand?: (brand: string) => void;
}

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  fallbackUrl?: string;
}

const BRANDS: BrandItem[] = [
  {
    id: 'nike',
    name: 'Nike',
    slug: 'nike',
    logoUrl: 'https://cdn.simpleicons.org/nike/000000',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg'
  },
  {
    id: 'adidas',
    name: 'Adidas',
    slug: 'adidas',
    logoUrl: 'https://cdn.simpleicons.org/adidas/000000',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg'
  },
  {
    id: 'new-balance',
    name: 'New Balance',
    slug: 'new-balance',
    logoUrl: 'https://cdn.simpleicons.org/newbalance/000000',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/New_Balance_logo.svg'
  },
  {
    id: 'asics',
    name: 'ASICS',
    slug: 'asics',
    logoUrl: 'https://cdn.simpleicons.org/asics/000000',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Asics_Logo.svg'
  },
  {
    id: 'puma',
    name: 'Puma',
    slug: 'puma',
    logoUrl: 'https://cdn.simpleicons.org/puma/000000',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Puma_Logo.svg'
  },
  {
    id: 'converse',
    name: 'Converse',
    slug: 'converse',
    logoUrl: 'https://cdn.simpleicons.org/converse/000000',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Converse_logo.svg'
  },
  {
    id: 'vans',
    name: 'Vans',
    slug: 'vans',
    logoUrl: 'https://cdn.simpleicons.org/vans/000000',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Vans-logo.svg'
  },
  {
    id: 'salomon',
    name: 'Salomon',
    slug: 'salomon',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Salomon_logo.svg'
  },
  {
    id: 'under-armour',
    name: 'Under Armour',
    slug: 'under-armour',
    logoUrl: 'https://cdn.simpleicons.org/underarmour/000000',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Under_armour_logo.svg'
  },
  {
    id: 'hoka',
    name: 'HOKA',
    slug: 'hoka',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Hoka_One_One_logo.svg'
  },
  {
    id: 'on',
    name: 'On Running',
    slug: 'on',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/On_running_logo.svg'
  },
  {
    id: 'jordan',
    name: 'Jordan',
    slug: 'jordan',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/3/37/Jumpman_logo.svg'
  },
  {
    id: 'crocs',
    name: 'Crocs',
    slug: 'crocs',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Crocs_logo.svg'
  },
  {
    id: 'skechers',
    name: 'Skechers',
    slug: 'skechers',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Skechers_logo.svg'
  },
  {
    id: 'timberland',
    name: 'Timberland',
    slug: 'timberland',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Timberland_logo.svg'
  },
  {
    id: 'reebok',
    name: 'Reebok',
    slug: 'reebok',
    logoUrl: 'https://cdn.simpleicons.org/reebok/000000',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Reebok_2019_logo.svg'
  },
  {
    id: 'mizuno',
    name: 'Mizuno',
    slug: 'mizuno',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Mizuno_logo.svg'
  }
];

function BrandLogoDisplay({ brand }: { brand: BrandItem }) {
  const [imgState, setImgState] = useState<'primary' | 'fallback' | 'text'>(
    brand.logoUrl ? 'primary' : 'text'
  );

  if (imgState === 'text' || (imgState === 'primary' && !brand.logoUrl) || (imgState === 'fallback' && !brand.fallbackUrl)) {
    return (
      <span className="font-serif font-extrabold tracking-[0.25em] text-[14px] sm:text-[17px] text-neutral-900 group-hover:text-[#C9A227] transition-colors duration-300 uppercase whitespace-nowrap select-none">
        {brand.name}
      </span>
    );
  }

  const currentSrc = imgState === 'primary' ? brand.logoUrl : brand.fallbackUrl;

  return (
    <img
      src={currentSrc}
      alt={`${brand.name} official logo`}
      className="h-6 sm:h-7 w-auto max-w-[110px] object-contain filter [filter:brightness(0)] group-hover:[filter:invert(68%)_sepia(53%)_saturate(620%)_hue-rotate(6deg)_brightness(92%)_contrast(88%)] transition-all duration-300 pointer-events-none"
      onError={() => {
        if (imgState === 'primary' && brand.fallbackUrl) {
          setImgState('fallback');
        } else {
          setImgState('text');
        }
      }}
      loading="eager"
    />
  );
}

export default function Hero({ onSelectBrand }: HeroProps) {
  const { t } = useI18n();

  // Alternate brands between top and bottom rows
  const topBrandsList = BRANDS.filter((_, idx) => idx % 2 === 0);
  const bottomBrandsList = BRANDS.filter((_, idx) => idx % 2 !== 0);

  // Duplicate each row array 3 times for a seamless infinite loop with zero jump
  const topMarqueeItems = [...topBrandsList, ...topBrandsList, ...topBrandsList];
  const bottomMarqueeItems = [...bottomBrandsList, ...bottomBrandsList, ...bottomBrandsList];

  const handleBrandClick = (brandName: string, slug: string) => {
    if (onSelectBrand) {
      onSelectBrand(brandName);
    } else {
      window.history.pushState({}, '', `/brands/${slug}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div
      className="relative w-full bg-white text-neutral-900 border-b border-neutral-200/80 select-none py-12 sm:py-16 overflow-hidden"
      id="hero-banner"
    >
      {/* Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8 sm:mb-12">
        <span className="text-[11px] sm:text-[12px] tracking-[0.35em] font-extrabold text-[#C9A227] uppercase block mb-2.5">
          {t("MOVIQ ATELIER • CURATED HOUSES")}
        </span>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-black uppercase">
          {t("Explore Official Brands")}
        </h1>
        <p className="text-neutral-500 text-xs sm:text-sm tracking-widest uppercase font-medium mt-2.5 max-w-xl mx-auto">
          {t("Authentic Footwear from the World's Premier Sneaker Ateliers")}
        </p>
      </div>

      {/* Dual-Layer Infinite Marquee Container */}
      <div className="relative w-full space-y-3 sm:space-y-4">
        {/* Left & Right Soft Fade Gradients */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-48 z-10 bg-gradient-to-r from-white via-white/80 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-48 z-10 bg-gradient-to-l from-white via-white/80 to-transparent" />

        {/* Top Row: Scrolls Left */}
        <div className="marquee-row-top relative w-full overflow-hidden py-1">
          <div className="marquee-track-left flex items-center">
            {topMarqueeItems.map((brand, idx) => (
              <button
                key={`top-${brand.id}-${idx}`}
                onClick={() => handleBrandClick(brand.name, brand.slug)}
                className="group relative flex flex-col items-center justify-center min-w-[150px] sm:min-w-[190px] px-6 sm:px-8 py-5 cursor-pointer opacity-75 hover:opacity-100 transition-all duration-300 transform hover:scale-[1.08] select-none focus:outline-none"
                id={`brand-showcase-top-${brand.id}-${idx}`}
              >
                {/* Official Brand Logo or Premium Text Logo */}
                <div className="h-9 sm:h-11 flex items-center justify-center mb-2.5">
                  <BrandLogoDisplay brand={brand} />
                </div>

                {/* Brand Name */}
                <span className="text-[12px] sm:text-[14px] font-semibold uppercase tracking-[0.18em] text-neutral-900 group-hover:text-black transition-colors duration-300 whitespace-nowrap">
                  {brand.name}
                </span>

                {/* Gold Underline */}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#C9A227] group-hover:w-12 transition-all duration-300 ease-out rounded-full shadow-[0_0_8px_rgba(201,162,39,0.5)]" />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Row: Scrolls Right */}
        <div className="marquee-row-bottom relative w-full overflow-hidden py-1">
          <div className="marquee-track-right flex items-center">
            {bottomMarqueeItems.map((brand, idx) => (
              <button
                key={`bottom-${brand.id}-${idx}`}
                onClick={() => handleBrandClick(brand.name, brand.slug)}
                className="group relative flex flex-col items-center justify-center min-w-[150px] sm:min-w-[190px] px-6 sm:px-8 py-5 cursor-pointer opacity-75 hover:opacity-100 transition-all duration-300 transform hover:scale-[1.08] select-none focus:outline-none"
                id={`brand-showcase-bottom-${brand.id}-${idx}`}
              >
                {/* Official Brand Logo or Premium Text Logo */}
                <div className="h-9 sm:h-11 flex items-center justify-center mb-2.5">
                  <BrandLogoDisplay brand={brand} />
                </div>

                {/* Brand Name */}
                <span className="text-[12px] sm:text-[14px] font-semibold uppercase tracking-[0.18em] text-neutral-900 group-hover:text-black transition-colors duration-300 whitespace-nowrap">
                  {brand.name}
                </span>

                {/* Gold Underline */}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#C9A227] group-hover:w-12 transition-all duration-300 ease-out rounded-full shadow-[0_0_8px_rgba(201,162,39,0.5)]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
