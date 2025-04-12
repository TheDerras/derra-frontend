import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import FeaturedBusinesses from "@/components/sections/featured-businesses";
import BusinessCategories from "@/components/sections/business-categories";
import TrendingBusinesses from "@/components/sections/trending-businesses";
import CTASection from "@/components/sections/cta-section";
import RecentlyAdded from "@/components/sections/recently-added";
import Testimonials from "@/components/sections/testimonials";
import CategoryPill from "@/components/business/category-pill";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
  });
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Category Selector */}
      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex space-x-1 py-3 px-4 whitespace-nowrap">
              <CategoryPill 
                name="All" 
                isSelected={selectedCategory === "All"} 
                onClick={() => setSelectedCategory("All")} 
              />
              
              {!categoriesLoading && categories?.map((category: any) => (
                <CategoryPill 
                  key={category.id}
                  name={category.name} 
                  isSelected={selectedCategory === category.name}
                  onClick={() => setSelectedCategory(category.name)} 
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <main>
        <FeaturedBusinesses />
        <BusinessCategories />
        <TrendingBusinesses />
        <CTASection />
        <RecentlyAdded />
        <Testimonials />
      </main>
      
      <Footer />
    </div>
  );
}
