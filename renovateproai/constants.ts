
import { PricingPlan, Material, ProjectStatus, UserRole, Project } from './types';

export const MOCK_MATERIALS: Material[] = [
  { 
    id: 'm1', 
    name: 'Natural Oak Wide Plank', 
    category: 'Flooring', 
    subCategory: 'Hardwood',
    description: '6-inch wide natural oak planks with a matte finish.',
    imageUrl: 'https://picsum.photos/100/100?random=1' 
  },
  { 
    id: 'm2', 
    name: 'Calacatta Gold', 
    category: 'Countertops', 
    subCategory: 'Quartz',
    description: 'White quartz with bold grey and gold veining.',
    imageUrl: 'https://picsum.photos/100/100?random=2' 
  },
  { 
    id: 'm3', 
    name: 'Classic White Subway', 
    category: 'Tile', 
    subCategory: 'Ceramic',
    description: '3x6 inch glossy white ceramic subway tile.',
    imageUrl: 'https://picsum.photos/100/100?random=3' 
  },
  { 
    id: 'm4', 
    name: 'Modern Brass Pendant', 
    category: 'Lighting', 
    subCategory: 'Pendants',
    description: 'Brushed brass geometric pendant light with warm LED.',
    imageUrl: 'https://picsum.photos/100/100?random=4' 
  },
  { 
    id: 'm5', 
    name: 'Matte Black Kitchen Faucet', 
    category: 'Fixtures', 
    subCategory: 'Kitchen',
    description: 'High-arc pull-down kitchen faucet in matte black.',
    imageUrl: 'https://picsum.photos/100/100?random=5' 
  },
  {
    id: 'm6',
    name: 'Repose Gray',
    category: 'Paint',
    subCategory: 'Sherwin-Williams',
    description: 'A warm gray neutral paint color.',
    imageUrl: 'https://picsum.photos/100/100?random=6'
  },
  {
    id: 'm7',
    name: 'Hale Navy',
    category: 'Paint',
    subCategory: 'Benjamin Moore',
    description: 'A deeply saturated classic navy blue.',
    imageUrl: 'https://picsum.photos/100/100?random=7'
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Miller Whole Home Reno',
    coverPhoto: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    date: '2023-10-15',
    status: ProjectStatus.OPEN_JOB,
    clientName: 'Sarah Miller',
    clientEmail: 'sarah@example.com',
    clientAddress: '123 Maple Ave, Springfield',
    clientPhone: '(555) 123-4567',
    quoteAmount: 45000,
    description: 'Complete renovation of kitchen and living area.',
    spaces: [
      {
        id: 's1',
        name: 'Kitchen',
        beforeImage: 'https://images.unsplash.com/photo-1556912173-3db496beee71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        afterImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Modern open concept kitchen with island.',
        materials: [MOCK_MATERIALS[0], MOCK_MATERIALS[1]]
      },
      {
        id: 's2',
        name: 'Living Room',
        beforeImage: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        afterImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Bright and airy living room with new flooring.',
        materials: [MOCK_MATERIALS[0], MOCK_MATERIALS[3]]
      }
    ]
  },
  {
    id: 'p2',
    name: 'Johnson Master Bath',
    coverPhoto: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    date: '2023-11-02',
    status: ProjectStatus.COMPLETE,
    clientName: 'Dave Johnson',
    clientEmail: 'dave@example.com',
    clientAddress: '456 Oak Ln, Springfield',
    clientPhone: '(555) 987-6543',
    quoteAmount: 18500,
    description: 'Master bathroom remodel.',
    spaces: [
      {
        id: 's3',
        name: 'Master Bath',
        beforeImage: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        afterImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Luxury spa-like bathroom.',
        materials: [MOCK_MATERIALS[2], MOCK_MATERIALS[4]]
      }
    ]
  },
  {
    id: 'p3',
    name: 'Westside Commercial Reno',
    coverPhoto: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    date: '2023-12-10',
    status: ProjectStatus.OPEN_QUOTE,
    clientName: 'Urban Corp',
    clientEmail: 'contact@urbancorp.com',
    clientAddress: '789 Business Pkwy',
    clientPhone: '(555) 555-0199',
    quoteAmount: 120000,
    description: 'Office floor renovation with modern aesthetics.',
    spaces: [
      {
        id: 's4',
        name: 'Lobby',
        beforeImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        afterImage: null,
        description: 'Modern reception area with marble flooring.',
        materials: []
      },
      {
        id: 's5',
        name: 'Conference Room',
        beforeImage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        afterImage: null,
        description: 'Glass walled meeting room.',
        materials: []
      }
    ]
  }
];

export const DEFAULT_PLANS: PricingPlan[] = [
  {
    id: 'monthly',
    name: 'Pro Monthly',
    price: 99,
    interval: 'monthly',
    features: [
      'Unlimited Projects',
      'AI Before & After Generation',
      'High-Res Exports (4K)',
      'PDF Permit Packages',
      'Client Approval Portal'
    ]
  },
  {
    id: 'yearly',
    name: 'Pro Yearly',
    price: 990,
    interval: 'yearly',
    features: [
      'Everything in Monthly',
      '2 Months Free',
      'Priority Support',
      'Custom Branding',
      'Team Access (up to 3)'
    ],
    recommended: true
  }
];

export const MOCK_TESTIMONIALS = [
  { name: "Mike R.", role: "General Contractor", text: "This app closed 3 deals for me last week alone. Clients need to see it to believe it." },
  { name: "Sarah L.", role: "Interior Designer", text: "The realistic textures on the AI generation are incredible. Saves me hours of rendering." },
  { name: "David K.", role: "Roofer", text: "Showing a homeowner their new roof before I even order materials is a game changer." }
];

export const MOCK_USERS = [
  { 
    email: 'admin@renovatepro.ai', 
    password: 'password', 
    role: UserRole.ADMIN, 
    name: 'Paul Admin', 
    // Using a specific professional headshot to represent the uploaded image
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' 
  },
  { 
    email: 'mike@example.com', 
    password: 'password', 
    role: UserRole.CONTRACTOR, 
    name: 'Mike Builder', 
    profileImage: 'https://picsum.photos/100/100?u=1' 
  }
];

export const DEFAULT_CMS_CONTENT = {
  hero: {
    badge: "✨ Now with 4K AI Rendering",
    headlinePart1: "One app for before & afters,",
    headlinePart2: "approvals & permits.",
    subheadline: "Turn job photos into approvals and permits, fast. The essential tool for modern contractors, roofers, and remodelers.",
    ctaText: "Sign Up Now",
    benefits: [
      "Unlimited AI Generations",
      "PDF & Email Exports",
      "Project Management Dashboard",
      "Access to 5,000+ Materials"
    ]
  },
  video: {
    title: "See RenovateProAI In Action",
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    poster: 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?auto=format&fit=crop&q=80&w=2071'
  },
  howItWorks: {
    title: "From Photo to Permit in Minutes",
    subtitle: "A simple workflow designed for the job site.",
    steps: [
      { title: "Capture & Create", desc: "Login, create a project, and snap 'Before' photos directly on site." },
      { title: "Material Selection", desc: "Select materials from our extensive database to match client desires." },
      { title: "Voice Description", desc: "Simply speak to describe the renovation. Our AI listens and understands." },
      { title: "AI Visualization", desc: "Generate realistic Before & After previews instantly." },
      { title: "Refine & Edit", desc: "Tweak details with text commands until it's perfect." },
      { title: "Export & Close", desc: "Generate PDFs with specs and images. Send to clients and officials." }
    ]
  },
  features: {
    title: "Built for the Trades",
    items: [
      { icon: "🎨", title: "AI Image Gen", desc: "Photorealistic rendering of any room or exterior." },
      { icon: "📱", title: "Mobile First", desc: "Works perfectly on your phone or tablet." },
      { icon: "📋", title: "Permit Ready", desc: "Exports technical details needed for approvals." },
      { icon: "🌤️", title: "Cloud Storage", desc: "Access your project gallery from anywhere." },
      { icon: "🧱", title: "Material Library", desc: "Real catalog items for accurate visuals." },
      { icon: "⚡", title: "Instant Speed", desc: "No waiting days for a designer." },
    ]
  },
  useCases: {
    title: "Who Uses RenovateProAI?",
    items: ["Remodelers", "Roofers", "Landscapers", "Interior Designers", "General Contractors"]
  },
  pricing: {
    title: "Simple, Flat Pricing",
    subtitle: "No hidden fees. Unlimited projects."
  },
  testimonials: {
    title: "Trusted by Pros"
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      { q: "Is the AI accurate?", a: "Yes, our models are specifically tuned for architectural and interior realism." },
      { q: "Can I use the images commercially?", a: "Absolutely. You own full rights to every image you generate." },
      { q: "Is my data secure?", a: "We use enterprise-grade encryption for all project data and photos." }
    ]
  },
  footer: {
    headline: "Start Creating Before & After Images Today",
    subheadline: "Join thousands of contractors closing deals faster.",
    ctaText: "Sign Up"
  },
  seo: {
    metaTitle: "RenovateProAI - Contractor Tools"
  }
};
