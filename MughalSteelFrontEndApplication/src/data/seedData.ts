import type { Product, BlogPost, Testimonial, ProjectCategory, ProductItemType, TeamMember, ProjectShowcaseItem, WhatIsYourProjectItem, ProjectDesignItem, ProjectSubcategoryItem } from '../types';

export interface CategoryInfo {
  id: string;
  name: ProjectCategory;
  slug: string;
  tagline: string;
  description: string;
  heroImage: string;
  items: ProductItemType[];
  popularProducts: string[];
}

export const STANDARD_PROJECT_CATEGORIES = [
  'Housing Society',
  'Modern Home',
  'Classical Home',
  'Commercial',
  'Modern Farmhouse',
  'Classical Farmhouse',
  'Village House',
  'Farm',
  'Small Villa',
  'Aluminum & Glass'
] as const;

export type StandardProjectCategory = typeof STANDARD_PROJECT_CATEGORIES[number];

export const PROJECT_CATEGORIES_DATA: CategoryInfo[] = [
  {
    id: 'cat-housing-society',
    name: 'Housing Society',
    slug: 'housing-society',
    tagline: 'Grand entrance gates, perimeter security & community infrastructure',
    description: 'Heavy-duty monumental entrance structures, automated boom barrier frames, high-security spike fencing, and durable community park steel fabrications.',
    heroImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    items: ['Main Gates', 'Boundary Wall Grills', 'Steel Structures', 'Sheds & Canopies', 'Railing'],
    popularProducts: ['MFG-020', 'MFR-021', 'MFS-022']
  },
  {
    id: 'cat-modern-home',
    name: 'Modern Home',
    slug: 'modern-home',
    tagline: 'Clean lines, laser-cut geometry & minimalist architecture',
    description: 'Sleek, architectural steelwork tailored for contemporary urban residences. Featuring CNC laser-cut designs, concealed hinges, integrated wood accents, and minimalist railings.',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    items: ['Front Gates', 'Main Gates', 'Railing', 'Stair Railing', 'Balcony Railing', 'Grills', 'Doors', 'Windows'],
    popularProducts: ['MFG-001', 'MFG-002', 'MFR-003', 'MFS-004']
  },
  {
    id: 'cat-classical-home',
    name: 'Classical Home',
    slug: 'classical-home',
    tagline: 'Timeless wrought iron craftsmanship, scrollwork & royal crests',
    description: 'Hand-forged ornamental wrought iron gates, classical balustrades, cast brass accents, and archway doors engineered for grand heritage villas and traditional estates.',
    heroImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    items: ['Front Gates', 'Main Gates', 'Railing', 'Stair Railing', 'Balcony Railing', 'Grills', 'Doors', 'Windows'],
    popularProducts: ['MFG-010', 'MFR-011', 'MFG-012', 'MFD-013']
  },
  {
    id: 'cat-commercial',
    name: 'Commercial',
    slug: 'commercial',
    tagline: 'Industrial strength, motorized sliding systems & structural steel',
    description: 'High-traffic commercial entrances, warehouse sliding doors, structural steel mezzanines, emergency spiral staircases, and heavy-duty railing systems for plazas and corporate headquarters.',
    heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    items: ['Main Gates', 'Doors', 'Steel Structures', 'Stair Railing', 'Railing', 'Sheds & Canopies'],
    popularProducts: ['MFG-030', 'MFS-031', 'MFR-032', 'MFD-033']
  },
  {
    id: 'cat-modern-farmhouse',
    name: 'Modern Farmhouse',
    slug: 'modern-farmhouse',
    tagline: 'Rustic warmth meets industrial steel precision',
    description: 'Modern ranch gates, cross-buck porch railings, oversized sliding barn doors with heavy steel tracks, and black powder-coated perimeter fencing for modern agrarian lifestyles.',
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    items: ['Front Gates', 'Doors', 'Railing', 'Balcony Railing', 'Windows'],
    popularProducts: ['MFG-040', 'MFD-041', 'MFR-042']
  },
  {
    id: 'cat-classical-farmhouse',
    name: 'Classical Farmhouse',
    slug: 'classical-farmhouse',
    tagline: 'Stately country estate gates & heavy forged boundary elements',
    description: 'Solid bar iron gates with spear finials, heavy duty stone-column mounting hardware, estate driveway gates, and traditional balcony grills.',
    heroImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    items: ['Main Gates', 'Front Gates', 'Boundary Wall Grills', 'Railing', 'Windows'],
    popularProducts: ['MFG-050', 'MFR-051']
  },
  {
    id: 'cat-village-house',
    name: 'Village House',
    slug: 'village-house',
    tagline: 'Maximum security, solid steel plates & long-lasting durability',
    description: 'Heavy gauge solid steel sheets, anti-theft window security grills, reinforced main entrance doors, and robust locking mechanism hardware designed for peace of mind.',
    heroImage: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
    items: ['Main Gates', 'Doors', 'Grills', 'Windows', 'Boundary Wall Grills'],
    popularProducts: ['MFG-060', 'MFG-061', 'MFD-062']
  },
  {
    id: 'cat-farm',
    name: 'Farm',
    slug: 'farm',
    tagline: 'Galvanized cattle barriers, agricultural sheds & field gates',
    description: 'Corrosion-proof hot-dip galvanized steel gates, cattle containment grids, heavy equipment shed trusses, and durable agricultural property perimeter protection.',
    heroImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    items: ['Main Gates', 'Steel Structures', 'Sheds & Canopies', 'Boundary Wall Grills'],
    popularProducts: ['MFG-070', 'MFS-071']
  },
  {
    id: 'cat-small-villa',
    name: 'Small Villa',
    slug: 'small-villa',
    tagline: 'Space-saving sliding, bi-fold & elegant compact steelwork',
    description: 'Smart telescopic and bi-fold gates for limited driveway clearances, sleek terrace glass/steel railings, and modern slim-profile entrance doors crafted for 5 Marla and 10 Marla villas.',
    heroImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    items: ['Front Gates', 'Main Gates', 'Balcony Railing', 'Stair Railing', 'Doors'],
    popularProducts: ['MFG-080', 'MFR-081']
  },
  {
    id: 'cat-aluminum-glass',
    name: 'Aluminum & Glass',
    slug: 'aluminum-glass',
    tagline: 'Ultra-slim thermal profiles, architectural pivot doors & glass balustrades',
    description: 'Thermally isolated aluminum window frames, double-glazed soundproof glass walls, frameless tempered glass railings, and expansive architectural pivot entryways.',
    heroImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    items: ['Doors', 'Windows', 'Aluminum & Glass Partitions', 'Balcony Railing', 'Stair Railing'],
    popularProducts: ['MFAG-090', 'MFAG-091', 'MFAG-092']
  }
];

export const SEED_PRODUCTS: Product[] = [
  // ==========================================
  // 1. STEEL GATES (FRONT, MAIN, SLIDING, SWING)
  // ==========================================
  {
    id: 'prod-mfg-g001',
    productCode: 'MFG-G001',
    name: 'Metropolis CNC Laser-Cut Geometric Main Gate',
    slug: 'metropolis-cnc-laser-cut-geometric-main-gate',
    category: 'Modern Home',
    item: 'Front Gates',
    shortDescription: 'CNC precision laser-cut sheet steel with geometric pattern and heavy box-section frame.',
    description: 'The MFG-G001 Metropolis Main Gate represents cutting-edge architectural steel craftsmanship. Built with high-tensile 3mm CNC laser-cut steel plates encased in 16-gauge box pipes, this gate combines supreme privacy with modern aesthetics. Finished in anti-corrosion primer and premium matte charcoal powder coating.',
    price: 130000,
    pricePerSqFt: 2600,
    frontImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    backImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    sideImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    detailImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    installationImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
    ],
    galleryViews: {
      front: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      back: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      side: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      detail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      installation: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
    },
    materials: ['Mild Steel (MS)', 'Galvanized Sheet', 'CNC Laser Plate'],
    finishes: ['Matte Black Powder Coat', 'Dark Graphite Gray', 'Metallic Bronze with Gold Inlay'],
    style: 'Modern Minimalist',
    application: 'Residential Driveway / Front Elevation',
    availableSizes: ['10ft x 7ft (Standard)', '12ft x 7.5ft', '14ft x 8ft', 'Custom Sizing'],
    width: [10, 12, 14, 16],
    height: [6.5, 7, 7.5, 8],
    customization: ['Motorized Sliding Track', 'WPC Wood Slat Accents', 'Integrated Pedestrian Wicket Gate', 'LED Strip Groove'],
    availability: 'in-stock',
    stock: 6,
    rating: 4.9,
    reviews: [
      { id: 'rev-1', productId: 'prod-mfg-g001', userName: 'Chaudhry Tariq', rating: 5, comment: 'Installed at our DHA Phase 6 home in Lahore. The laser finish and welding quality is remarkable. 10/10.', date: '2026-06-12', city: 'Lahore' },
      { id: 'rev-2', productId: 'prod-mfg-g001', userName: 'Engr. Bilal Aslam', rating: 5, comment: 'Very sturdy gauge. The automated motor slides smoothly. Highly recommended.', date: '2026-07-04', city: 'Islamabad' }
    ],
    tags: ['Laser Cut', 'Modern Home', 'Front Gate', 'Best Seller'],
    relatedProducts: ['prod-mfg-g002', 'prod-mfg-r001', 'prod-mfg-d001'],
    featured: true,
    newArrival: false,
    isDemoVisual: true,
    createdAt: '2026-01-10'
  },
  {
    id: 'prod-mfg-g002',
    productCode: 'MFG-G002',
    name: 'Horizon Steel & Wood-Accent Sliding Gate',
    slug: 'horizon-steel-wood-accent-sliding-gate',
    category: 'Modern Home',
    item: 'Main Gates',
    shortDescription: 'Horizontal slatted steel profile with weather-proof composite wood panels.',
    description: 'Engineered for luxury homes requiring warmth and modern security. Features alternating horizontal steel slats and imported composite wood louvers that never rot, fade, or require periodic varnishing.',
    price: 156000,
    pricePerSqFt: 2850,
    frontImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    backImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    sideImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    detailImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    installationImage: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80'
    ],
    galleryViews: {
      front: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      back: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      side: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      detail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      installation: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80'
    },
    materials: ['Heavy Gauge MS Pipes', 'WPC Wood Flutes', 'Stainless Steel Trim'],
    finishes: ['Jet Black with Teak Wood', 'Anthracite Gray with Walnut', 'Bronze Powder Coat'],
    style: 'Scandinavian / Modern',
    application: 'Main Boundary Driveway',
    availableSizes: ['12ft x 7ft', '14ft x 8ft', '16ft x 8ft', 'Custom Size'],
    width: [12, 14, 16],
    height: [7, 7.5, 8],
    customization: ['Automatic Sliding Motor', 'Intercom Camera Mount', 'Matching Boundary Grills'],
    availability: 'in-stock',
    stock: 4,
    rating: 4.8,
    reviews: [
      { id: 'rev-3', productId: 'prod-mfg-g002', userName: 'Salman Sheikh', rating: 5, comment: 'The combination of black steel and wood makes our house stand out in Bahria Town.', date: '2026-05-20', city: 'Rawalpindi' }
    ],
    tags: ['Sliding Gate', 'Wood Accent', 'Modern Home'],
    relatedProducts: ['prod-mfg-g001', 'prod-mfg-r001'],
    featured: true,
    newArrival: true,
    isDemoVisual: true,
    createdAt: '2026-02-15'
  },
  {
    id: 'prod-mfg-g004',
    productCode: 'MFG-G004',
    name: 'Versailles Hand-Forged Wrought Iron Double Gate',
    slug: 'versailles-hand-forged-wrought-iron-double-gate',
    category: 'Classical Home',
    item: 'Front Gates',
    shortDescription: 'Royal hand-forged scrollwork, cast iron rosettes and gold leaf crest highlights.',
    description: 'A masterpiece of traditional blacksmith forge artistry. Each scroll, spearhead, and floral medallion is heated and hammered by master artisans over coal hearths. Triple coated with hot-zinc spray, epoxy primer, and UV-resistant poly-acrylic enamel with hand-rubbed antique gold highlights.',
    price: 224000,
    pricePerSqFt: 3200,
    frontImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    backImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    sideImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    detailImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    installationImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    galleryViews: {
      front: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      back: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      side: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      detail: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      installation: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    },
    materials: ['Solid Wrought Iron Bars', 'Cast Brass Crests', 'Heavy Forged Hinges'],
    finishes: ['Antiqued Bronze with Gold Leaf', 'Satin Black with Copper Rub', 'Verdigris Patina'],
    style: 'Classical Victorian / Baroque',
    application: 'Estate Driveway / Grand Arch Entrance',
    availableSizes: ['12ft x 8ft', '14ft x 9ft', '16ft x 10ft (Arch Top)'],
    width: [12, 14, 16],
    height: [8, 9, 10],
    customization: ['Custom Family Monogram / Name Plate', 'Heavy Underground Swing Motors', 'Matching Pedestrian Gate'],
    availability: 'in-stock',
    stock: 3,
    rating: 4.9,
    reviews: [
      { id: 'rev-6', productId: 'prod-mfg-g004', userName: 'Nawabzada Haroon', rating: 5, comment: 'Magnificent detailing. Truly gives our ancestral residence a regal facade.', date: '2026-06-01', city: 'Gujranwala' }
    ],
    tags: ['Wrought Iron', 'Classical', 'Front Gate', 'Hand Forged'],
    relatedProducts: ['prod-mfg-g001', 'prod-mfg-d002'],
    featured: true,
    newArrival: false,
    isDemoVisual: true,
    createdAt: '2026-01-05'
  },
  {
    id: 'prod-mfg-g007',
    productCode: 'MFG-G007',
    name: 'Grand Boulevard Society Monumental Entrance Gate',
    slug: 'grand-boulevard-society-monumental-entrance-gate',
    category: 'Housing Society',
    item: 'Main Gates',
    shortDescription: 'Heavy-duty 40-foot span structural steel community entrance gate with guard booth arch.',
    description: 'Designed for residential housing societies and gated communities. Built with heavy 8-inch I-beam pillars and 3-inch high-tensile structural steel framework, engineered for continuous 24/7 automated barrier cycle usage and high wind resistance.',
    price: 450000,
    pricePerSqFt: 3000,
    frontImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    backImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    sideImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    detailImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    installationImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80'
    ],
    galleryViews: {
      front: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      back: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      side: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      detail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      installation: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80'
    },
    materials: ['Heavy Structural I-Beam', '10-Gauge Box Pipe', 'CNC Brass Emblem Plates'],
    finishes: ['Hot Dip Galvanized', 'High-Bake Industrial Epoxy', 'Reflective Safety Trims'],
    style: 'Monumental Security',
    application: 'Main Housing Society Entrance Boulevard',
    availableSizes: ['24ft to 48ft Dual-Lane Openings'],
    width: [24, 30, 36, 40],
    height: [10, 12, 14],
    customization: ['Automatic RFID Reader Post Integration', 'CCTV Mounting Bracket', 'Illuminated Society Crest'],
    availability: 'custom-only',
    stock: 2,
    rating: 5.0,
    reviews: [],
    tags: ['Housing Society', 'Monumental Gate', 'Commercial Steel'],
    relatedProducts: ['prod-mfg-g001', 'prod-mfg-r005'],
    featured: true,
    newArrival: false,
    isDemoVisual: true,
    createdAt: '2026-02-01'
  },
  {
    id: 'prod-mfg-g009',
    productCode: 'MFG-G009',
    name: 'Telescopic Bi-Fold Compact Driveway Steel Gate',
    slug: 'telescopic-bi-fold-compact-driveway-steel-gate',
    category: 'Small Villa',
    item: 'Front Gates',
    shortDescription: 'Multi-leaf synchronized folding gate engineered for 5 Marla and 10 Marla villas.',
    description: 'Solves narrow driveway clearance issues. When opened, the multi-leaf mechanism folds neatly against the perimeter wall, consuming less than 2 feet of parking space while providing full opening access for large SUVs.',
    price: 145000,
    pricePerSqFt: 2900,
    frontImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    backImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    sideImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    detailImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    installationImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    ],
    galleryViews: {
      front: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      back: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      side: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      detail: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      installation: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    },
    materials: ['High Strength Carbon Steel', 'Heavy Bearing Hinges', 'Dual Cable Sync Track'],
    finishes: ['Matte Black Satin', 'Graphite Gray', 'Dual Tone Metallic'],
    style: 'Modern Villa Folding System',
    application: '5 Marla & 10 Marla Driveway Access',
    availableSizes: ['10ft x 7ft', '12ft x 7.5ft', '14ft x 8ft'],
    width: [10, 12, 14],
    height: [6.5, 7, 7.5],
    customization: ['Compact Motorization Unit', 'Integrated Lockable Wicket Door'],
    availability: 'in-stock',
    stock: 5,
    rating: 4.9,
    reviews: [],
    tags: ['Bi-Fold Gate', 'Small Villa', 'Space Saving'],
    relatedProducts: ['prod-mfg-g001', 'prod-mfg-d005'],
    featured: true,
    newArrival: true,
    isDemoVisual: true,
    createdAt: '2026-03-10'
  },

  // ==========================================
  // 2. STEEL DOORS & WROUGHT IRON DOORS
  // ==========================================
  {
    id: 'prod-mfg-d001',
    productCode: 'MFG-D001',
    name: 'Titanium Oversized Modern Hydraulic Pivot Steel Door',
    slug: 'titanium-oversized-modern-hydraulic-pivot-steel-door',
    category: 'Modern Home',
    item: 'Doors',
    shortDescription: 'Heavy-duty center pivot steel entry door with insulated core and 60-inch pull bar.',
    description: 'Our flagship modern entry door. Built on a self-closing hydraulic pivot system capable of supporting 600kg panels. Features double-insulated thermal internal core, double perimeter magnetic weatherstripping, and vertical frosted vision glass strips.',
    price: 240000,
    pricePerSqFt: 3800,
    frontImage: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
    backImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    sideImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    detailImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    installationImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    galleryViews: {
      front: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
      back: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      side: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      detail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      installation: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    },
    materials: ['Heavy Gauge Carbon Steel', 'Polyurethane Thermal Core', 'Tempered Low-E Glass'],
    finishes: ['Matte Black Textured', 'Anodized Bronze', 'Brushed Copper Patina'],
    style: 'Ultra-Luxury Pivot',
    application: 'Main Villa Entrance Door',
    availableSizes: ['4ft x 8ft', '5ft x 9ft', '6ft x 10ft (Grand)'],
    width: [4, 5, 6],
    height: [8, 9, 10],
    customization: ['Smart Fingerprint Lock Prep', 'Integrated Side Sidelights', '60-inch Solid Brass Pull Handle'],
    availability: 'custom-only',
    stock: 3,
    rating: 5.0,
    reviews: [
      { id: 'rev-5', productId: 'prod-mfg-d001', userName: 'Malik Zeeshan', rating: 5, comment: 'Opening this 5x10 door with just one finger feels incredible. Best investment in our new house.', date: '2026-07-28', city: 'Islamabad' }
    ],
    tags: ['Pivot Door', 'Entrance Door', 'Luxury'],
    relatedProducts: ['prod-mfg-g001', 'prod-mfg-r001'],
    featured: true,
    newArrival: true,
    isDemoVisual: true,
    createdAt: '2026-04-10'
  },
  {
    id: 'prod-mfg-d002',
    productCode: 'MFG-D002',
    name: 'Castille Arch Double Wrought Iron Entry Door',
    slug: 'castille-arch-double-wrought-iron-entry-door',
    category: 'Classical Home',
    item: 'Doors',
    shortDescription: 'Double arch entry door with independently operable glass window panels.',
    description: 'Hand-crafted wrought iron double door with classical scrollwork overlays. Features an internal hinged glass frame that opens inward independently, allowing you to ventilate your home or clean the glass without opening the heavy security iron doors.',
    price: 294000,
    pricePerSqFt: 4200,
    frontImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    backImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    sideImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    detailImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    installationImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    galleryViews: {
      front: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      back: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      side: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      detail: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      installation: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    },
    materials: ['Solid Forged Wrought Iron', 'Insulated Dual-Pane Rain Glass', 'Solid Brass Handles'],
    finishes: ['Aged Copper Patina', 'Oil Rubbed Bronze', 'Deep Satin Black'],
    style: 'Classical Mediterranean / Tuscan',
    application: 'Grand Residential Entryway',
    availableSizes: ['6ft x 8ft', '6ft x 9ft', '7ft x 10ft (Arch Top)'],
    width: [6, 7, 8],
    height: [8, 9, 10],
    customization: ['Operable Glass Panel Ventilator', 'Custom Cast Family Crest', 'Low-E Security Glass'],
    availability: 'custom-only',
    stock: 2,
    rating: 5.0,
    reviews: [],
    tags: ['Double Door', 'Wrought Iron', 'Classical Entrance'],
    relatedProducts: ['prod-mfg-g004', 'prod-mfg-r002'],
    featured: true,
    newArrival: false,
    isDemoVisual: true,
    createdAt: '2026-01-18'
  },
  {
    id: 'prod-mfg-d003',
    productCode: 'MFG-D003',
    name: 'Industrial Modern Farmhouse Sliding Glass Barn Door',
    slug: 'industrial-modern-farmhouse-sliding-glass-barn-door',
    category: 'Modern Farmhouse',
    item: 'Doors',
    shortDescription: 'Heavy top-hung steel barn door with multi-lite clear safety glass grid.',
    description: 'Combines farmhouse rustic warmth with modern industrial steel detailing. Features smooth-gliding 4-inch ball-bearing top hangers and floor guides that require zero bottom track cuts.',
    price: 110000,
    pricePerSqFt: 3100,
    frontImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    backImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    sideImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    detailImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    installationImage: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80'
    ],
    galleryViews: {
      front: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      back: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      side: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      detail: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      installation: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80'
    },
    materials: ['Slim Steel Profiles', '10mm Tempered Glass', 'Industrial Top Hangers'],
    finishes: ['Matte Black Powder Coat', 'Distressed Antique Steel'],
    style: 'Modern Farmhouse Industrial',
    application: 'Master Suite, Living Room Partition & Study',
    availableSizes: ['3.5ft x 7.5ft', '4ft x 8ft', '5ft x 8ft'],
    width: [3.5, 4, 5],
    height: [7.5, 8, 9],
    customization: ['Soft-Close Damper Mechanism', 'Fluted / Reeded Glass'],
    availability: 'in-stock',
    stock: 6,
    rating: 4.8,
    reviews: [],
    tags: ['Barn Door', 'Sliding Door', 'Farmhouse'],
    relatedProducts: ['prod-mfg-d001', 'prod-mfg-g002'],
    featured: false,
    newArrival: true,
    isDemoVisual: true,
    createdAt: '2026-03-05'
  },

  // ==========================================
  // 3. WINDOWS & SECURITY GRILLS
  // ==========================================
  {
    id: 'prod-mfg-w001',
    productCode: 'MFG-W001',
    name: 'Prism Modern Geometric Window Security Grill',
    slug: 'prism-modern-geometric-window-security-grill',
    category: 'Modern Home',
    item: 'Grills',
    shortDescription: 'Solid square bar geometric security grill with seamless hidden anchor brackets.',
    description: 'High-security aesthetic window protection crafted from 1/2-inch solid cold-rolled steel square bars welded in a staggered modern matrix. Offers maximum intrusion resistance without feeling like a prison bar system.',
    price: 48000,
    pricePerSqFt: 1600,
    frontImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    backImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    sideImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    detailImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    installationImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    galleryViews: {
      front: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      back: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      side: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      detail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      installation: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    },
    materials: ['Solid Square MS Bars (1/2" or 5/8")', 'Heavy Frame Flat Bar'],
    finishes: ['Satin Black Powder Coat', 'Pure White', 'Metallic Graphite'],
    style: 'Minimalist Security',
    application: 'Ground & First Floor Window Openings',
    availableSizes: ['4ft x 4ft', '5ft x 5ft', '6ft x 4ft', 'Custom Measurements'],
    width: [4, 5, 6, 8],
    height: [4, 5, 6],
    customization: ['Emergency Escape Lockable Hatch', 'Inside or Outside Wall Mounting'],
    availability: 'in-stock',
    stock: 15,
    rating: 4.7,
    reviews: [],
    tags: ['Window Grill', 'Security', 'Modern'],
    relatedProducts: ['prod-mfg-g001', 'prod-mfg-d001'],
    featured: false,
    newArrival: false,
    isDemoVisual: true,
    createdAt: '2026-01-22'
  },
  {
    id: 'prod-mfg-w002',
    productCode: 'MFG-W002',
    name: 'Bavaria Heavy Forged Window Security Grate',
    slug: 'bavaria-heavy-forged-window-security-grate',
    category: 'Classical Home',
    item: 'Grills',
    shortDescription: 'Traditional solid twisted bar security grates with belly bulge for flower pot placement.',
    description: 'Traditional solid twisted bar security grates with belly bulge for flower pot placement. Provides ironclad perimeter defense against burglary while enhancing classical facade beauty.',
    price: 37000,
    pricePerSqFt: 1850,
    frontImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    backImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    sideImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    detailImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    installationImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    galleryViews: {
      front: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      back: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      side: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      detail: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      installation: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    },
    materials: ['Solid Twisted Square Bar', 'Forged Medallions', 'Anchor Rods'],
    finishes: ['Black Epoxy Matte', 'Aged Bronze', 'Charcoal Gunmetal'],
    style: 'Classical Estate Security',
    application: 'Villa Windows & French Doors',
    availableSizes: ['4ft x 5ft', '5ft x 6ft', 'Custom Sizes'],
    width: [4, 5, 6],
    height: [4, 5, 6],
    customization: ['Bottom Planter Box Bulge', 'Wall Embedment Pins'],
    availability: 'in-stock',
    stock: 25,
    rating: 4.9,
    reviews: [],
    tags: ['Window Grill', 'Security', 'Classical'],
    relatedProducts: ['prod-mfg-g004', 'prod-mfg-d002'],
    featured: false,
    newArrival: false,
    isDemoVisual: true,
    createdAt: '2026-01-28'
  },

  // ==========================================
  // 4. ALUMINUM & GLASS PARTITIONS & DOORS
  // ==========================================
  {
    id: 'prod-mfg-ag001',
    productCode: 'MFG-AG001',
    name: 'Ultra-Slim Architectural Black Aluminum Pivot Glass Door',
    slug: 'ultra-slim-architectural-black-aluminum-pivot-glass-door',
    category: 'Aluminum & Glass',
    item: 'Doors',
    shortDescription: 'Minimalist 20mm ultra-slim sightline aluminum door with 10mm tempered fluted glass.',
    description: 'Engineered for luxury contemporary homes and executive suites. Utilizes aerospace-grade thermal break aluminum extrusion with concealed German pivot hinges and magnetic latching.',
    price: 165000,
    pricePerSqFt: 3500,
    frontImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    backImage: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
    sideImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    detailImage: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
    installationImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    galleryViews: {
      front: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      back: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
      side: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      detail: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
      installation: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    },
    materials: ['Slim Thermal Aluminum', '10mm Laminated Fluted Glass', 'Floor Pivot Box'],
    finishes: ['Anodized Matte Black', 'Champagne Gold', 'Brushed Titanium'],
    style: 'Modern Minimalist Glass',
    application: 'Main Villa Entrance / Wine Room / Master Bath',
    availableSizes: ['4ft x 8ft', '4.5ft x 9ft', '5ft x 10ft'],
    width: [4, 4.5, 5],
    height: [8, 9, 10],
    customization: ['Fluted / Frosted / Tinted Glass', 'Concealed Overhead Door Closer'],
    availability: 'custom-only',
    stock: 4,
    rating: 5.0,
    reviews: [],
    tags: ['Aluminum Glass', 'Pivot Door', 'Luxury'],
    relatedProducts: ['prod-mfg-d001', 'prod-mfg-ag003'],
    featured: true,
    newArrival: true,
    isDemoVisual: true,
    createdAt: '2026-03-22'
  },
  {
    id: 'prod-mfg-ag003',
    productCode: 'MFG-AG003',
    name: 'Aero Frameless Tempered Glass Balcony Railing System',
    slug: 'aero-frameless-tempered-glass-balcony-railing-system',
    category: 'Modern Home',
    item: 'Balcony Railing',
    shortDescription: '12mm tempered safety glass with Grade 304 stainless steel base shoe and slim top cap.',
    description: 'Maximize your architectural sightlines and balcony aesthetics. Features ultra-clear 12mm laminated safety glass mounted into heavy SS-304 spigots or continuous concealed base channel, rated for extreme wind loads and impact security.',
    price: 88000,
    pricePerSqFt: 2200,
    frontImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    backImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    sideImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    detailImage: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
    installationImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    galleryViews: {
      front: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      back: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      side: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      detail: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
      installation: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    },
    materials: ['Grade 304 Stainless Steel', '12mm Tempered Glass', 'Aluminum U-Channel'],
    finishes: ['Brushed Satin Stainless', 'Mirror Polish', 'Matte Black Anodized'],
    style: 'Ultra Modern / Frameless',
    application: 'First & Second Floor Balconies / Terraces',
    availableSizes: ['Running Feet on Site (Calculated by Total Area)'],
    width: [10, 15, 20, 30],
    height: [3, 3.5, 4],
    customization: ['LED Under-glow Channel', 'Handrail-free top edge', 'Tinted Grey/Bronze Glass'],
    availability: 'in-stock',
    stock: 20,
    rating: 5.0,
    reviews: [
      { id: 'rev-4', productId: 'prod-mfg-ag003', userName: 'Dr. Kamran Malik', rating: 5, comment: 'Crystal clear glass with solid SS fittings. Clean installation team.', date: '2026-06-18', city: 'Faisalabad' }
    ],
    tags: ['Glass Railing', 'Stainless Steel', 'Balcony'],
    relatedProducts: ['prod-mfg-r001', 'prod-mfg-g001'],
    featured: true,
    newArrival: false,
    isDemoVisual: true,
    createdAt: '2026-03-01'
  },

  // ==========================================
  // 5. RAILINGS & STAIRS
  // ==========================================
  {
    id: 'prod-mfg-r001',
    productCode: 'MFG-R001',
    name: 'Apex Floating Spine Cantilevered Steel Staircase',
    slug: 'apex-floating-spine-cantilevered-steel-staircase',
    category: 'Modern Home',
    item: 'Stair Railing',
    shortDescription: 'Heavy central mono-stringer steel beam staircase with floating solid wood treads.',
    description: 'Transform your interior foyer into a piece of art. Our Apex Floating Staircase utilizes an internal 10mm thick structural steel spine anchored into concrete beams, supporting 3-inch solid ash wood steps with matching vertical cable or glass railings.',
    price: 180000,
    pricePerSqFt: 3400,
    frontImage: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
    backImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    sideImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    detailImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    installationImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'
    ],
    galleryViews: {
      front: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
      back: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      side: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      detail: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      installation: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'
    },
    materials: ['Structural I-Beam Steel', 'Grade 304 Cables', 'Solid Teak/Oak Treads'],
    finishes: ['Matte Black Stringer', 'Gunmetal Gray', 'Custom Epoxy Enamel'],
    style: 'Modern Architectural',
    application: 'Interior Duplex / Villa Main Foyer',
    availableSizes: ['Standard 10ft - 12ft Floor-to-Floor Height'],
    width: [3, 3.5, 4],
    height: [10, 11, 12, 14],
    customization: ['Under-tread LED Lighting Slots', 'Tempered Glass Balustrade', 'Open or Closed Risers'],
    availability: 'custom-only',
    stock: 2,
    rating: 4.9,
    reviews: [],
    tags: ['Floating Stairs', 'Mono Stringer', 'Interior Luxury'],
    relatedProducts: ['prod-mfg-ag003', 'prod-mfg-d001'],
    featured: true,
    newArrival: true,
    isDemoVisual: true,
    createdAt: '2026-03-20'
  },
  {
    id: 'prod-mfg-r002',
    productCode: 'MFG-R002',
    name: 'Castille Classical Ornamental Staircase Balustrade',
    slug: 'castille-classical-ornamental-staircase-balustrade',
    category: 'Classical Home',
    item: 'Stair Railing',
    shortDescription: 'Continuous curved wrought iron scroll balusters with polished mahogany handrail.',
    description: 'Custom forged for curved and spiral staircase geometries. Handcrafted scrolls with decorative cast iron knuckles and forged start newels, topped with custom solid wood or forged steel molded handrails.',
    price: 116000,
    pricePerSqFt: 2900,
    frontImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    backImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    sideImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    detailImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    installationImage: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80'
    ],
    galleryViews: {
      front: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      back: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      side: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      detail: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      installation: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80'
    },
    materials: ['Forged Solid MS Steel', 'Solid Brass Newel Tops', 'Cast Knuckles'],
    finishes: ['Oil Rubbed Bronze', 'Matte Black Antique', 'Rich Gold Accentuation'],
    style: 'Classical Spanish / French Chateau',
    application: 'Main Curved Stairways & Mezzanine Balconies',
    availableSizes: ['Custom templates measured on site'],
    width: [8, 12, 16, 24],
    height: [3, 3.5],
    customization: ['Volute Starting Scroll', 'Double Knuckle Rhythm', 'Brass Handrail Cap'],
    availability: 'in-stock',
    stock: 8,
    rating: 4.8,
    reviews: [],
    tags: ['Staircase', 'Wrought Iron', 'Classical'],
    relatedProducts: ['prod-mfg-g004', 'prod-mfg-d002'],
    featured: false,
    newArrival: false,
    isDemoVisual: true,
    createdAt: '2026-02-18'
  },
  {
    id: 'prod-mfg-r005',
    productCode: 'MFG-R005',
    name: 'Perimeter Heavy Shark-Spike Boundary Wall Railing',
    slug: 'perimeter-heavy-shark-spike-boundary-wall-railing',
    category: 'Housing Society',
    item: 'Boundary Wall Grills',
    shortDescription: 'Anti-scaling hardened steel perimeter wall defense railing with razor-pointed spikes.',
    description: 'Engineered for maximum perimeter security for housing societies, commercial depots, and private residences. Manufactured from 3mm thick pressed steel anti-climb shark teeth welded onto heavy box sections.',
    price: 32000,
    pricePerSqFt: 1400,
    frontImage: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80',
    backImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    sideImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    detailImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    installationImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80'
    ],
    galleryViews: {
      front: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80',
      back: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      side: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      detail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      installation: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80'
    },
    materials: ['High Carbon Steel', 'Anti-Climb Pressed Spikes', 'Heavy Base Anchors'],
    finishes: ['Hot-Dip Galvanized', 'Matte Black Powder Coat'],
    style: 'Perimeter Defense',
    application: 'Boundary Wall Coping & Fence Tops',
    availableSizes: ['Running Length (Calculated by Total Length x Height)'],
    width: [10, 20, 50, 100],
    height: [1.5, 2, 2.5, 3],
    customization: ['Rotary Anti-Scale Spikes', 'Electrified Fence Mount Points'],
    availability: 'in-stock',
    stock: 50,
    rating: 4.9,
    reviews: [],
    tags: ['Boundary Grill', 'Security', 'Anti-Climb'],
    relatedProducts: ['prod-mfg-g007', 'prod-mfg-g001'],
    featured: false,
    newArrival: false,
    isDemoVisual: true,
    createdAt: '2026-02-10'
  }
];

export const SEED_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Ch. Tariq Mehmood',
    location: 'Bahria Town Phase 7, Rawalpindi',
    rating: 5,
    projectType: '14-Gauge CNC Laser Cut Main Entrance Gate (MFG-001)',
    text: 'Mughal Steel delivered beyond our expectations. The laser-cut precision on our 14ft main gate and electrostatic powder coating has zero flaws. Extremely professional execution from laser surveying to final installation.',
    featured: true,
    published: true
  },
  {
    id: 'test-2',
    name: 'Engr. Bilal Aslam',
    location: 'Sector F-7/2, Islamabad',
    rating: 5,
    projectType: 'Oversized Pivot Entrance Door & Security Grills (MFD-004)',
    text: 'The 5x10 ft pivot door swings effortlessly with single-finger touch. The team completed the structural anchoring with proper laser leveling and heavy duty German hardware. Top quality MS steel fabrication.',
    featured: true,
    published: true
  },
  {
    id: 'test-3',
    name: 'Malik Faisal',
    location: 'DHA Phase 2, Islamabad',
    rating: 5,
    projectType: 'Frameless Glass & Steel Balcony Railing (MFR-002)',
    text: 'Master craftsmanship and durable powder coating. The entire villa boundary grills, spiral stairs, and 60 running feet of tempered glass railings were installed on schedule.',
    featured: true,
    published: true
  },
  {
    id: 'test-4',
    name: 'Dr. Hamza Ali (Overseas Client)',
    location: 'Gulberg Greens, Islamabad / Dubai UAE',
    rating: 5,
    projectType: 'Turnkey Luxury Villa Fabrication Package',
    text: 'I ordered everything from Dubai for my villa in Gulberg Greens. Daily WhatsApp progress photos and live video inspections gave me total peace of mind. Excellent execution.',
    featured: true,
    published: true
  },
  {
    id: 'test-5',
    name: 'Nawabzada Haroon',
    location: 'Model Town, Lahore',
    rating: 5,
    projectType: 'Classical Hand-Forged Wrought Iron Estate Gate (MFG-003)',
    text: 'True artisan craftsmanship. The hand-forged scrolls, solid knuckles, and antique bronze patina look majestic on our classical residence facade. Highly recommended.',
    featured: true,
    published: true
  },
  {
    id: 'test-6',
    name: 'Architect Daniyal Hassan',
    location: 'DHA Phase 6, Lahore',
    rating: 5,
    projectType: 'Aluminum & Steel Glass Partition Facade (MFG-010)',
    text: 'As an architect, finding a steel fabricator who respects millimetric tolerances is rare. Mughal Steel Fabrication has become our primary contractor for luxury residential and commercial developments.',
    featured: true,
    published: true
  }
];

export const SEED_PROJECTS = [
  {
    id: 'proj-gulberg-greens',
    title: 'GULBERG GREENS FARMHOUSE - MASTER METALWORK',
    slug: 'gulberg-greens-farmhouse',
    category: 'Modern Farmhouse',
    image: '/mughal-luxury-architectural-villa.jpg',
    galleryImages: [
      '/mughal-luxury-architectural-villa.jpg',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDescription: 'Executed Entirely by Mughal Steel Fabrication: Grand entrance gates, custom fencing, precision structural framework, architectural stairs & aluminum works.',
    description: `GULBERG GREENS FARMHOUSE\nExecuted Entirely by Mughal Steel Fabrication\n\nWrought & Cast Iron Work: Grand entrance gates, custom fencing, and ornamental details crafted with perfection.\n\nPrecision Steel & Pipe Works: High-strength structural framework and heavy-duty fabrication.\n\nCustom Staircases: Elegant and durable modern architectural stairs.\n\nArchitectural Aluminum Work: Premium-grade windows and fittings.\n\nExperience total perfection in metalwork and construction with Mughal Steel Fabrication, Rawalpindi.`,
    location: 'Gulberg Greens, Islamabad',
    projectType: 'Turnkey Farmhouse Architectural Metalwork & Fabrication',
    clientType: 'Private Luxury Farmhouse Estate',
    completedDate: 'Completed',
    status: 'Completed',
    featured: true,
    youtubeId: 'YHK1SWPQpoA',
    specs: {
      steelGrade: 'High-Tensile Structural MS & Ornamental Cast Iron',
      gauge: '12-Gauge (2.5mm) & 14-Gauge (2.0mm) Structural Pipes',
      finish: 'Multi-Stage Zinc Primer & Electrostatic Matte Finish',
      automation: 'Automated Italian Sliding Gate Motor System',
      span: 'Custom Double-Height Entrance & Perimeter Fencing'
    },
    deliverables: [
      'Wrought & Cast Iron Work: Grand entrance gates, custom fencing, and ornamental details crafted with perfection',
      'Precision Steel & Pipe Works: High-strength structural framework and heavy-duty fabrication',
      'Custom Staircases: Elegant and durable modern architectural stairs',
      'Architectural Aluminum Work: Premium-grade windows and fittings',
      'Complete On-Site Laser Surveying, Anchoring & Final Handover'
    ]
  },
  {
    id: 'proj-1',
    title: 'DHA Phase 6 Luxury Villa Elevation',
    category: 'Modern Home',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    description: 'Complete fabrication package including 14ft CNC laser gate (MFG-001), 60 running feet of frameless glass balcony railings, and exterior boundary louvers.',
    location: 'Lahore, Pakistan',
    completedDate: 'May 2026'
  },
  {
    id: 'proj-2',
    title: 'F-7 Islamabad Classical Heritage Estate',
    category: 'Classical Home',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    description: 'Custom hand-forged 16ft double arch driveway gate with antique bronze patina and solid cast knuckles.',
    location: 'Islamabad, Pakistan',
    completedDate: 'April 2026'
  },
  {
    id: 'proj-3',
    title: 'Palm City Grand Society Gateway',
    category: 'Housing Society',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    description: '36-foot wide automated monumental entrance barrier with separate pedestrian biometric lanes.',
    location: 'Sialkot, Pakistan',
    completedDate: 'June 2026'
  },
  {
    id: 'proj-4',
    title: 'Gulberg Corporate Plaza Cantilever Gate',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    description: 'Heavy duty commercial automated sliding gate with emergency fire egress spiral staircases.',
    location: 'Lahore, Pakistan',
    completedDate: 'March 2026'
  },
  {
    id: 'proj-5',
    title: 'Bedian Road Modern Farmhouse Retreat',
    category: 'Modern Farmhouse',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    description: 'Black steel ranch boundary gates, sliding glass barn doors, and terrace cross-buck railings.',
    location: 'Bedian Road, Lahore',
    completedDate: 'June 2026'
  },
  {
    id: 'proj-6',
    title: 'Bahria Enclave Slimline Villa',
    category: 'Small Villa',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    description: 'Space-saving bi-fold steel gate with integrated wicket door and modern minimal window grilles.',
    location: 'Islamabad, Pakistan',
    completedDate: 'July 2026'
  }
];

export const SEED_SERVICES = [
  {
    id: 'serv-1',
    title: 'Custom Steel Gates & Main Entrances',
    icon: 'DoorClosed',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: 'Custom designed sliding, swing, bi-fold, and telescopic gates built with heavy gauge structural pipes, CNC laser plates, and automated motor systems.',
    features: ['CNC Laser Cut Precision', 'Automation Motor Ready', 'Anti-Corrosion Zinc Undercoat', '10-Year Structural Integrity']
  },
  {
    id: 'serv-2',
    title: 'Wrought Iron Artisan Craftsmanship',
    icon: 'Hammer',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    description: 'Authentic hand-forged classical scrolls, rosettes, spear finials, and heavy decorative balustrades created by master blacksmith artisans.',
    features: ['Solid Carbon Steel Bars', 'Hand-Hammered Scrollwork', 'Antiqued Gold & Bronze Finishes', 'Custom Family Monograms']
  },
  {
    id: 'serv-3',
    title: 'Architectural Stairs & Floating Spines',
    icon: 'Layers',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80',
    description: 'Modern central mono-stringer floating stairs, cantilevered steps, spiral staircases, and heavy commercial fire-escape structures.',
    features: ['Engineered Structural Load Proof', 'Solid Wood Tread Integration', 'Concealed Wall Anchors', 'Glass / Cable Balustrades']
  },
  {
    id: 'serv-4',
    title: 'Stainless Steel & Glass Balustrades',
    icon: 'Shield',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    description: 'Frameless 12mm tempered safety glass balconies, stainless steel 304 railings, and architectural terrace barrier systems.',
    features: ['Grade 304 / 316 Stainless Steel', '12mm Laminated Safety Glass', 'Wind Load Certified', 'Concealed U-Channel Mounts']
  },
  {
    id: 'serv-5',
    title: 'Aluminum & Glass Facades & Partitions',
    icon: 'Maximize2',
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=800&q=80',
    description: 'Thermal-break aluminum pivot doors, floor-to-ceiling interior partitions, soundproof double-glazed window frames, and glass skylights.',
    features: ['Thermal-Break Insulation', 'Acoustic Soundproofing 42dB', 'Ultra-Slim Sightlines', 'Heavy Pivot Hinges']
  },
  {
    id: 'serv-6',
    title: 'Structural Steel Sheds & Heavy Fabrication',
    icon: 'Factory',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    description: 'Industrial warehouse trusses, agricultural sheds, car parking tensile canopies, and custom structural steel frameworks.',
    features: ['Certified Coded Welders', 'Heavy I-Beam & H-Beam Trusses', 'Hot-Dip Galvanizing Option', 'On-Site Crane Erection']
  }
];

export const SEED_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'How to Choose the Right Gate for Your 10 Marla & 1 Kanal Home',
    slug: 'choose-right-gate-for-home',
    author: 'Mughal Steel Engineering Team',
    date: '2026-07-20',
    featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Comparing sliding vs swing vs bi-fold gates based on car parking clearance, elevation aesthetics, and automation motor options.',
    content: '<h2>Choosing Between Sliding, Swing & Bi-Fold Gates</h2><p>Your front main gate is the first statement of your home. When choosing a gate design, two key factors come into play: available driveway depth and your architectural style. For 5 Marla and 10 Marla homes where two cars are parked in the porch, a modern telescopic or bi-fold gate saves up to 50% of the opening clearance space.</p>',
    category: 'Buyer Guide'
  },
  {
    id: 'blog-2',
    title: 'Why Laser-Cut CNC Steel Gates Are Dominating Modern Architecture',
    slug: 'why-laser-cut-cnc-steel-gates-dominate',
    author: 'Chief Metallurgist, Mughal Steel',
    date: '2026-06-15',
    featuredImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    excerpt: 'How CNC fiber laser cutting allows for millimeter precision, custom privacy ratios, and durable architectural steel facade accents.',
    content: '<h2>The Precision of Fiber Laser Cutting</h2><p>Unlike traditional manual welding of hollow pipes, modern CNC fiber laser cutting processes 3mm to 6mm thick solid steel sheets with zero burrs and microscopic accuracy. This allows homeowners to customize privacy levels while incorporating geometric and Islamic motifs seamlessly into their building facade.</p>',
    category: 'Technology'
  }
];

export const SEED_GALLERY = [
  { id: 'gal-1', title: 'DHA Lahore Modern Laser Gate', category: 'Modern Home', style: 'Modern', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 'gal-2', title: 'Islamabad Classical Arch Wrought Iron', category: 'Classical Home', style: 'Classical', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80' },
  { id: 'gal-3', title: 'Stainless Steel & Glass Balcony Balustrade', category: 'Modern Home', style: 'Minimal', image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80' },
  { id: 'gal-4', title: 'Mono Stringer Floating Staircase', category: 'Modern Home', style: 'Architectural', image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80' },
  { id: 'gal-5', title: 'Commercial Cantilever Automatic Gate', category: 'Commercial', style: 'Industrial', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80' },
  { id: 'gal-6', title: 'Modern Farmhouse Sonoma Gate', category: 'Modern Farmhouse', style: 'Rustic Modern', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' }
];

export const SEED_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Muhammad Qasim',
    role: 'Founder & Managing Director',
    image: '/image/team-1.jpg',
    bio: 'Founder and executive head leading Mughal Steel Fabrication with over 15 years of precision metal engineering and craftsmanship.',
    displayOrder: 1,
    published: true
  },
  {
    id: 'team-2',
    name: 'Engr. Arsalan Mughal',
    role: 'Head of Structural Engineering',
    image: '/image/team-2.jpg',
    bio: 'Specialist in 3D CAD modeling, structural load calculations, and computer-guided fiber CNC laser cutting standards.',
    displayOrder: 2,
    published: true
  },
  {
    id: 'team-3',
    name: 'Ustad Rashid Khan',
    role: 'Master Blacksmith & Forge Supervisor',
    image: '/image/team-3.jpg',
    bio: 'Directs on-floor forge operations, traditional hand-beaten wrought iron scrolls, and multi-stage anti-rust primer coatings.',
    displayOrder: 3,
    published: true
  },
  {
    id: 'team-4',
    name: 'Hamza Tariq Mughal',
    role: 'Operations & Site Installation Director',
    image: '/image/team-4.jpg',
    bio: 'Oversees site civil surveys, laser alignment installations, automated motor commissioning, and client site handovers.',
    displayOrder: 4,
    published: true
  },
  {
    id: 'team-5',
    name: 'Bilal Ahmed',
    role: 'CNC Laser & Architectural Metal Designer',
    image: '/image/team-5.jpg',
    bio: 'Leads computational CNC fiber laser sheet cutting, parametric gate patterns, and precision CAD architectural detailing.',
    displayOrder: 5,
    published: true
  },
  {
    id: 'team-6',
    name: 'Zain Ul Abideen',
    role: 'Metallurgic QA & Powder Coating Specialist',
    image: '/image/team-6.jpg',
    bio: 'Directs multi-stage chemical rust protection, 200°C electrostatic powder coat curing, and structural weld inspection.',
    displayOrder: 6,
    published: true
  }
];

export const SEED_PROJECT_SHOWCASES: ProjectShowcaseItem[] = [
  {
    id: 'proj-showcase-1',
    title: '1 Kanal Luxury Residence - Faisalabad',
    category: 'Modern Home',
    location: 'Canal Road, Faisalabad',
    clientType: 'Private Luxury Villa',
    gaugeSpec: '14-Gauge MS & ±0.1mm CNC Fiber Laser',
    finishSpec: 'Matte Jet-Black Electrostatic Powder Coat (200°C)',
    deliverables: 'Main Driveway Gate, Boundary Wall Grills, Balcony Railings, Spiral Stairs',
    status: 'completed',
    statusLabel: '',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    link: '/portfolio',
    displayOrder: 1
  },
  {
    id: 'proj-showcase-2',
    title: 'Gulberg Greens Modern Farmhouse',
    category: 'Modern Farmhouse',
    location: 'Gulberg Greens, Islamabad',
    clientType: 'Country Estate & Farmhouse',
    gaugeSpec: 'Schedule 40 Galvanized Heavy MS Pipes',
    finishSpec: 'Triple Hot-Zinc Chemical Primer & Protective Powder Coat',
    deliverables: 'Grand Entrance Gate, 1,200 RFT Security Fencing, Custom Porch Pergola',
    status: 'completed',
    statusLabel: '',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    link: '/portfolio',
    displayOrder: 2
  },
  {
    id: 'proj-showcase-3',
    title: 'National Defence University (NDU) Handover',
    category: 'Housing Society',
    location: 'Sector E-9, Islamabad',
    clientType: 'Institutional & High-Security',
    gaugeSpec: '12-Gauge Heavy Mild Steel Structural Channels',
    finishSpec: 'Anti-Rust Zinc-Rich Epoxy Coating',
    deliverables: 'Heavy Guarded Security Gates, Pedestrian Turnstiles, Automated Barriers',
    status: 'completed',
    statusLabel: '',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    link: '/portfolio',
    displayOrder: 3
  },
  {
    id: 'proj-showcase-4',
    title: 'Bahria Town Modern Villa Main Gate',
    category: 'Small Villa',
    location: 'Bahria Town Phase 7, Rawalpindi',
    clientType: 'Residential Bungalow',
    gaugeSpec: '14-Gauge CNC Geometric Laser Cut MS',
    finishSpec: 'Charcoal Grey Electrostatic Powder Coat',
    deliverables: 'Automated Sliding Gate with Italian Motor, Frameless Glass Balconies',
    status: 'completed',
    statusLabel: '',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    link: '/portfolio',
    displayOrder: 4
  },
  {
    id: 'proj-showcase-5',
    title: 'Classical Arch Spanish Kothi',
    category: 'Classical Home',
    location: 'DHA Phase 2, Islamabad',
    clientType: 'Classical Heritage Villa',
    gaugeSpec: 'Solid Hand-Forged Carbon Steel (20mm solid bars)',
    finishSpec: 'Hand-Rubbed Antique Roman Bronze & Gold Leaf Accents',
    deliverables: 'Arched Double Wrought Iron Driveway Gate, Curved Balustrades',
    status: 'completed',
    statusLabel: '',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    link: '/portfolio',
    displayOrder: 5
  },
  {
    id: 'proj-showcase-6',
    title: 'Oversized Pivot Door Installation',
    category: 'Aluminum & Glass',
    location: 'Sector F-7/2, Islamabad',
    clientType: 'Contemporary Architect Villa',
    gaugeSpec: '6063-T6 Thermal-Break Profile with 12mm Acoustic Glass',
    finishSpec: 'Deep Matte Anodized Architectural Black',
    deliverables: '5x10 ft Hydraulic Floor-Spring Pivot Entrance Door & Laser Leveling',
    status: 'ongoing',
    statusLabel: '',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80',
    link: '/portfolio',
    displayOrder: 6
  },
  {
    id: 'proj-showcase-7',
    title: 'Commercial Plaza Glass & Steel Sub-Frame',
    category: 'Commercial',
    location: 'Sector G-13 Markaz, Islamabad',
    clientType: 'Commercial Corporate Plaza',
    gaugeSpec: 'Heavy I-Beam & Structural Channel Portal Trusses',
    finishSpec: 'AkzoNobel High-Endurance Powder Coat',
    deliverables: 'Multi-Storey Glass Curtain Sub-Frame, Fire Spiral Escape Stairs',
    status: 'ongoing',
    statusLabel: '',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    link: '/portfolio',
    displayOrder: 7
  },
  {
    id: 'proj-showcase-8',
    title: 'High-Security Double Gate & Perimeter Spikes',
    category: 'Village House',
    location: 'Naval Anchorage, Islamabad',
    clientType: 'Private Residence Estate',
    gaugeSpec: '12-Gauge Thick Cold-Rolled Mild Steel',
    finishSpec: '7-Stage Chemical Pre-Treatment & Powder Oven Baked',
    deliverables: 'Heavy Automated Swing Gate, 180 RFT Laser Precision Anti-Climb Spikes',
    status: 'ongoing',
    statusLabel: '',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    link: '/portfolio',
    displayOrder: 8
  }
];

export const SEED_WHAT_IS_YOUR_PROJECT: WhatIsYourProjectItem[] = [
  {
    id: 'wip-modern-home',
    category: 'Modern Home',
    title: 'Modern Architecture & CNC Laser Works',
    tagline: 'Clean lines, laser-cut geometry & minimalist architecture',
    description: 'Sleek architectural steelwork tailored for contemporary urban residences with fiber laser cutting.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    itemsCount: 12,
    primaryItem: 'Front Gate',
    gaugeSpec: '14-Gauge MS & ±0.1mm CNC Fiber Laser',
    finishSpec: 'Matte Jet-Black Electrostatic Powder Coat (200°C)',
    deliverables: 'Main Driveway Gate, Boundary Wall Grills, Balcony Railings, Spiral Stairs',
    location: 'DHA Phase 2, Islamabad',
    status: 'completed',
    statusLabel: 'Completed & Handed Over',
    subcategories: [
      {
        id: 'wip-sub-mh-front-gate',
        title: 'Front Gate',
        slug: 'front-gate',
        description: 'Modern driveway and pedestrian main gates with CNC laser cutting, concealed hinges, and automation prep.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 1,
        active: true,
        designs: [
          {
            id: 'wip-des-mh-g01',
            title: 'Metropolis CNC Laser-Cut Geometric Main Gate',
            subcategoryId: 'wip-sub-mh-front-gate',
            subcategory: 'Front Gate',
            productCode: 'MSF-MH-G01',
            associatedProductCode: 'MFG-G001',
            description: 'Heavy 14-gauge cold-rolled mild steel main entrance gate featuring parametric laser-cut geometry and an integrated wicket pass door.',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            images: [
              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
              'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
            ],
            pricePerSqFt: 2500,
            basePrice: 130000,
            gaugeSpec: '14-Gauge (2.0mm) Cold-Rolled Sheet & 2x4 Tube',
            finishSpec: 'Jet-Black Matte Electrostatic Powder Coat (200°C)',
            materials: ['Mild Steel Structural Box Pipe', 'CNC Fiber Laser Plate'],
            finishes: ['Matte Black Powder Coat', 'Charcoal Metallic', 'Rust-Inhibitive Primer'],
            customizationOptions: ['Custom Driveway Size', 'Custom Laser Cut Motif', 'Custom Powder Color', 'German Motor Automation']
          },
          {
            id: 'wip-des-mh-g02',
            title: 'Minimalist Horizontal Steel Louver Driveway Gate',
            subcategoryId: 'wip-sub-mh-front-gate',
            subcategory: 'Front Gate',
            productCode: 'MSF-MH-G02',
            associatedProductCode: 'MFG-G002',
            description: 'Aerodynamic horizontal steel louver gate providing 100% privacy with wind-relief ventilation for wide suburban driveways.',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
            images: [
              'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
            ],
            pricePerSqFt: 2650,
            basePrice: 145000,
            gaugeSpec: '14-Gauge Aerodynamic Hollow Sections',
            finishSpec: 'Dual-Stage Zinc Phosphate & Anthracite Grey Powder Coat',
            materials: ['Cold-Rolled Louver Profiles', 'Heavy Duty Ball Bearing Hinges'],
            finishes: ['Anthracite Grey', 'Matte Black', 'Dark Bronze'],
            customizationOptions: ['Custom Driveway Size', 'Custom Powder Color', 'Italian Automation Kit']
          },
          {
            id: 'wip-des-mh-g03',
            title: 'Modernist Cantilever Double Swing Steel Gate',
            subcategoryId: 'wip-sub-mh-front-gate',
            subcategory: 'Front Gate',
            productCode: 'MSF-MH-G03',
            associatedProductCode: 'MFG-G001',
            description: 'Contemporary double-leaf architectural gate with asymmetric vertical steel blades and flush handle integration.',
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 2800,
            basePrice: 160000,
            gaugeSpec: '12-Gauge Structural Frame & 14-Gauge Blades',
            finishSpec: 'High-Durability Textured Black Powder Coat'
          }
        ]
      },
      {
        id: 'wip-sub-mh-front-balcony',
        title: 'Front Balcony',
        slug: 'front-balcony',
        description: 'Modern front facade balcony railings with glass, stainless steel spigots, and laser-cut safety panels.',
        image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 2,
        active: true,
        designs: [
          {
            id: 'wip-des-mh-b01',
            title: 'Horizon Frameless Tempered Glass Front Balcony',
            subcategoryId: 'wip-sub-mh-front-balcony',
            subcategory: 'Front Balcony',
            productCode: 'MSF-MH-B01',
            associatedProductCode: 'MFG-R001',
            description: '12mm clear toughened safety glass with SS-304 heavy solid spigot clamps and minimalist stainless steel top channel.',
            image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 2200,
            basePrice: 65000,
            gaugeSpec: '12mm Toughened Glass & SS-304 Hardware',
            finishSpec: 'Satin Brushed Stainless Steel & Clear Safety Glass'
          },
          {
            id: 'wip-des-mh-b02',
            title: 'Modernist CNC Laser Privacy Balcony Railing',
            subcategoryId: 'wip-sub-mh-front-balcony',
            subcategory: 'Front Balcony',
            productCode: 'MSF-MH-B02',
            associatedProductCode: 'MFG-R001',
            description: 'Architectural laser-cut steel fretwork panel railing offering private terrace protection with seamless curb mounting.',
            image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 2400,
            basePrice: 75000,
            gaugeSpec: '3mm Solid CNC Laser Sheet & 2-inch Box Pipe',
            finishSpec: 'Matte Black Polyester Powder Coat'
          }
        ]
      },
      {
        id: 'wip-sub-mh-spiral-stairs',
        title: 'Spiral Stairs',
        slug: 'spiral-stairs',
        description: 'Architectural steel spiral staircases engineered for compact exterior or interior multi-floor transitions.',
        image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 3,
        active: true,
        designs: [
          {
            id: 'wip-des-mh-s01',
            title: 'Helix Floating Center-Pole Spiral Staircase',
            subcategoryId: 'wip-sub-mh-spiral-stairs',
            subcategory: 'Spiral Stairs',
            productCode: 'MSF-MH-SS01',
            associatedProductCode: 'MFG-R002',
            description: 'Precision engineered central structural column with laser-cut cantilevered treads, curved steel stringers, and smooth handrail.',
            image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 3200,
            basePrice: 190000,
            gaugeSpec: '8-inch Central Structural Pipe & 5mm Checkered Plate',
            finishSpec: 'Textured Charcoal Metallic Powder Coat'
          },
          {
            id: 'wip-des-mh-s02',
            title: 'Contemporary Curved Helical Steel Staircase',
            subcategoryId: 'wip-sub-mh-spiral-stairs',
            subcategory: 'Spiral Stairs',
            productCode: 'MSF-MH-SS02',
            associatedProductCode: 'MFG-R002',
            description: 'Double-stringer helical curved steel stairs with open riser profiles for modern rooftop or mezzanine access.',
            image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 3500,
            basePrice: 220000,
            gaugeSpec: 'Heavy 10mm Laser Cut Stringers',
            finishSpec: 'Epoxy Enamel & Anti-Slip Tread Texture'
          }
        ]
      },
      {
        id: 'wip-sub-mh-back-stairs',
        title: 'Back Side Stairs',
        slug: 'back-side-stairs',
        description: 'Durable, weather-resistant service and utility staircases for secondary access and rooftop maintenance.',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 4,
        active: true,
        designs: [
          {
            id: 'wip-des-mh-bs01',
            title: 'Heavy Duty Straight Run Service Staircase',
            subcategoryId: 'wip-sub-mh-back-stairs',
            subcategory: 'Back Side Stairs',
            productCode: 'MSF-MH-BSS01',
            associatedProductCode: 'MFG-R002',
            description: 'Heavy C-channel stringers with diamond-plate anti-slip treads and continuous safety handrails designed for exterior longevity.',
            image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 1950,
            basePrice: 115000,
            gaugeSpec: '6x2-inch Heavy C-Channel & 4mm Diamond Plate',
            finishSpec: 'Zinc-Rich Anti-Rust Primer & Industrial Top Coat'
          },
          {
            id: 'wip-des-mh-bs02',
            title: 'Galvanized Weatherproof Outdoor Fire Escape',
            subcategoryId: 'wip-sub-mh-back-stairs',
            subcategory: 'Back Side Stairs',
            productCode: 'MSF-MH-BSS02',
            associatedProductCode: 'MFG-R002',
            description: 'Hot-dip galvanized structural stairs with grating treads to prevent water accumulation and rust during monsoon seasons.',
            image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 2150,
            basePrice: 135000,
            gaugeSpec: 'Hot-Dip Galvanized Structural Steel',
            finishSpec: 'Industrial HDG 85-Micron Protective Zinc'
          }
        ]
      },
      {
        id: 'wip-sub-mh-balcony-railings',
        title: 'Balcony Railings',
        slug: 'balcony-railings',
        description: 'Architectural safety railings for perimeter terraces, verandas, and exterior balconies.',
        image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 5,
        active: true,
        designs: [
          {
            id: 'wip-des-mh-br01',
            title: 'Slimline Vertical Picket Balcony Railing',
            subcategoryId: 'wip-sub-mh-balcony-railings',
            subcategory: 'Balcony Railings',
            productCode: 'MSF-MH-BR01',
            associatedProductCode: 'MFG-R001',
            description: 'Minimalist vertical steel balusters spaced at child-safe 4-inch centers with sleek rectangular top rail.',
            image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 1750,
            basePrice: 48000,
            gaugeSpec: '1-inch Solid Hollow Section Spindles & 2x1 Rail',
            finishSpec: 'Matte Jet Black Electrostatic Powder Coating'
          },
          {
            id: 'wip-des-mh-br02',
            title: 'Geometric Box Frame Architectural Railing',
            subcategoryId: 'wip-sub-mh-balcony-railings',
            subcategory: 'Balcony Railings',
            productCode: 'MSF-MH-BR02',
            associatedProductCode: 'MFG-R001',
            description: 'Alternating geometric box section railing creating modern depth and shadow lines across residential facades.',
            image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 1900,
            basePrice: 55000,
            gaugeSpec: '14-Gauge Cold-Rolled Square Steel Tubing',
            finishSpec: 'Charcoal Grey Textured Finish'
          }
        ]
      },
      {
        id: 'wip-sub-mh-indoor-railings',
        title: 'Indoor Railings',
        slug: 'indoor-railings',
        description: 'Interior staircases and mezzanine railings with fine architectural finishing and wooden top-cap integration.',
        image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 6,
        active: true,
        designs: [
          {
            id: 'wip-des-mh-ir01',
            title: 'Monolithic Interior Glass Clamped Stair Railing',
            subcategoryId: 'wip-sub-mh-indoor-railings',
            subcategory: 'Indoor Railings',
            productCode: 'MSF-MH-IR01',
            associatedProductCode: 'MFG-R001',
            description: 'Side-mounted stainless steel standoff pins with 12mm extra-clear tempered glass and solid oak wooden handrail.',
            image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 2300,
            basePrice: 72000,
            gaugeSpec: '12mm Clear Glass & SS-304 Standoff Pins',
            finishSpec: 'Brushed Satin Nickel & Hardwood Top Cap'
          },
          {
            id: 'wip-des-mh-ir02',
            title: 'Minimalist Continuous Flat-Bar Handrail',
            subcategoryId: 'wip-sub-mh-indoor-railings',
            subcategory: 'Indoor Railings',
            productCode: 'MSF-MH-IR02',
            associatedProductCode: 'MFG-R002',
            description: 'Ultra-thin continuous flat steel balusters welded flush into step brackets for minimalist loft aesthetics.',
            image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 2100,
            basePrice: 62000,
            gaugeSpec: '40x8mm Solid Cold-Rolled Flat Steel Bar',
            finishSpec: 'Smooth Velvet Black Epoxy Coating'
          }
        ]
      }
    ]
  },
  {
    id: 'wip-housing-society',
    category: 'Housing Society',
    title: 'Housing Society Infrastructure & Grand Gates',
    tagline: 'Grand entrance gates, perimeter security & community infrastructure',
    description: 'Monumental society entrances, automated boom barriers, boundary wall spike grills, and durable park steel fabrications.',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    itemsCount: 8,
    primaryItem: 'Front Gate',
    gaugeSpec: '12-Gauge Heavy Mild Steel Structural Channels',
    finishSpec: 'Multi-Stage Zinc Primer & Epoxy Coating',
    deliverables: 'Monumental Society Entrance, Security Spikes, Park Railings',
    location: 'Islamabad / Rawalpindi',
    status: 'completed',
    statusLabel: 'Completed & Handed Over',
    subcategories: [
      {
        id: 'wip-sub-hs-entrance-gates',
        title: 'Front Gate',
        slug: 'front-gate',
        description: 'Monumental society entrance archways, multi-lane security gates, and heavy automated barriers.',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 1,
        active: true,
        designs: [
          {
            id: 'wip-des-hs-1',
            title: 'Monumental Society Entrance Gate',
            subcategoryId: 'wip-sub-hs-entrance-gates',
            subcategory: 'Front Gate',
            productCode: 'MSF-HS-G01',
            associatedProductCode: 'MFG-G001',
            description: 'Monumental automated double swing entrance with heavy steel portal frame and integrated security cabin framing.',
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 3200,
            basePrice: 280000,
            gaugeSpec: '12-Gauge Heavy Structural Channels',
            finishSpec: 'Zinc-Rich Anti-Rust Primer & Epoxy Enamel'
          },
          {
            id: 'wip-des-hs-2',
            title: 'Commercial Multi-Lane Security Check Gate',
            subcategoryId: 'wip-sub-hs-entrance-gates',
            subcategory: 'Front Gate',
            productCode: 'MSF-HS-G02',
            associatedProductCode: 'MFG-G002',
            description: 'Automated sliding steel barrier gate with high-speed Italian motor and RFID vehicle sensor integration.',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 3400,
            basePrice: 320000,
            gaugeSpec: 'Heavy I-Beam & C-Channel Framing',
            finishSpec: 'Industrial Epoxy Primer & Highway Safety Yellow/Black'
          }
        ]
      },
      {
        id: 'wip-sub-hs-boundary-grills',
        title: 'Boundary Wall Grills',
        slug: 'boundary-wall-grills',
        description: 'Perimeter security spike grills and continuous anti-climb wall toppings.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 2,
        active: true,
        designs: [
          {
            id: 'wip-des-hs-3',
            title: 'Laser-Cut Continuous Anti-Climb Security Spikes',
            subcategoryId: 'wip-sub-hs-boundary-grills',
            subcategory: 'Boundary Wall Grills',
            productCode: 'MSF-HS-W01',
            associatedProductCode: 'MFG-W001',
            description: 'Continuous laser-cut serrated steel teeth engineered for perimeter boundary security with concrete anchor brackets.',
            image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 1500,
            basePrice: 45000,
            gaugeSpec: '3mm Solid Laser Cut Steel Teeth',
            finishSpec: 'Hot-Dip Galvanized & Black Powder Coat'
          },
          {
            id: 'wip-des-hs-4',
            title: 'High-Security Palisade Perimeter Wall Grate',
            subcategoryId: 'wip-sub-hs-boundary-grills',
            subcategory: 'Boundary Wall Grills',
            productCode: 'MSF-HS-W02',
            associatedProductCode: 'MFG-W002',
            description: 'Heavy duty vertical steel palisade pales with triple-pointed spear tops for perimeter property fencing.',
            image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 1650,
            basePrice: 52000,
            gaugeSpec: 'Schedule 40 Solid Round & Square MS Bars',
            finishSpec: 'Dual Protective Coat & Weatherproof Enamel'
          }
        ]
      },
      {
        id: 'wip-sub-hs-park-railings',
        title: 'Balcony & Park Railings',
        slug: 'park-railings',
        description: 'Child-safe public park railings, jogging track guardrails, and decorative boulevard fencing.',
        image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 3,
        active: true,
        designs: [
          {
            id: 'wip-des-hs-5',
            title: 'Community Park Safe-Edge Guardrails',
            subcategoryId: 'wip-sub-hs-park-railings',
            subcategory: 'Balcony & Park Railings',
            productCode: 'MSF-HS-PR01',
            associatedProductCode: 'MFG-R001',
            description: 'Heavy duty all-weather public park railings with smooth child-safe edge profiles.',
            image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 1850,
            basePrice: 58000,
            gaugeSpec: 'Schedule 40 Heavy MS Pipes',
            finishSpec: 'Electrostatic Polyester Powder Coating'
          }
        ]
      },
      {
        id: 'wip-sub-hs-sheds',
        title: 'Sheds & Guard Canopies',
        slug: 'sheds-and-canopies',
        description: 'Engineered steel trusses, vehicular inspection shelters, and guard check-post canopies.',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 4,
        active: true,
        designs: [
          {
            id: 'wip-des-hs-6',
            title: 'Security Gate House Canopy & Shed',
            subcategoryId: 'wip-sub-hs-sheds',
            subcategory: 'Sheds & Guard Canopies',
            productCode: 'MSF-HS-SC01',
            associatedProductCode: 'MFG-G002',
            description: 'Engineered steel truss canopy and cantilevered vehicular check-post shelter.',
            image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 2900,
            basePrice: 185000,
            gaugeSpec: 'Heavy I-Beam & C-Channel Structural Trusses',
            finishSpec: 'Marine Grade Industrial Coating'
          }
        ]
      }
    ]
  },
  {
    id: 'wip-classical-home',
    category: 'Classical Home',
    title: 'Classical Heritage Wrought Iron Works',
    tagline: 'Timeless wrought iron craftsmanship, scrollwork & royal crests',
    description: 'Hand-forged ornamental wrought iron gates, classical balustrades, cast brass accents, and archway doors.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    itemsCount: 6,
    primaryItem: 'Front Gate',
    gaugeSpec: 'Solid Hand-Forged Carbon Steel (20mm solid bars)',
    finishSpec: 'Hand-Rubbed Antique Roman Bronze & Gold Leaf Accents',
    deliverables: 'Arched Double Wrought Iron Driveway Gate, Curved Balustrades',
    location: 'Sector F-7, Islamabad',
    status: 'completed',
    statusLabel: 'Completed & Handed Over',
    subcategories: [
      {
        id: 'wip-sub-ch-driveway-gates',
        title: 'Front Gate',
        slug: 'front-gate',
        description: 'Hand-beaten hot-forged ornamental scrollwork gates with solid spear finials and royal crests.',
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 1,
        active: true,
        designs: [
          {
            id: 'wip-des-ch-1',
            title: 'Arched Wrought Iron Royal Driveway Gate',
            subcategoryId: 'wip-sub-ch-driveway-gates',
            subcategory: 'Front Gate',
            productCode: 'MSF-CH-G01',
            associatedProductCode: 'MFG-G002',
            description: 'Hand-beaten hot-forged ornamental scrollwork with solid spear finials and classical leaf crests.',
            image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 3600,
            basePrice: 260000,
            gaugeSpec: '20mm Solid Forged Square Bars',
            finishSpec: 'Antique Roman Bronze & Gold Leaf Accents'
          },
          {
            id: 'wip-des-ch-2',
            title: 'Baroque Hand-Forged Double Arched Gate',
            subcategoryId: 'wip-sub-ch-driveway-gates',
            subcategory: 'Front Gate',
            productCode: 'MSF-CH-G02',
            associatedProductCode: 'MFG-G002',
            description: 'Classical Baroque floral crests and hand-forged C-scrolls with heavy solid steel decorative posts.',
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 3800,
            basePrice: 295000,
            gaugeSpec: 'Solid Hand-Forged Carbon Steel',
            finishSpec: 'Multi-Stage Zinc Primer & Hand-Rubbed Patina'
          }
        ]
      },
      {
        id: 'wip-sub-ch-balcony',
        title: 'Front Balcony',
        slug: 'front-balcony',
        description: 'Classical forged iron balustrades with cast brass rosettes, molded handrails, and curved returns.',
        image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 2,
        active: true,
        designs: [
          {
            id: 'wip-des-ch-3',
            title: 'Classical Heritage Balcony Balustrade',
            subcategoryId: 'wip-sub-ch-balcony',
            subcategory: 'Front Balcony',
            productCode: 'MSF-CH-B01',
            associatedProductCode: 'MFG-R001',
            description: 'Solid forged iron spindles with cast iron knuckles, floral badges, and molded top handrail.',
            image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 2800,
            basePrice: 95000,
            gaugeSpec: '16mm Solid Forged Iron Spindles',
            finishSpec: 'Multi-Stage Zinc Primer & Satin Black Enamel'
          }
        ]
      },
      {
        id: 'wip-sub-ch-stairs',
        title: 'Spiral Stairs',
        slug: 'spiral-stairs',
        description: 'French ornamental curved porch stairs with classical iron scrolls and molded brass caps.',
        image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 3,
        active: true,
        designs: [
          {
            id: 'wip-des-ch-4',
            title: 'French Ornamental Spiral Porch Stairs',
            subcategoryId: 'wip-sub-ch-stairs',
            subcategory: 'Spiral Stairs',
            productCode: 'MSF-CH-S01',
            associatedProductCode: 'MFG-R002',
            description: 'Helical curved wrought iron staircase with hand-forged acanthus leaves and curved brass handrails.',
            image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 3400,
            basePrice: 210000,
            gaugeSpec: 'Solid Forged Treads & Structural Column',
            finishSpec: 'Antique Bronze Enamel with Gold Highlights'
          }
        ]
      }
    ]
  },
  {
    id: 'wip-commercial',
    category: 'Commercial',
    title: 'Commercial Plaza & Industrial Entrances',
    tagline: 'Industrial strength, motorized sliding systems & structural steel',
    description: 'High-traffic commercial entrances, warehouse sliding doors, structural steel mezzanines, and emergency staircases.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    itemsCount: 5,
    primaryItem: 'Front Gate',
    gaugeSpec: 'Heavy I-Beam & Structural Channel Portal Trusses',
    finishSpec: 'AkzoNobel High-Endurance Powder Coat',
    deliverables: 'Multi-Storey Glass Curtain Sub-Frame, Fire Spiral Escape Stairs',
    location: 'Sector G-13 Markaz, Islamabad',
    status: 'completed',
    statusLabel: 'Completed & Handed Over',
    subcategories: [
      {
        id: 'wip-sub-com-gates',
        title: 'Front Gate',
        slug: 'front-gate',
        description: 'High-traffic motorized sliding and cantilever gates for commercial plazas and industrial corporate parks.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 1,
        active: true,
        designs: [
          {
            id: 'wip-des-cm-1',
            title: 'Commercial Plaza Motorized Sliding Gate',
            subcategoryId: 'wip-sub-com-gates',
            subcategory: 'Front Gate',
            productCode: 'MSF-COM-G01',
            associatedProductCode: 'MFG-G001',
            description: 'High-traffic cantilevered motorized sliding gate designed for continuous plaza entrance clearance.',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 3400,
            basePrice: 240000,
            gaugeSpec: 'Heavy Structural Channel & 12-Gauge Infill',
            finishSpec: 'AkzoNobel High-Endurance Industrial Powder Coat'
          }
        ]
      },
      {
        id: 'wip-sub-com-stairs',
        title: 'Spiral Stairs',
        slug: 'spiral-stairs',
        description: 'Certified exterior multi-storey spiral emergency exit staircases with anti-slip perforated treads.',
        image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 2,
        active: true,
        designs: [
          {
            id: 'wip-des-cm-2',
            title: 'Fire Escape Certified Spiral Staircase',
            subcategoryId: 'wip-sub-com-stairs',
            subcategory: 'Spiral Stairs',
            productCode: 'MSF-COM-S01',
            associatedProductCode: 'MFG-R002',
            description: 'Certified exterior multi-storey spiral emergency exit staircase with anti-slip perforated treads.',
            image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 2900,
            basePrice: 175000,
            gaugeSpec: 'Heavy Structural Central Pipe & 5mm Checkered Treads',
            finishSpec: 'Hot-Dip Galvanized & Yellow Safety Enamel'
          }
        ]
      },
      {
        id: 'wip-sub-com-railings',
        title: 'Balcony Railings',
        slug: 'balcony-railings',
        description: 'High-impact commercial crowd control railings and high-traffic stainless steel balustrades.',
        image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 3,
        active: true,
        designs: [
          {
            id: 'wip-des-cm-3',
            title: 'Plaza Security Guardrail & Bollards',
            subcategoryId: 'wip-sub-com-railings',
            subcategory: 'Balcony Railings',
            productCode: 'MSF-COM-R01',
            associatedProductCode: 'MFG-R001',
            description: 'Heavy gauge steel crowd control railings and high-impact perimeter bollards.',
            image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 2300,
            basePrice: 85000,
            gaugeSpec: 'Heavy Stainless Steel SS-304 & Structural MS',
            finishSpec: 'Dual Powder Coat & High Visibility Finish'
          }
        ]
      }
    ]
  },
  {
    id: 'wip-modern-farmhouse',
    category: 'Modern Farmhouse',
    title: 'Modern Farmhouse Gates & Railings',
    tagline: 'Rustic warmth meets industrial steel precision',
    description: 'Modern ranch gates, cross-buck porch railings, oversized sliding barn doors, and black powder-coated perimeter fencing.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    itemsCount: 4,
    primaryItem: 'Front Gate',
    gaugeSpec: 'Schedule 40 Galvanized Heavy MS Pipes',
    finishSpec: 'Triple Hot-Zinc Chemical Primer & Protective Powder Coat',
    deliverables: 'Grand Entrance Gate, 1,200 RFT Security Fencing, Custom Porch Pergola',
    location: 'Gulberg Greens, Islamabad',
    status: 'completed',
    statusLabel: 'Completed & Handed Over',
    subcategories: [
      {
        id: 'wip-sub-mf-gates',
        title: 'Front Gate',
        slug: 'front-gate',
        description: 'Contemporary agrarian estate entrance combining heavy steel boundary frames with natural accents.',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 1,
        active: true,
        designs: [
          {
            id: 'wip-des-mf-1',
            title: 'Modern Ranch Cross-Buck Entrance Gate',
            subcategoryId: 'wip-sub-mf-gates',
            subcategory: 'Front Gate',
            productCode: 'MSF-MF-G01',
            associatedProductCode: 'MFG-G001',
            description: 'Contemporary agrarian estate entrance combining heavy steel boundary frames with natural teak accents.',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 2600,
            basePrice: 155000,
            gaugeSpec: 'Schedule 40 Galvanized Heavy Steel Pipes',
            finishSpec: 'Matte Jet Black Electrostatic Powder Coat'
          }
        ]
      },
      {
        id: 'wip-sub-mf-railings',
        title: 'Balcony Railings',
        slug: 'balcony-railings',
        description: 'Clean X-brace cross-buck safety railing engineered for wrap-around porches and veranda perimeters.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 2,
        active: true,
        designs: [
          {
            id: 'wip-des-mf-2',
            title: 'Farmhouse Cross-Buck Porch Railing',
            subcategoryId: 'wip-sub-mf-railings',
            subcategory: 'Balcony Railings',
            productCode: 'MSF-MF-R01',
            associatedProductCode: 'MFG-R001',
            description: 'Clean X-brace cross-buck safety railing engineered for wrap-around porches and veranda perimeters.',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 2200,
            basePrice: 65000,
            gaugeSpec: '2-inch Solid Square MS Hollow Tubing',
            finishSpec: 'Satin Powder Coat UV-Resistant Finish'
          }
        ]
      }
    ]
  },
  {
    id: 'wip-classical-farmhouse',
    category: 'Classical Farmhouse',
    title: 'Classical Manor Farmhouse Estates',
    tagline: 'Timeless colonial charm, heavy forged gates & expansive boundary grillwork',
    description: 'Colonial style manor gates, wrap-around veranda railings, solid arched entry doors, and estate security fabrications.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    itemsCount: 2,
    primaryItem: 'Front Gate',
    gaugeSpec: '12-Gauge Box Pipe & Solid 16mm Square Bars',
    finishSpec: 'Textured Bronze Electrostatic Powder Coat',
    deliverables: 'Colonial Main Entrance Gate, Veranda Balustrades',
    location: 'Chak Shahzad, Islamabad',
    status: 'completed',
    statusLabel: 'Completed & Handed Over',
    subcategories: [
      {
        id: 'wip-sub-cf-gates',
        title: 'Front Gate',
        slug: 'front-gate',
        description: 'Colonial style estate driveway gates with arched cresting and heavy forged finials.',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 1,
        active: true,
        designs: [
          {
            id: 'wip-des-cf-1',
            title: 'Colonial Manor Estate Entrance Gate',
            subcategoryId: 'wip-sub-cf-gates',
            subcategory: 'Front Gate',
            productCode: 'MSF-CF-G01',
            associatedProductCode: 'MFG-G002',
            description: 'Arched colonial driveway gate with hand-forged spears, decorative center rings, and integrated wicket door.',
            image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 3100,
            basePrice: 195000,
            gaugeSpec: '12-Gauge Box Pipe & Solid 16mm Square Bars',
            finishSpec: 'Textured Bronze Electrostatic Powder Coat'
          }
        ]
      }
    ]
  },
  {
    id: 'wip-village-house',
    category: 'Village House',
    title: 'Robust Heavy-Duty Residential Security Gates',
    tagline: 'Maximum security, heavy-gauge steel & reinforced perimeter safety',
    description: 'Rugged, high-security steel main gates with reinforced lock-boxes, anti-tamper hinges, boundary spike grills, and durable rooftop railings.',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
    itemsCount: 2,
    primaryItem: 'Front Gate',
    gaugeSpec: 'Heavy 12-Gauge Solid Steel Plate & Structural Channels',
    finishSpec: 'Zinc-Chromate Anti-Rust Primer & Enamel Paint',
    deliverables: 'Heavy Main Security Gate with Wicket Door & Lock Shield',
    location: 'Rawat / Kallar Syedan',
    status: 'completed',
    statusLabel: 'Completed & Handed Over',
    subcategories: [
      {
        id: 'wip-sub-vh-gates',
        title: 'Front Gate',
        slug: 'front-gate',
        description: 'Solid heavy steel sheet security gates with anti-pry deadbolt shields and reinforced steel frames.',
        image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 1,
        active: true,
        designs: [
          {
            id: 'wip-des-vh-1',
            title: 'Reinforced 12-Gauge Solid Steel Security Gate',
            subcategoryId: 'wip-sub-vh-gates',
            subcategory: 'Front Gate',
            productCode: 'MSF-VH-G01',
            associatedProductCode: 'MFG-G001',
            description: 'Solid heavy sheet security gate with anti-pry deadbolt shield, triple internal locking bars, and reinforced steel frame.',
            image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 2100,
            basePrice: 125000,
            gaugeSpec: 'Heavy 12-Gauge Solid Steel Plate & C-Channels',
            finishSpec: 'Zinc-Chromate Anti-Rust Primer & Enamel Paint'
          }
        ]
      }
    ]
  },
  {
    id: 'wip-farm',
    category: 'Farm',
    title: 'Agricultural Farm Enclosures & Cattle Yards',
    tagline: 'Heavy-duty tubular fencing, cattle gates & steel livestock sheds',
    description: 'Hot-dip galvanized agricultural gates, livestock holding pens, heavy-duty tractor entrance gates, and modular structural farm sheds.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    itemsCount: 2,
    primaryItem: 'Front Gate',
    gaugeSpec: 'Hot-Dip Galvanized Class B/C Heavy Steel Tubes',
    finishSpec: 'Hot-Dip Galvanized Coating (85 microns zinc)',
    deliverables: 'Heavy-Duty 16ft Farm Entry Gate & Modular Cattle Pens',
    location: 'Fateh Jang / Attock',
    status: 'completed',
    statusLabel: 'Completed & Handed Over',
    subcategories: [
      {
        id: 'wip-sub-farm-gates',
        title: 'Front Gate',
        slug: 'front-gate',
        description: 'Tubular galvanized wide-span gates designed for heavy tractors and livestock management.',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 1,
        active: true,
        designs: [
          {
            id: 'wip-des-fm-1',
            title: 'Heavy-Duty Galvanized Farm Tractor Gate',
            subcategoryId: 'wip-sub-farm-gates',
            subcategory: 'Front Gate',
            productCode: 'MSF-FM-G01',
            associatedProductCode: 'MFG-G001',
            description: 'Wide 16ft double swing gate constructed with round galvanized pipes, slam latches, and heavy pin hinges.',
            image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 1800,
            basePrice: 95000,
            gaugeSpec: 'Hot-Dip Galvanized Heavy Steel Tubes',
            finishSpec: 'Hot-Dip Galvanized Coating (85 microns zinc)'
          }
        ]
      }
    ]
  },
  {
    id: 'wip-small-villa',
    category: 'Small Villa',
    title: 'Compact Villa & Telescopic Sliding Gates',
    tagline: 'Space-saving sliding, bi-fold & elegant compact steelwork',
    description: 'Smart telescopic and bi-fold gates for limited driveway clearances, sleek terrace glass/steel railings, and slim-profile doors.',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    itemsCount: 2,
    primaryItem: 'Front Gate',
    gaugeSpec: '14-Gauge CNC Geometric Laser Cut MS',
    finishSpec: 'Charcoal Grey Electrostatic Powder Coat',
    deliverables: 'Automated Sliding Gate with Italian Motor, Frameless Glass Balconies',
    location: 'Bahria Town Phase 7, Rawalpindi',
    status: 'completed',
    statusLabel: 'Completed & Handed Over',
    subcategories: [
      {
        id: 'wip-sub-sv-gates',
        title: 'Front Gate',
        slug: 'front-gate',
        description: 'Multi-leaf synchronized telescopic and bi-fold gates for limited driveway clearances.',
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 1,
        active: true,
        designs: [
          {
            id: 'wip-des-sv-1',
            title: 'Telescopic Space-Saving Sliding Gate',
            subcategoryId: 'wip-sub-sv-gates',
            subcategory: 'Front Gate',
            productCode: 'MSF-SV-G01',
            associatedProductCode: 'MFG-G001',
            description: 'Multi-leaf synchronized telescopic sliding gate allowing full driveway access with minimal pullback space.',
            image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 2900,
            basePrice: 175000,
            gaugeSpec: '14-Gauge CNC Precision Laser Cut MS',
            finishSpec: 'Charcoal Grey Electrostatic Powder Coat'
          }
        ]
      },
      {
        id: 'wip-sub-sv-railings',
        title: 'Balcony Railings',
        slug: 'balcony-railings',
        description: 'Slim-line safety railings with tempered glass inserts designed for compact urban villa balconies.',
        image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 2,
        active: true,
        designs: [
          {
            id: 'wip-des-sv-2',
            title: 'Compact Villa Terrace Balcony Railing',
            subcategoryId: 'wip-sub-sv-railings',
            subcategory: 'Balcony Railings',
            productCode: 'MSF-SV-R01',
            associatedProductCode: 'MFG-R001',
            description: 'Slim-line safety railing with tempered glass inserts designed for compact urban villa balconies.',
            image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 2300,
            basePrice: 62000,
            gaugeSpec: '10mm Clear Toughened Safety Glass & MS Frame',
            finishSpec: 'Matte Graphite Electrostatic Coating'
          }
        ]
      }
    ]
  },
  {
    id: 'wip-aluminum-glass',
    category: 'Aluminum & Glass',
    title: 'Architectural Pivot Doors & Glass Facades',
    tagline: 'Ultra-slim thermal profiles, architectural pivot doors & glass balustrades',
    description: 'Thermally isolated aluminum window frames, double-glazed soundproof glass walls, frameless tempered glass railings, and pivot doors.',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    itemsCount: 2,
    primaryItem: 'Front Gate',
    gaugeSpec: '6063-T6 Thermal-Break Profile with 12mm Acoustic Glass',
    finishSpec: 'Deep Matte Anodized Architectural Black',
    deliverables: '5x10 ft Hydraulic Floor-Spring Pivot Entrance Door & Laser Leveling',
    location: 'Sector F-7/2, Islamabad',
    status: 'ongoing',
    statusLabel: 'Active Installation (90%)',
    subcategories: [
      {
        id: 'wip-sub-ag-doors',
        title: 'Front Gate',
        slug: 'front-gate',
        description: 'Grand hydraulic floor-spring pivot entrance doors with acoustic double glazing and German hardware.',
        image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 1,
        active: true,
        designs: [
          {
            id: 'wip-des-ag-1',
            title: 'Architectural Hydraulic Pivot Door',
            subcategoryId: 'wip-sub-ag-doors',
            subcategory: 'Front Gate',
            productCode: 'MSF-AG-D01',
            associatedProductCode: 'MFG-D001',
            description: 'Grand 5x10 ft hydraulic floor-spring pivot entrance door with acoustic double glazing and German hardware.',
            image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 3800,
            basePrice: 280000,
            gaugeSpec: '6063-T6 Architectural Profile & 12mm Glass',
            finishSpec: 'Deep Matte Anodized Architectural Black'
          }
        ]
      },
      {
        id: 'wip-sub-ag-railings',
        title: 'Balcony Railings',
        slug: 'balcony-railings',
        description: 'Minimalist aluminum base-shoe channel systems holding structural laminated tempered glass with zero vertical posts.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        displayOrder: 2,
        active: true,
        designs: [
          {
            id: 'wip-des-ag-2',
            title: 'Frameless Glass Balustrade System',
            subcategoryId: 'wip-sub-ag-railings',
            subcategory: 'Balcony Railings',
            productCode: 'MSF-AG-R01',
            associatedProductCode: 'MFG-R001',
            description: 'Minimalist aluminum base-shoe channel system holding structural laminated tempered glass with zero vertical posts.',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            pricePerSqFt: 2500,
            basePrice: 78000,
            gaugeSpec: 'Heavy Extruded Aluminum U-Channel & 12mm Glass',
            finishSpec: 'Anodized Champagne / Matte Black'
          }
        ]
      }
    ]
  }
];

// Helper to ensure flat designs list is always synchronized with subcategories for any backwards-compatible consumers
SEED_WHAT_IS_YOUR_PROJECT.forEach(category => {
  if (category.subcategories && category.subcategories.length > 0) {
    category.designs = category.subcategories.flatMap(sub => sub.designs || []);
    category.itemsCount = category.designs.length;
  }
});
