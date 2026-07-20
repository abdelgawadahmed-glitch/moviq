import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

// Comprehensive dictionary for both key-based and phrase-based translations.
// This ensures that ALL visible interface text is cleanly and professionally localized.
const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Nav Items
    'Home': 'Home',
    'Men': 'Men',
    'Women': 'Women',
    'Brands': 'Brands',
    'New Arrivals': 'New Arrivals',
    'Best Sellers': 'Best Sellers',
    'Sale': 'Sale',
    'Contact': 'Contact',
    
    // Filters & Sorting
    'Hide Filters': 'Hide Filters',
    'Show Filters': 'Show Filters',
    'Reset': 'Reset',
    'Sort By:': 'Sort By:',
    'Featured': 'Featured',
    'Newest': 'Newest',
    'Price Low to High': 'Price Low to High',
    'Price High to Low': 'Price High to Low',
    'All Collections': 'All Collections',
    'Retro Classics': 'Retro Classics',
    'Luxury High-End': 'Luxury High-End',
    'Performance Athletic': 'Performance Athletic',
    'Skate & Street': 'Skate & Street',
    'Status': 'Status',
    'All': 'All',
    'In Stock Only': 'In Stock Only',
    'Showing': 'Showing',
    'of': 'of',
    'sneakers': 'sneakers',
    'Sizes': 'Sizes',
    'Colors': 'Colors',
    'Price Range': 'Price Range',
    'Collections': 'Collections',

    // Colors
    'Noir Black': 'Noir Black',
    'Pure White': 'Pure White',
    'Wolf Grey': 'Wolf Grey',
    'Crimson Red': 'Crimson Red',
    'Varsity Blue': 'Varsity Blue',
    'Sail Cream': 'Sail Cream',
    'Forest Green': 'Forest Green',
    'Midnight Navy': 'Midnight Navy',

    // Product Details & Cards
    'Add to Bag': 'Add to Bag',
    'View Detail': 'View Detail',
    'Authenticity verified': 'Authenticity verified',
    'Description': 'Description',
    'Details': 'Details',
    'Reviews': 'Reviews',
    'Reviews Count': 'Reviews',
    'Out of Stock': 'Out of Stock',
    'Best Seller': 'Best Seller',
    'New': 'New',
    'OFF': 'OFF',
    'Luxury': 'Luxury',
    'Rating': 'Rating',
    'Physical Verification Tag': 'Physical Verification Tag',
    'Select Size': 'Select Size',
    'Select Color': 'Select Color',
    'Quantity': 'Quantity',
    'Add a Review': 'Add a Review',
    'Your Name': 'Your Name',
    'Your Rating': 'Your Rating',
    'Your Comment': 'Your Comment',
    'Submit Review': 'Submit Review',
    'Write a comment...': 'Write a comment...',

    // Drawer / Cart & Wishlist
    'Favorites': 'Favorites',
    'Shopping Bag': 'Shopping Bag',
    'Your Bag is Empty': 'Your Bag is Empty',
    'Your Wishlist is Empty': 'Your Wishlist is Empty',
    'Subtotal': 'Subtotal',
    'Shipping': 'Shipping',
    'Discount': 'Discount',
    'Total': 'Total',
    'Total EGP': 'Total EGP',
    'Proceed to Checkout': 'Proceed to Checkout',
    'Secure Checkout': 'Secure Checkout',
    'Free Shipping': 'Free Shipping',
    'Check out our luxury selection': 'Check out our luxury selection',
    'Promo Code': 'Promo Code',
    'Apply': 'Apply',
    'Enter coupon code': 'Enter coupon code',
    'Code applied!': 'Code applied!',
    'Invalid code': 'Invalid code',
    'Items': 'Items',
    'Remove': 'Remove',

    // Checkout
    'Order Summary': 'Order Summary',
    'Customer Information': 'Customer Information',
    'Full Name': 'Full Name',
    'Email Address': 'Email Address',
    'Phone Number': 'Phone Number',
    'Shipping Address': 'Shipping Address',
    'City': 'City',
    'Payment Method': 'Payment Method',
    'Cash on Delivery': 'Cash on Delivery',
    'Premium Hand-Delivery inside Egypt': 'Premium Hand-Delivery inside Egypt',
    'Place Order': 'Place Order',
    'Placing Order...': 'Placing Order...',
    'Thank you for your order': 'Thank you for your order',
    'Order ID': 'Order ID',
    'Order Success': 'Order Success',
    'All transactions are secured and encrypted.': 'All transactions are secured and encrypted.',
    'Go Back to Catalog': 'Go Back to Catalog',
    'Your order is being processed for premium hand-delivery.': 'Your order is being processed for premium hand-delivery.',
    
    // Loyalty & Footer
    'Join our elite circle for private drop allocations': 'Join our elite circle for private drop allocations',
    'Secure early access, private concierge consultations & seasonal allocations.': 'Secure early access, private concierge consultations & seasonal allocations.',
    'Enter your premium email': 'Enter your premium email',
    'Register': 'Register',
    'Thank you for joining the MOVIQ circle.': 'Thank you for joining the MOVIQ circle.',
    'All Rights Reserved.': 'All Rights Reserved.',
    'Bespoke procurement of 100% authentic luxury and retro sneakers. Hand-delivered under white-glove conditions across Egypt.': 'Bespoke procurement of 100% authentic luxury and retro sneakers. Hand-delivered under white-glove conditions across Egypt.',
    'Our Curated Fashion Houses': 'Our Curated Fashion Houses',
    'Luxury Announcement Bar': 'FREE SHIPPING ACROSS EGYPT | 100% AUTHENTIC | 30 DAYS RETURNS',
    'Atelier Concierge': 'Atelier Concierge',

    // Hero Quotes
    'Style is a way to say who you are without having to speak.': 'Style is a way to say who you are without having to speak.',
    'Design is not just what it looks like and feels like. Design is how it works.': 'Design is not just what it looks like and feels like. Design is how it works.',
    "We're always trying to create something that doesn't exist yet.": "We're always trying to create something that doesn't exist yet.",
    'Some people want it to happen, some wish it would happen, others make it happen.': 'Some people want it to happen, some wish it would happen, others make it happen.',
    'Simplicity is the ultimate sophistication.': 'Simplicity is the ultimate sophistication.',

    // Benefits Bar
    '100% Authentic Guarantee': '100% Authentic Guarantee',
    'Every pair physically verified by experts. Tagged for absolute security.': 'Every pair physically verified by experts. Tagged for absolute security.',
    'Free Shipping in Egypt': 'Free Shipping in Egypt',
    'Complimentary premium courier to Cairo, Alexandria, and all governorates.': 'Complimentary premium courier to Cairo, Alexandria, and all governorates.',
    '30-Day Luxury Returns': '30-Day Luxury Returns',
    'Hassle-free size exchanges and returns on unworn deadstock inventory.': 'Hassle-free size exchanges and returns on unworn deadstock inventory.',
    'Instant styling help and sizing consults via our responsive virtual guide.': 'Instant styling help and sizing consults via our responsive virtual guide.',

    // Admin & Loyalty Modals
    'Bespoke Customer Profile': 'Bespoke Customer Profile',
    'Loyalty Status': 'Loyalty Status',
    'VIP Black Card': 'VIP Black Card',
    'Loyalty Points': 'Loyalty Points',
    'Points': 'Points',
    'Spent Total': 'Spent Total',
    'EGP': 'EGP',
    'Purchased items': 'Purchased items',
    'No purchases recorded yet. Start shopping to earn VIP points!': 'No purchases recorded yet. Start shopping to earn VIP points!',
    'Close Profile': 'Close Profile',
    'Elite Member Allocation': 'Elite Member Allocation',
    'Active Allocation Account': 'Active Allocation Account',
    'Exclusive Markdown drops up to 30% off': 'Exclusive Markdown drops up to 30% off',
    'Luxury Footwear Redefined': 'Luxury Footwear Redefined',
    'Curated by MOVIQ Collectors': 'Curated by MOVIQ Collectors',
    'EXPLORE COLLECTION': 'EXPLORE COLLECTION',
    'SECURE AUTENTICITY': 'SECURE AUTENTICITY',
    'WHITE GLOVE DELIVERY': 'WHITE GLOVE DELIVERY',
    'Every pair hand-delivered inside Cairo & Giza': 'Every pair hand-delivered inside Cairo & Giza',
    '3D HOLOGRAM ACCREDITED': '3D HOLOGRAM ACCREDITED',
    'Tamper-proof MOVIQ visual verification': 'Tamper-proof MOVIQ visual verification',
    'GENUINE COMMERCE ONLY': 'GENUINE COMMERCE ONLY',
    'Direct brand source procurement guarantee': 'Direct brand source procurement guarantee',
    'Scroll to Explore Catalog': 'Scroll to Explore Catalog',
    'Search': 'Search',
    'No matching luxury sneakers found.': 'No matching luxury sneakers found.',
    'Live Matches': 'Live Matches',
    'Featured Grails': 'Featured Grails',
    'Suggestions': 'Suggestions',
    'Clear': 'Clear',
    'Filtering catalog by:': 'Filtering catalog by:',
    'Luxury Brands': 'Luxury Brands',
    'Contact Us': 'Contact Us',
    'Customer Service': 'Customer Service',
    'Address': 'Address',
    'Heliopolis, Cairo, Egypt': 'Heliopolis, Cairo, Egypt',
    'Phone': 'Phone',
    'Email': 'Email',
    'Secure SSL encrypted gateway': 'Secure SSL encrypted gateway',
    'Order Placed successfully!': 'Order Placed successfully!',
    'Error submitting': 'Error submitting',
    'All fields are required.': 'All fields are required.',
    'Review added successfully!': 'Review added successfully!',
    // Homepage Elements
    'Curated Fashion Houses': 'Curated Fashion Houses',
    'Featured Brands': 'Featured Brands',
    'Explore Atelier': 'Explore Atelier',
    'Browse House': 'Browse House',
    'The Latest Releases': 'The Latest Releases',
    'View Full Collection': 'View Full Collection',
    'The Most Coveted Grails': 'The Most Coveted Grails',
    'View All Bestsellers': 'View All Bestsellers',
    'Global Street Couture': 'Global Street Couture',
    'Trending This Week': 'Trending This Week',
    'Must Have': 'Must Have',
    'Acquire Now': 'Acquire Now',
    'Exclusive Egyptian Allocation': 'Exclusive Egyptian Allocation',
    'syndicate_pitch': 'Our procurement desk secures highly-coveted drops in absolute deadstock condition. Secure yours before allocations expire.',
    'View Collection': 'View Collection',
    'Atelier Couture Selection': 'Atelier Couture Selection',
    'Luxury Collection': 'Luxury Collection',
    'Explore High-End Pairs': 'Explore High-End Pairs',
    'Our Core Pillars': 'Our Core Pillars',
    'Why Choose MOVIQ': 'Why Choose MOVIQ',
    '100% Certified Verification': '100% Certified Verification',
    'Every single pair undergoes a rigorous multi-point physical verification audit by our expert authenticators prior to dispatch.': 'Every single pair undergoes a rigorous multi-point physical verification audit by our expert authenticators prior to dispatch.',
    'White-Glove Egyptian Delivery': 'White-Glove Egyptian Delivery',
    'Hand-delivered directly to your doorstep in Cairo, Giza, Alexandria, and all major Egyptian Governorates with premium security.': 'Hand-delivered directly to your doorstep in Cairo, Giza, Alexandria, and all major Egyptian Governorates with premium security.',
    'Encrypted Luxury Checkout': 'Encrypted Luxury Checkout',
    'State-of-the-art secure payment structures. Safe cash on delivery options or direct card handling for stress-free shopping.': 'State-of-the-art secure payment structures. Safe cash on delivery options or direct card handling for stress-free shopping.',
    'Bespoke Custom Packaging': 'Bespoke Custom Packaging',
    'Your sneakers are packaged inside customized archival box protectors, wrapped meticulously in soft luxury monogram tissue paper.': 'Your sneakers are packaged inside customized archival box protectors, wrapped meticulously in soft luxury monogram tissue paper.',
    'Client Testimonials': 'Client Testimonials',
    'Customer Reviews': 'Customer Reviews',
    'VERIFIED BUYER': 'VERIFIED BUYER',
    'Join The MOVIQ Syndicate': 'Join The MOVIQ Syndicate',
    'Newsletter': 'Newsletter',
    'Subscribe to unlock privileged allocations, private drop notifications, and luxury sneaker insights.': 'Subscribe to unlock privileged allocations, private drop notifications, and luxury sneaker insights.',
    'ENTER YOUR EMAIL FOR COUTURE ACCESS': 'ENTER YOUR EMAIL FOR COUTURE ACCESS',
    'Subscribe': 'Subscribe',
    'Privileged Access Granted': 'Privileged Access Granted',
    'A confirmation transmission has been sent. Welcome to the Syndicate.': 'A confirmation transmission has been sent. Welcome to the Syndicate.',
    // Curated brands tags
    'The Pinnacle of Innovation': 'The Pinnacle of Innovation',
    'High-Top Royalty': 'High-Top Royalty',
    'Classics Perfected': 'Classics Perfected',
    'The Grey Standard': 'The Grey Standard',
    'Architectural Rebellion': 'Architectural Rebellion',
    'High Couture Footwear': 'High Couture Footwear',
    // Reviewers and locations
    'Kareem El-Shafei': 'Kareem El-Shafei',
    'Yasmine Mansour': 'Yasmine Mansour',
    'Sherif Abdel-Nour': 'Sherif Abdel-Nour',
    'Zamalek, Cairo': 'Zamalek, Cairo',
    'New Cairo': 'New Cairo',
    'Gleem, Alexandria': 'Gleem, Alexandria',
    'review_1_quote': "MOVIQ has completely elevated the luxury shopping experience in Egypt. The Dior B22s I ordered were checked meticulously. Hand-delivered in absolute pristine condition with their verification tag.",
    'review_2_quote': "Absolute gold standard. Finding authentic high-end Jordans is a nightmare in Egypt, but MOVIQ's multi-step authentication process gives absolute peace of mind. Exceptional customer care.",
    'review_3_quote': "From the premium wrapping paper to the hand-delivered delivery box, the attention to detail is remarkable. Definitely my trusted atelier for sneakers.",
    'Dior B22 Trainer': 'Dior B22 Trainer',
    'Air Jordan 4 Retro Black': 'Air Jordan 4 Retro Black',
    'New Balance 990v6': 'New Balance 990v6',
    // Governorates
    'Cairo': 'Cairo',
    'Giza': 'Giza',
    'Alexandria': 'Alexandria',
    'Qalyubia': 'Qalyubia',
    'Dakahlia': 'Dakahlia',
    'Gharbia': 'Gharbia',
    'Monufia': 'Monufia',
    'Sharqia': 'Sharqia',
    'Beheira': 'Beheira',
    'Damietta': 'Damietta',
    'Port Said': 'Port Said',
    'Ismailia': 'Ismailia',
    'Suez': 'Suez',
    'Kafr El Sheikh': 'Kafr El Sheikh',
    'Fayoum': 'Fayoum',
    'Beni Suef': 'Beni Suef',
    'Minya': 'Minya',
    'Assiut': 'Assiut',
    'Sohag': 'Sohag',
    'Qena': 'Qena',
    'Luxor': 'Luxor',
    'Aswan': 'Aswan',
    'Red Sea': 'Red Sea',
    'New Valley': 'New Valley',
    'Matrouh': 'Matrouh',
    'North Sinai': 'North Sinai',
    'South Sinai': 'South Sinai',
    // Steps & Checkout
    '01. Shipping Information': '01. Shipping Information',
    '02. Luxury Payment': '02. Luxury Payment',
    '03. Confirmation': '03. Confirmation',
    'Secure Atelier Order': 'Secure Atelier Order',
    'Delivery Details': 'Delivery Details',
    'Recipient Name': 'Recipient Name',
    'Delivery Address': 'Delivery Address',
    'Governorate': 'Governorate',
    'ZIP Code': 'ZIP Code',
    'Proceed to Payment': 'Proceed to Payment',
    'Atelier Secure Payment': 'Atelier Secure Payment',
    'Select payment method': 'Select payment method',
    'Visa': 'Visa',
    'MasterCard': 'MasterCard',
    'Meeza': 'Meeza',
    'Cash On Delivery': 'Cash On Delivery',
    'Cardholder Name': 'Cardholder Name',
    'Card Number': 'Card Number',
    'Expiry Date': 'Expiry Date',
    'CVV': 'CVV',
    'Authorizing Secure Gateway...': 'Authorizing Secure Gateway...',
    'Atelier Order Confirmed': 'Atelier Order Confirmed',
    'Order Reference': 'Order Reference',
    'Tracking Status': 'Tracking Status',
    'Return to Catalog': 'Return to Catalog'
  },
  ar: {
    // Nav Items
    'Home': 'الرئيسية',
    'Men': 'رجالي',
    'Women': 'حريمي',
    'Brands': 'الماركات',
    'New Arrivals': 'وصل حديثاً',
    'Best Sellers': 'الأكثر مبيعاً',
    'Sale': 'تخفيضات',
    'Contact': 'اتصل بنا',
    
    // Filters & Sorting
    'Hide Filters': 'إخفاء الفلاتر',
    'Show Filters': 'إظهار الفلاتر',
    'Reset': 'إعادة ضبط',
    'Sort By:': 'ترتيب حسب:',
    'Featured': 'المميز',
    'Newest': 'الأحدث',
    'Price Low to High': 'السعر: من الأقل للأعلى',
    'Price High to Low': 'السعر: من الأعلى للأقل',
    'All Collections': 'كل المجموعات',
    'Retro Classics': 'كلاسيكيات ريترو',
    'Luxury High-End': 'أزياء فاخرة راقية',
    'Performance Athletic': 'رياضي عالي الأداء',
    'Skate & Street': 'سكيت وستريت',
    'Status': 'الحالة',
    'All': 'الكل',
    'In Stock Only': 'المتاح في المخزن فقط',
    'Showing': 'عرض',
    'of': 'من',
    'sneakers': 'كوتشي',
    'Sizes': 'المقاسات',
    'Colors': 'الألوان',
    'Price Range': 'نطاق السعر',
    'Collections': 'المجموعات',

    // Colors
    'Noir Black': 'أسود داكن',
    'Pure White': 'أبيض ناصع',
    'Wolf Grey': 'رمادي ولف',
    'Crimson Red': 'أحمر قرمزي',
    'Varsity Blue': 'أزرق فارستي',
    'Sail Cream': 'كريمي سيل',
    'Forest Green': 'أخضر الغابة',
    'Midnight Navy': 'كحلي داكن',

    // Product Details & Cards
    'Add to Bag': 'إضافة إلى الحقيبة',
    'View Detail': 'عرض التفاصيل',
    'Authenticity verified': 'الأصالة معتمدة',
    'Description': 'الوصف',
    'Details': 'التفاصيل',
    'Reviews': 'التقييمات',
    'Reviews Count': 'تقييمات',
    'Out of Stock': 'نفذ من المخزن',
    'Best Seller': 'الأكثر مبيعاً',
    'New': 'جديد',
    'OFF': 'خصم',
    'Luxury': 'فاخر',
    'Rating': 'التقييم',
    'Physical Verification Tag': 'تيكيت التحقق الفعلي',
    'Select Size': 'اختر المقاس',
    'Select Color': 'اختر اللون',
    'Quantity': 'الكمية',
    'Add a Review': 'إضافة تقييم',
    'Your Name': 'اسمك',
    'Your Rating': 'تقييمك',
    'Your Comment': 'تعليقك',
    'Submit Review': 'إرسال التقييم',
    'Write a comment...': 'اكتب تعليقك هنا...',

    // Drawer / Cart & Wishlist
    'Favorites': 'المفضلة',
    'Shopping Bag': 'حقيبة التسوق',
    'Your Bag is Empty': 'حقيبتك فارغة',
    'Your Wishlist is Empty': 'قائمة المفضلة فارغة',
    'Subtotal': 'المجموع الفرعي',
    'Shipping': 'الشحن',
    'Discount': 'الخصم',
    'Total': 'الإجمالي',
    'Total EGP': 'الإجمالي بالجنيه المصري',
    'Proceed to Checkout': 'الانتقال للدفع',
    'Secure Checkout': 'دفع آمن ومحمي',
    'Free Shipping': 'شحن مجاني',
    'Check out our luxury selection': 'تصفح تشكيلتنا الفاخرة',
    'Promo Code': 'كود الخصم',
    'Apply': 'تطبيق',
    'Enter coupon code': 'أدخل كود الخصم',
    'Code applied!': 'تم تطبيق الكود بنجاح!',
    'Invalid code': 'الكود غير صالح',
    'Items': 'المنتجات',
    'Remove': 'حذف',

    // Checkout
    'Order Summary': 'ملخص الطلب',
    'Customer Information': 'معلومات العميل',
    'Full Name': 'الاسم بالكامل',
    'Email Address': 'البريد الإلكتروني',
    'Phone Number': 'رقم الهاتف',
    'Shipping Address': 'عنوان الشحن',
    'City': 'المحافظة',
    'Payment Method': 'طريقة الدفع',
    'Cash on Delivery': 'الدفع عند الاستلام',
    'Premium Hand-Delivery inside Egypt': 'توصيل يدوياً فاخر داخل مصر',
    'Place Order': 'تأكيد الطلب',
    'Placing Order...': 'جاري تأكيد الطلب...',
    'Thank you for your order': 'شكراً لطلبك من موقعنا',
    'Order ID': 'رقم الطلب',
    'Order Success': 'تم تأكيد الطلب بنجاح',
    'All transactions are secured and encrypted.': 'جميع المعاملات آمنة ومفروسة بالكامل.',
    'Go Back to Catalog': 'العودة للكتالوج',
    'Your order is being processed for premium hand-delivery.': 'يتم الآن تجهيز طلبك للتوصيل اليدوي الفاخر.',
    
    // Loyalty & Footer
    'Join our elite circle for private drop allocations': 'انضم إلى دائرتنا النخبوية للحصول على إصدارات خاصة',
    'Secure early access, private concierge consultations & seasonal allocations.': 'اضمن الوصول المبكر، واستشارات المساعد الشخصي الخاصة والخصومات الموسمية.',
    'Enter your premium email': 'أدخل بريدك الإلكتروني الراقي',
    'Register': 'تسجيل',
    'Thank you for joining the MOVIQ circle.': 'شكراً للانضمام إلى عائلة MOVIQ.',
    'All Rights Reserved.': 'جميع الحقوق محفوظة.',
    'Bespoke procurement of 100% authentic luxury and retro sneakers. Hand-delivered under white-glove conditions across Egypt.': 'توفير مخصص لكوتشيات رياضية فاخرة وريترو أصلية 100%. توصيل يدوي ممتاز وبمنتهى العناية في جميع أنحاء مصر.',
    'Our Curated Fashion Houses': 'دور الأزياء الفاخرة المختارة',
    'Luxury Announcement Bar': 'شحن مجاني لجميع أنحاء مصر | أصلي 100% | استرجاع خلال 30 يوم',
    'Atelier Concierge': 'كونسيرج الأتيليه',

    // Hero Quotes
    'Style is a way to say who you are without having to speak.': 'الستايل هو طريقة لتقول من أنت دون أن تضطر للتحدث.',
    'Design is not just what it looks like and feels like. Design is how it works.': 'التصميم لا يقتصر فقط على المظهر والشعور. التصميم يكمن في كيفية عمله.',
    "We're always trying to create something that doesn't exist yet.": "نحاول دائمًا ابتكار شيء لم يكن موجودًا بعد.",
    'Some people want it to happen, some wish it would happen, others make it happen.': 'البعض يريد حدوثه، والبعض يتمنى حدوثه، والبعض الآخر يجعله يحدث فعلاً.',
    'Simplicity is the ultimate sophistication.': 'البساطة هي قمة الرقي والجمال الفني.',

    // Benefits Bar
    '100% Authentic Guarantee': 'ضمان أصلي 100%',
    'Every pair physically verified by experts. Tagged for absolute security.': 'كل كوتشي يتم فحصه فعليًا بواسطة خبراء. ومزود بتيكيت أمان كامل.',
    'Free Shipping in Egypt': 'شحن مجاني داخل مصر',
    'Complimentary premium courier to Cairo, Alexandria, and all governorates.': 'توصيل يدوياً ممتاز ومجاني للقاهرة والأسكندرية وجميع المحافظات.',
    '30-Day Luxury Returns': 'استرجاع فاخر خلال 30 يوم',
    'Hassle-free size exchanges and returns on unworn deadstock inventory.': 'استبدال واسترجاع المقاسات بكل سهولة للمنتجات غير المستخدمة بعبوتها الأصلية.',
    'Instant styling help and sizing consults via our responsive virtual guide.': 'مساعدة فورية في اختيار الموديلات والمقاسات عبر مساعدنا الافتراضي التفاعلي.',

    // Admin & Loyalty Modals
    'Bespoke Customer Profile': 'الملف الشخصي الفاخر للعميل',
    'Loyalty Status': 'حالة برنامج الولاء',
    'VIP Black Card': 'بطاقة كبار الشخصيات السوداء VIP',
    'Loyalty Points': 'نقاط الولاء الفاخرة',
    'Points': 'نقطة',
    'Spent Total': 'إجمالي المشتريات',
    'EGP': 'ج.م',
    'Purchased items': 'المنتجات المشتراة',
    'No purchases recorded yet. Start shopping to earn VIP points!': 'لا توجد مشتريات مسجلة حتى الآن. ابدأ التسوق لتجميع نقاط VIP!',
    'Close Profile': 'إغلاق الملف الشخصي',
    'Elite Member Allocation': 'إصدارات الأعضاء المميزين',
    'Active Allocation Account': 'حساب الإصدارات النشط',
    'Exclusive Markdown drops up to 30% off': 'تخفيضات حصرية مضافة تصل إلى 30%',
    'Luxury Footwear Redefined': 'إعادة تعريف مفهوم الأحذية الفاخرة',
    'Curated by MOVIQ Collectors': 'منسق بعناية بواسطة خبراء مقتني MOVIQ',
    'EXPLORE COLLECTION': 'استكشف المجموعة',
    'SECURE AUTENTICITY': 'ضمان الأصالة الفائقة',
    'WHITE GLOVE DELIVERY': 'شحن يدوي متميز وعناية فائقة',
    'Every pair hand-delivered inside Cairo & Giza': 'يتم توصيل كل زوج يدوياً داخل القاهرة والجيزة',
    '3D HOLOGRAM ACCREDITED': 'معتمد بملصق ثلاثي الأبعاد',
    'Tamper-proof MOVIQ visual verification': 'تحقق بصري مقاوم للتلاعب بالكامل من MOVIQ',
    'GENUINE COMMERCE ONLY': 'تجارة أصلية وحقيقية فقط',
    'Direct brand source procurement guarantee': 'ضمان الشراء المباشر والآمن من ماركته الرسمية',
    'Scroll to Explore Catalog': 'مرر لأسفل لاستكشاف الكتالوج',
    'Search': 'بحث',
    'No matching luxury sneakers found.': 'لم نعثر على كوتشيات فاخرة مطابقة لبحثك.',
    'Live Matches': 'نتائج سريعة مطابقة',
    'Featured Grails': 'أحذية رياضية تريند مميزة',
    'Suggestions': 'اقتراحات البحث',
    'Clear': 'مسح',
    'Filtering catalog by:': 'تصفية المنتجات حسب:',
    'Luxury Brands': 'ماركات فاخرة شهيرة',
    'Contact Us': 'اتصل بنا',
    'Customer Service': 'خدمة العملاء',
    'Address': 'العنوان',
    'Heliopolis, Cairo, Egypt': 'مصر الجديدة، القاهرة، مصر',
    'Phone': 'الهاتف',
    'Email': 'البريد الإلكتروني',
    'Secure SSL encrypted gateway': 'بوابة دفع آمنة مشفرة بالكامل SSL',
    'Order Placed successfully!': 'تم إرسال الطلب بنجاح ومؤمن بالكامل!',
    'Error submitting': 'خطأ أثناء الإرسال والتأكيد',
    'All fields are required.': 'جميع الحقول مطلوبة لتأكيد الشحن الفاخر.',
    'Review added successfully!': 'تمت إضافة تقييمك بنجاح ونشره!',
    // Homepage Elements
    'Curated Fashion Houses': 'دور أزياء منسقة بعناية',
    'Featured Brands': 'الماركات المميزة',
    'Explore Atelier': 'استكشف الأتيليه',
    'Browse House': 'تصفح الدار',
    'The Latest Releases': 'أحدث الإصدارات',
    'View Full Collection': 'عرض المجموعة الكاملة',
    'The Most Coveted Grails': 'أكثر الموديلات طلباً',
    'View All Bestsellers': 'عرض كل الأكثر مبيعاً',
    'Global Street Couture': 'أزياء الشارع العالمية الفاخرة',
    'Trending This Week': 'الأكثر رواجاً هذا الأسبوع',
    'Must Have': 'منتج لا بد منه',
    'Acquire Now': 'اقتنيه الآن',
    'Exclusive Egyptian Allocation': 'إصدارات مخصصة لمصر',
    'syndicate_pitch': 'يقوم مكتب المشتريات لدينا بتوفير الإصدارات النادرة والأكثر طلباً في حالة جديدة تماماً وغير مستعملة. اضمن مقاسك قبل نفاذ الكمية.',
    'View Collection': 'عرض المجموعة',
    'Atelier Couture Selection': 'مختارات الهوت كوتور للأتيليه',
    'Luxury Collection': 'المجموعة الفاخرة',
    'Explore High-End Pairs': 'استكشف الأزواج الراقية',
    'Our Core Pillars': 'ركائزنا الأساسية',
    'Why Choose MOVIQ': 'لماذا تختار MOVIQ',
    '100% Certified Verification': 'تحقق معتمد 100%',
    'Every single pair undergoes a rigorous multi-point physical verification audit by our expert authenticators prior to dispatch.': 'يخضع كل زوج من الأحذية لفحص مادي دقيق متعدد النقاط من قبل خبراء التحقق لدينا قبل الشحن.',
    'White-Glove Egyptian Delivery': 'توصيل يدوياً فاخر داخل مصر',
    'Hand-delivered directly to your doorstep in Cairo, Giza, Alexandria, and all major Egyptian Governorates with premium security.': 'توصيل يدوياً مباشرة إلى باب منزلك في القاهرة والجيزة والإسكندرية وجميع المحافظات الرئيسية بأمان تام.',
    'Encrypted Luxury Checkout': 'دفع إلكتروني فاخر مشفر',
    'State-of-the-art secure payment structures. Safe cash on delivery options or direct card handling for stress-free shopping.': 'أنظمة دفع آمنة على أعلى مستوى. خيارات دفع عند الاستلام آمنة أو معالجة مباشرة للبطاقة لتسوق مريح.',
    'Bespoke Custom Packaging': 'تغليف مخصص فاخر',
    'Your sneakers are packaged inside customized archival box protectors, wrapped meticulously in soft luxury monogram tissue paper.': 'يتم تغليف حذائك داخل واقيات علب أرشيفية مخصصة، ملفوفة بعناية في ورق حرير فاخر مطبوع بشعارنا.',
    'Client Testimonials': 'شهادات العملاء',
    'Customer Reviews': 'تقييمات العملاء',
    'VERIFIED BUYER': 'مشتري معتمد',
    'Join The MOVIQ Syndicate': 'انضم إلى نقابة MOVIQ',
    'Newsletter': 'النشرة الإخبارية',
    'Subscribe to unlock privileged allocations, private drop notifications, and luxury sneaker insights.': 'اشترك لفتح إصدارات مميزة وحصرية، وإشعارات الطرح الخاص، وأحدث أخبار الأحذية الرياضية الفاخرة.',
    'ENTER YOUR EMAIL FOR COUTURE ACCESS': 'أدخل بريدك الإلكتروني للحصول على دخول خاص',
    'Subscribe': 'اشتراك',
    'Privileged Access Granted': 'تم منح الوصول الخاص بنجاح',
    'A confirmation transmission has been sent. Welcome to the Syndicate.': 'تم إرسال رسالة التأكيد. مرحبًا بك في دائرتنا الخاصة.',
    // Curated brands tags
    'The Pinnacle of Innovation': 'ذروة الابتكار والتطوير',
    'High-Top Royalty': 'ملوك الهايتوب برقبة مرتفعة',
    'Classics Perfected': 'الكلاسيكيات المطورة بعناية',
    'The Grey Standard': 'المعيار الرمادي الفاخر',
    'Architectural Rebellion': 'التمرد والتفرد الهندسي الفاخر',
    'High Couture Footwear': 'أحذية الهوت كوتور الراقية',
    // Reviewers and locations
    'Kareem El-Shafei': 'كريم الشافعي',
    'Yasmine Mansour': 'ياسمين منصور',
    'Sherif Abdel-Nour': 'شريف عبد النور',
    'Zamalek, Cairo': 'الزمالك، القاهرة',
    'New Cairo': 'القاهرة الجديدة',
    'Gleem, Alexandria': 'جليم، الإسكندرية',
    'review_1_quote': 'لقد ارتقى MOVIQ تماماً بتجربة التسوق الفاخر في مصر. لقد تم فحص كوتشي ديور B22 الذي طلبته بدقة بالغة، وتم تسليمه يدوياً في حالة مثالية تماماً ومزوداً بتيكيت التحقق الخاص به.',
    'review_2_quote': 'المستوى الأعلى على الإطلاق. إن العثور على أحذية جوردان الأصلية الراقية هو كابوس في مصر، ولكن عملية التحقق متعددة الخطوات من MOVIQ تمنحك راحة البال التامة. خدمة عملاء استثنائية.',
    'review_3_quote': 'من ورق التغليف الفاخر إلى صندوق التوصيل اليدوي، فإن الاهتمام بالتفاصيل مذهل حقاً. بالتأكيد هو الأتيليه الموثوق لدي للأحذية الرياضية.',
    'Dior B22 Trainer': 'ديور B22 ترينر',
    'Air Jordan 4 Retro Black': 'اير جوردان 4 ريترو أسود',
    'New Balance 990v6': 'نيو بالانس 990v6',
    // Governorates
    'Cairo': 'القاهرة',
    'Giza': 'الجيزة',
    'Alexandria': 'الإسكندرية',
    'Qalyubia': 'القليوبية',
    'Dakahlia': 'الدقهلية',
    'Gharbia': 'الغربية',
    'Monufia': 'المنوفية',
    'Sharqia': 'الشرقية',
    'Beheira': 'البحيرة',
    'Damietta': 'دمياط',
    'Port Said': 'بور سعيد',
    'Ismailia': 'الإسماعيلية',
    'Suez': 'السويس',
    'Kafr El Sheikh': 'كفر الشيخ',
    'Fayoum': 'الفيوم',
    'Beni Suef': 'بني سويف',
    'Minya': 'المنيا',
    'Assiut': 'أسيوط',
    'Sohag': 'سوهاج',
    'Qena': 'قنا',
    'Luxor': 'الأقصر',
    'Aswan': 'أسوان',
    'Red Sea': 'البحر الأحمر',
    'New Valley': 'الوادي الجديد',
    'Matrouh': 'مطروح',
    'North Sinai': 'شمال سيناء',
    'South Sinai': 'جنوب سيناء',
    // Steps & Checkout
    '01. Shipping Information': '01. معلومات الشحن',
    '02. Luxury Payment': '02. الدفع الفاخر',
    '03. Confirmation': '03. تأكيد الطلب',
    'Secure Atelier Order': 'طلب آمن من الأتيليه الخاص بنا',
    'Delivery Details': 'تفاصيل التوصيل الشاملة',
    'Recipient Name': 'اسم المستلم بالكامل',
    'Delivery Address': 'عنوان التوصيل بالكامل',
    'Governorate': 'المحافظة',
    'ZIP Code': 'الرقم البريدي',
    'Proceed to Payment': 'الاستمرار لخيارات الدفع الآمنة',
    'Atelier Secure Payment': 'بوابة الدفع الآمنة للأتيليه',
    'Select payment method': 'اختر طريقة الدفع الفاخرة المناسبة لك',
    'Visa': 'فيزا كارد',
    'MasterCard': 'ماستر كارد',
    'Meeza': 'كارت ميزة المحلي',
    'Cash On Delivery': 'الدفع عند الاستلام (COD)',
    'Cardholder Name': 'اسم صاحب الكارت',
    'Card Number': 'رقم الكارت',
    'Expiry Date': 'تاريخ الانتهاء',
    'CVV': 'رمز الأمان (CVV)',
    'Authorizing Secure Gateway...': 'جاري التحقق الآمن مع البنك المصدر...',
    'Atelier Order Confirmed': 'تم تأكيد طلبك من الأتيليه بنجاح',
    'Order Reference': 'رقم مرجع الطلب',
    'Tracking Status': 'حالة تتبع الطلب',
    'Return to Catalog': 'العودة إلى كتالوج الأحذية الرياضية'
  }
};

// Helper dictionary for dynamically translating product information (such as description and details)
const DYNAMIC_TRANSLATIONS: Record<string, string> = {
  // Brand archetypes names
  "Dunk Low Retro": "دانك لو ريترو",
  "Air Force 1 '07 Premium": "اير فورس 1 ريترو بريميوم",
  "ZoomX Vaporfly 3": "زوم إكس فيبرفلاي 3",
  "Samba OG Leather": "سامبا أو جي جلد طبيعي",
  "Ultraboost Light": "ألترا بوست لايت الرياضي",
  "Gazelle Vintage": "غازيل كلاسيك فينتج",
  "990v6 Made in USA": "990 في 6 صناعة أمريكية فاخرة",
  "550 Court Classic": "550 كورت كلاسيك الأنيق",
  "1906R Protection Pack": "1906 أر بروتكشن باك الرياضي",
  "Suede Classic XXI": "سويد كلاسيك 21 الفاخر",
  "Palermo OG Leather": "باليرمو أو جي جلد شمواه طبيعي",
  "RS-X3 Extreme Runner": "آر إس إكس 3 إكستريم رانر",
  "GEL-NYC Retro Runner": "جيل إن واي سي ريترو الرياضي",
  "GEL-Kayano 30 Stability": "جيل كايانو 30 مريح وعالي الثبات",
  "GEL-1130 Classic": "جيل 1130 الكلاسيكي الحديث",
  "Chuck 70 Vintage High": "تشاك 70 فينتج هاي عالي الرقبة",
  "Run Star Hike Platform": "رن ستار هايك بلاتفورم الشهير",
  "Weapon Low Leather": "ويبن لو كورت جلد",
  "Old Skool Pro Classic": "أولد سكول برو كلاسيك لجميع الأوقات",
  "Classic Slip-On Checkerboard": "سليب أون الشطرنج الكلاسيكي السهل",
  "Sk8-Hi High-Top Pro": "إس كيه 8 هاي برقبة طويلة كلاسيك",
  "Air Jordan 1 Retro High OG": "اير جوردان 1 ريترو هاي برقبة عالية",
  "Air Jordan 4 Retro Premium": "اير جوردان 4 ريترو الفاخر الأسطوري",
  "Air Jordan 11 Retro Concord": "اير جوردان 11 ريترو كونكورد الفاخر",
  "Triple S Chunky Trainer": "تريبل إس تشاكي ترينر الضخم الفاخر",
  "Track.2 Tech Runner": "تراك 2 تيك رانر الرياضي العصري",
  "Speed Sock Trainer": "سبيد سوك ترينر الخفيف المريح",
  "Rockrunner Camo Trainer": "روكرانر كامو المزين بالنجوم والإكسسوارات",
  "One Stud Leather Trainer": "وان ستود جلد الإيطالي الفاخر",
  "Open Skate Sneaker": "أوبن سكيت جلد طبيعي فخم",
  "Oversized Leather Sneaker": "أوفرسايزد الكورت الأنيق",
  "Tread Slick Boot-Sneaker": "تريد سليك بوت سنيكر الأنيق المتين",
  "Sprint Runner Tech": "سبرينت رانر تيك العصري",
  "Ace Web Sneaker": "آيس ويب الأنيق بشريط جوتشي الشهير",
  "Rhyton Retro Trainer": "رايتون ريترو الضخم بجلد فاخر معالج",
  "Screener Vintage Trainer": "سكرينر فينتج بتفاصيل فينتج ريترو",
  "B23 High-Top Canvas": "بي 23 هاي توب المزين بشعار ديور",
  "B30 Athletic Runner": "بي 30 أثليتك رانر الرياضي الممتاز",
  "B27 Low-Top Calfskin": "بي 27 لو توب بجلد العجل الفاخر",
  "LV Trainer Calfskin": "إل في ترينر جلد طبيعي عالي الفخامة",
  "Run Away Monogram Runner": "رن أواي مونوغرام رانر العصري",
  "LV Skate Chunky Sneaker": "إل في سكيت تشاكي سنيكر الجريء الفخم",
  "Out Of Office 'OOO'": "أوت أوف أوفيس كورت الأنيق بلمسة أوف وايت",
  "Vulcanized Low Tag": "فولكنايزد لو المزين بعلامة الماركة",
  "Odsy-1000 Chunky Trainer": "أودسي 1000 المزين بأسنان التراك",
  "Super-Star Distressed": "سوبر ستار الكلاسيكي بلمسة الفينتج يدوياً",
  "Ball Star Retro Athletic": "بول ستار ريترو الرياضي الكلاسيكي",
  "Dad-Star Chunky Runner": "داد ستار تشاكي رانر المريح المتقن",
  "Curb Skate Sneaker": "كيرب سكيت ذو الأربطة العريضة الشهير",
  "Leather DBB Trainer": "دي بي بي جلد طبيعي قمة البساطة والجمال",
  "Bumpr Vintage Runner": "بامبر فينتج رانر الخفيف للغاية",
  "Original Achilles Low": "أوريجينال أكيليس لو الأيقونة الفاخرة المحدودة",
  "Retro Low Leather": "ريترو لو الكورت البسيط الراقي",
  "Tournament High-Top": "تورنامنت برقبة عالية بجلد مرن معالج",

  // Suffixes
  " 'Triple Sail'": " 'تريبل سيل'",
  " 'Midnight Stealth'": " 'ميدنايت ستيلث الداكن'",

  // Common Descriptions / Details / Reviews (dynamically map matching words to keep Arabic high translation fidelity)
  "Originally created for the hardwood, the Dunk later became a street-style staple. Featuring its classic low-top profile, premium leather overlays, and retro colorways.": "صُمم في الأصل للملاعب الصلبة، ثم أصبح كوتشي دانك لاحقاً عنصراً أساسياً لملابس الشارع الكاجوال. يتميز ببروفايل منخفض، طبقات جلدية ممتازة، وألوان ريترو كلاسيكية.",
  "The radiance lives on in the Air Force 1. Combining hardwood comfort with off-court flair, this luxury version is finished with metallic details and premium leather trim.": "يستمر التألق والجاذبية في كوتشي اير فورس 1. يجمع بين الراحة الفائقة مع الأناقة، هذه النسخة الفاخرة مزينة بلمسات معدنية وجلد فاخر مطرز بالكامل.",
  "Built for the pursuers of personal bests, the ZoomX Vaporfly 3 offers marathon-level propulsion, extreme stability, and unparalleled energy return with state-of-the-art foam.": "صُمم خصيصاً لعشاق الأداء القياسي، يقدم كوتشي زوم إكس فيبرفلاي دفعاً يماثل أحذية الماراثون، مع ثبات فائق، وارتداد طاقة غير مسبوق بفضل الفوم الأكثر تطوراً.",
  "First developed as an indoor soccer trainer, the Adidas Samba has evolved into a global streetwear icon, marked by its classic T-toe profile and signature gold lettering.": "صُمم في الأصل كحذاء تدريب كرة قدم داخل الصالات، وتطور أديداس سامبا ليصبح أيقونة ملابس الشارع العالمية، ويتميز ببروفايل حرف T عند الأصابع وشعاره الذهبي الشهير.",
  "Experience epic energy return with the lightest Ultraboost ever. Features a revolutionary Light BOOST cushioning system and a highly supportive Primeknit engineered sock upper.": "اختبر ارتداد طاقة ملحمي مع أخف كوتشي ألترا بوست على الإطلاق. يتميز بنظام توسيد لايت بوست الثوري وجزء علوي مرن داعم للغاية كالجورب.",
  "An exact reissue of the iconic 1991 Gazelle silhouette. Showcases vintage textures, rich suede paneling, and retro proportions for the ultimate casual luxury vibe.": "إعادة إصدار دقيقة ومطابقة تماماً لـ غازيل الشهير عام 1991. يعرض ملامح كلاسيكية وتفاصيل شمواه غنية وتناسب ريترو مثالي لأرقى الإطلالات الكاجوال الفاخرة.",
  "Crafted without compromise in NB's American workshops. The 990v6 features sleek pigskin suede paneling and propulsive FuelCell midsole cushioning for daily luxury lifestyle.": "صُنع يدوياً وبدون أي تنازلات في ورش عمل نيو بالانس الأمريكية. يتميز كوتشي 990 بمزيج الشمواه وتوسيد فيول سيل في النعل الأوسط لنمط حياة فاخر يومي.",
  "A brilliant recreation of New Balance's archival 1989 low-top basketball shoe. Offering clean retro athletic lines, heavy leather panels, and premium vintage court appeal.": "إعادة إنتاج رائعة لحذاء كرة السلة من نيو بالانس الكلاسيكي لعام 1989. يقدم خطوطاً رياضية أنيقة مع طبقات جلدية متينة وجاذبية ملاعب ريترو فينتج ممتازة.",
  "A highly sought-after technical runner redesigned with a rugged, shredded premium suede aesthetic. Perfectly balances high fashion with outstanding foot support.": "كوتشي رياضي تقني مطلوب للغاية ومُعاد تصميمه بجمالية شمواه فاخرة مشرحة ومميزة. يوازن تماماً بين الموضة الراقية ودعم القدم الاستثنائي.",
  "The defining street silhouette from Puma, featuring full suede paneling, white contrast formstrips, and a clean low-profile design that has remained classic since 1968.": "تصميم الشارع الأيقوني المميز من بوما، يتميز بجسم كامل من الشمواه وأشرطة تباين بيضاء، وتصميم كلاسيكي بسيط ومستمر منذ عام 1968 في الصدارة.",
  "Directly revived from Puma's 1980s terrace archives, this iconic sneaker features a retro signature tag on the upper, classic gum outsole, and soft luxury construction.": "مستوحى مباشرة من أرشيف بوما في الثمانينيات، يتميز هذا السنيكرز الكلاسيكي بملصق توقيع ريترو على الجزء العلوي ونعل صمغي مطاطي ريترو وبنية فاخرة ناعمة.",
  "A bold, bulky sneaker loaded with Puma's proprietary Running System technology. Blends mesh overlays, colorful panels, and extreme comfort padding.": "سنيكرز ضخم وجريء محمل بتقنية نظام الجري الخاصة ببوما. يمزج بين شبك التهوية، لوحات ملونة، وتوسيد راحة فائق النعومة.",
  "The GEL-NYC sneaker sources inspiration from heritage and modern performance running styles. Features an engineered midfoot cage structure and supreme gel cushions.": "يستمد كوتشي جيل إن واي سي إلهامه من التراث الكلاسيكي والجري عالي الأداء. يتميز بهيكل شبكي هندسي وتوسيد جيل مريح للغاية.",
  "The ultimate stability running shoe, loaded with premium 4D Guidance System technology and pureGEL cushioning for an exceptionally plush and responsive feel.": "كوتشي الجري فائق الثبات والمحمل بتقنية التوجيه رباعي الأبعاد وتوسيد بيور جيل للشعور بمرونة وراحة استثنائية تفوق الوصف في كل خطوة.",
  "Spanning across decades of design evolution, the GEL-1130 pays homage to retro technical running aesthetics, showcasing heavy metallic details.": "يمتد عبر عقود من تطور التصميم، يكرّم كوتشي جيل 1130 الجمالية التقنية الكلاسيكية للجري، مع تفاصيل معدنية ثقيلة ولمسة رياضية ممتازة.",
  "The premium version of the legendary high-top canvas sneaker. Constructed with extra-durable heavy canvas, vintage stitching, and varnished high-walled glossy midsoles.": "النسخة الفاخرة من كوتشي القماش الأسطوري برقبة عالية. مصنوع من قماش متين شديد التحمل، خياطة فينتج دقيقة، ونعل كلاسيكي لامع مرتفع الجوانب.",
  "A high-fashion twist on the classic Chuck, incorporating a chunky, double-stacked platform sole and jagged two-tone trail-inspired rubber outsoles.": "لمسة موضة عصرية على كوتشي تشاك الكلاسيكي، يدمج نعلاً مزدوجاً سميكاً مرتفعاً ونعلًا مطاطيًا متعرجًا بلونين مستوحى من المغامرات.",
  "Revived from Converse's 1986 basketball archive. The Weapon low features rich full leather paneling, supportive Y-bar ankle details, and absolute vintage retro flair.": "مستوحى ومستعاد من أرشيف كرة السلة لكونفرس عام 1986. يتميز بجلد كامل غني ودعم كاحل مرن وجاذبية ريترو فينتج كلاسيكية خالصة.",
  "The ultimate skate sneaker that pioneered the iconic side jazz stripe. Upgraded with duracap underlays and ultra-cushioned popcush insoles for elite wear.": "سنيكرز التزلج النهائي الذي كان رائدًا في شريط الجاز الجانبي الأيقوني. تم ترقيته ببطانات دوراكاب ونعال بوبكوش فائقة التوسيد لراحة ممتازة.",
  "Effortless, classic, and instantly recognizable. The Vans Slip-On is a cultural icon featuring the famous checkerboard canvas motif and comfortable elastic accents.": "سهل وعملي كلاسيكي ويمكن التعرف عليه فوراً. كوتشي فانز سليب أون هو رمز ثقافي يتميز بنقشة الشطرنج الشهيرة وتفاصيل مطاطية مريحة.",
  "The legendary lace-up high-top inspired by classic skate culture, reinforced with protective padded ankle chambers and durable suede toes.": "التصميم الأسطوري برباط ورقبة عالية مستوحى من ثقافة السكيت، معزز بحماية الكاحل المبطنة ومقدمة متينة من الشمواه الطبيعي الفاخر.",
  "The absolute pinnacle of sneaker history. Crafted from rich tumbled leather panels, featuring the iconic wings logo and classic air-sole unit in the heel.": "القمة المطلقة في تاريخ السنيكرز. مصنوع من لوحات جلدية معالجة غنية، ويتميز بشعار الأجنحة الأيقوني ووحدة هواء كلاسيكية كاشنة بالكعب.",
  "One of the most loved Jordan silhouettes, updated with luxury leather materials, TPU wing locks, and dual visible air units for premium street wear.": "واحد من أكثر موديلات جوردان شعبية، تم تحديثه بخامات جلدية فاخرة، وأقفال جوانب ومقاطع هواء مرئية مزدوجة لأرقى ملابس الشارع الفخمة.",
  "The elegant icon of basketball, famously featuring a shiny premium patent leather wrap, a carbon fiber stability plate, and translucent icy blue outsoles.": "أيقونة كرة السلة الأنيقة، يتميز بغلاف جلدي براءات اختراع لامع فاخر، لوح كربون فايبر للثبات، ونعل مطاطي أزرق ثلجي شفاف جذاب للغاية.",
  "The pioneer of the luxury chunky sneaker movement. Features an imposing triple-layered midsole molded from athletic running, basketball, and track elements.": "رائد حركة السنيكرز الضخمة الفاخرة. يتميز بنعل أوسط ضخم ثلاثي الطبقات مصبوب من عناصر الجري وكرة السلة وتراك الجري العصري.",
  "An deconstructed raw suede and mesh": "تصميم كلاسيكي ممزق من الشمواه والشبك",
  "Handcrafted pigskin suede and mesh": "صناعة يدوية من الشمواه الفاخر وشبكة التهوية",
  "Buttery soft full grain leather": "جلد حبيبي طبيعي ناعم وممتاز",
  "Premium full-grain tumbled leather": "جلد طبيعي فاخر معالج ومحبب",
  "Double-stitched premium leather panels": "لوحات جلدية فاخرة بخياطة مزدوجة",
  "Handcrafted in Italy to look worn-in": "صُنع يدوياً في إيطاليا بمظهر فينتج معالج",
  "100% Ultra-smooth Italian calfskin leather": "جلد عجل إيطالي ناعم بنسبة 100%",
  "100% Selected Italian calf leather": "جلد عجل إيطالي مختار بعناية 100%",
  "Selected fine calfskin leather base": "قاعدة من جلد العجل الفاخر المختار",
  "100% Premium smooth calf leather": "جلد عجل ناعم وممتاز 100%",
  "Grained premium calfskin leather base": "قاعدة جلد عجل فاخر محبب وممتاز",
  "Requires 7 hours of hand-stitching per pair": "يتطلب 7 ساعات من الخياطة اليدوية لكل زوج",
  "Dior Oblique Galaxy laser-cut leather panels": "لوحات جلدية مقطوعة بالليزر بتصميم ديور أوبليك جالاكسي",
  "Gucci signature green/red web canvas stripe": "شريط كانفاس مميز بلون أخضر وأحمر جوتشي الأيقوني",
  "Premium grained calfskin leather": "جلد عجل حبيبي ممتاز وراقي للغاية",
  "Designed by Virgil Abloh, the iconic LV Trainer is modeled after vintage basketball sneakers, constructed with 7 hours of sewing per pair.": "صُمم بواسطة فيرجيل أبلوه، كوتشي إل في الأسطوري مستوحى من أحذية كرة السلة الكلاسيكية، ويتطلب 7 ساعات كاملة من الخياطة اليدوية الفاخرة لكل زوج."
};

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('moviq_lang');
    return (saved === 'ar' || saved === 'en') ? saved : 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('moviq_lang', newLang);
  };

  // Ensure HTML dir attribute and class updates on language change with smooth fade transition
  useEffect(() => {
    const root = document.documentElement;
    
    // Smooth transition effect
    root.style.transition = 'opacity 0.25s ease-in-out';
    root.style.opacity = '0.75';
    
    const timer = setTimeout(() => {
      root.dir = lang === 'ar' ? 'rtl' : 'ltr';
      root.lang = lang;
      
      // Toggle custom RTL fonts if needed or direct Tailwind classes
      if (lang === 'ar') {
        root.classList.add('rtl-layout');
      } else {
        root.classList.remove('rtl-layout');
      }
      
      root.style.opacity = '1';
    }, 150);

    return () => clearTimeout(timer);
  }, [lang]);

  // Translation function
  const t = (text: string): string => {
    if (!text) return '';
    const trimmed = text.trim();
    
    // If language is English, return translation if present or original text
    if (lang === 'en') {
      return TRANSLATIONS.en[trimmed] || trimmed;
    }

    // Language is Arabic
    // 1. Check exact key-based translations
    if (TRANSLATIONS.ar[trimmed]) {
      return TRANSLATIONS.ar[trimmed];
    }

    // 2. Check dynamic product database terms
    if (DYNAMIC_TRANSLATIONS[trimmed]) {
      return DYNAMIC_TRANSLATIONS[trimmed];
    }

    // 3. Fallback phrase matching (substring mappings)
    for (const [enKey, arVal] of Object.entries(DYNAMIC_TRANSLATIONS)) {
      if (trimmed.includes(enKey)) {
        return trimmed.replace(enKey, arVal);
      }
    }

    for (const [enKey, arVal] of Object.entries(TRANSLATIONS.ar)) {
      if (trimmed.includes(enKey)) {
        return trimmed.replace(enKey, arVal);
      }
    }

    return trimmed;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
