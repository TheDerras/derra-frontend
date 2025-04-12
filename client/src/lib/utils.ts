import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export const categoryIcons: Record<string, string> = {
  "Retail": "ri-store-2-line",
  "Food & Dining": "ri-restaurant-line",
  "Professional": "ri-briefcase-4-line",
  "Healthcare": "ri-heart-pulse-line",
  "Home Services": "ri-home-4-line",
  "Education": "ri-graduation-cap-line",
  "Technology": "ri-computer-line",
  "Fitness": "ri-run-line",
  "Beauty": "ri-scissors-line",
  "Automotive": "ri-car-line",
  "Entertainment": "ri-film-line",
  "Financial": "ri-bank-line",
  "Travel": "ri-plane-line",
  "Real Estate": "ri-building-2-line",
  "Legal": "ri-scales-line",
  "Other": "ri-handbag-line"
};

export const categoryImages: Record<string, string> = {
  "Retail": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"/><path d="M15 14v-2"/><path d="M9 14v-2"/></svg>`,
  "Food & Dining": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10" fill="#dcfce7" stroke="#22c55e" stroke-width="1"/>
    <circle cx="12" cy="12" r="6" fill="#86efac" stroke="#22c55e"/>
    <path d="M8 10h8" stroke="#22c55e" stroke-width="2"/>
    <path d="M14 14.5h2M8 14.5h2" stroke="#22c55e" stroke-width="2"/>
    <g stroke="#166534">
      <path d="M5 8l2-3M7 9l-1-3M19 8l-2-3M17 9l1-3" stroke-width="1.5"/>
    </g>
  </svg>`,
  "Professional": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  "Healthcare": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12.5a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z"/><path d="M9 12h6"/><path d="M12 9v6"/></svg>`,
  "Home Services": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  "Education": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  "Technology": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  "Fitness": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5v14M5 15h14M5 9h14"/></svg>`,
  "Beauty": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><path d="M3.5 18.5 10 12l.5.5.5-.5 6.5 6.5"/><path d="M20.5 9 12 17.5 9 20.5"/><path d="M9.5 14.5 7 17"/><path d="M14.5 9.5 17 7"/></svg>`,
  "Automotive": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h14M6 7h12l2 5H4z"/><path d="M8 17v-3H6.5a1.5 1.5 0 0 1 0-3h11a1.5 1.5 0 0 1 0 3H16v3"/></svg>`,
  "Entertainment": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11v8a1 1 0 0 0 1 1h8"/><path d="M4 11V7a1 1 0 0 1 1-1h2"/><path d="M4 11h8m0 0V7a1 1 0 0 0-1-1H9"/><path d="M12 11v8a1 1 0 0 1-1 1H9"/><circle cx="17" cy="12" r="3"/><path d="M17 9V3l4 3-4 3"/></svg>`,
  "Financial": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h4"/><path d="M14 9h4"/><path d="M6 13h4"/><path d="M14 13h4"/><path d="M6 17h4"/><path d="M14 17h4"/></svg>`,
  "Travel": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 15h14m0 0l-4.5-8.5-1.5 4-2-2.5-6 7"/><path d="M18 18h1a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2M5 18H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2"/></svg>`,
  "Real Estate": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M9 8h1"/><path d="M9 12h1"/><path d="M9 16h1"/><path d="M14 8h1"/><path d="M14 12h1"/><path d="M14 16h1"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>`,
  "Legal": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 20h8"/><path d="M12 4v16"/><path d="M4 8h16"/><path d="m4 8 4-4 4 4 4-4 4 4"/></svg>`,
  "Other": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 16h.01"/><path d="M8 16h.01"/><path d="M12 20h.01"/><path d="M20 12.5v.1"/><path d="M20 16.5v.1"/><path d="M4 12.5v.1"/><path d="M4 16.5v.1"/><path d="M12 4h.01"/><path d="M18 8h.01"/><path d="M6 8h.01"/><circle cx="12" cy="12" r="9"/></svg>`
};

export function getIconForCategory(categoryName?: string): string {
  if (!categoryName) return "ri-store-2-line";
  return categoryIcons[categoryName] || "ri-store-2-line";
}

export function getCategoryImage(categoryName?: string): string {
  if (!categoryName) return categoryImages["Other"];
  return categoryImages[categoryName] || categoryImages["Other"];
}

export function getRandomColor(index: number): string {
  const colors = [
    "primary", "secondary", "accent", "status-error", "status-success", "status-warning"
  ];
  return colors[index % colors.length];
}

// Placeholder image URLs for business listings
export const businessPlaceholderImages = [
  "https://images.unsplash.com/photo-1516216628859-9bccecab13ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80", // Coffee shop
  "https://images.unsplash.com/photo-1470075801209-17f9ec0cada6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80", // Law firm
  "https://images.unsplash.com/photo-1465799522714-8eb0e6fccf73?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80", // Fitness
  "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80", // Tech repair
  "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80", // Spa
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80", // Restaurant
  "https://images.unsplash.com/photo-1505275350441-83dcda8eeef5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80", // Design studio
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80", // Finance office
  "https://images.unsplash.com/photo-1540247110674-31e928ee852a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80", // Pet grooming
  "https://images.unsplash.com/photo-1560253023-3ec5d502959f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80", // Auto repair
  "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80", // Yoga studio
  "https://images.unsplash.com/photo-1556227834-09f1de7a7d14?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"  // Photography
];

export function getRandomBusinessImage(businessId: number): string {
  return businessPlaceholderImages[businessId % businessPlaceholderImages.length];
}

// Owner avatar placeholders
export const ownerAvatarPlaceholders = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80", // Male 1
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80", // Female 1
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"  // Male 2
];

export function getRandomOwnerAvatar(ownerId: number): string {
  return ownerAvatarPlaceholders[ownerId % ownerAvatarPlaceholders.length];
}
