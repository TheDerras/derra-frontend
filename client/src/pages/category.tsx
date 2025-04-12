import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import BusinessCard from "@/components/business/business-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Search } from "lucide-react";

export default function Category() {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  
  // Fetch category details
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: [`/api/categories/${id}`],
  });
  
  // Fetch businesses in category
  const { data: businesses, isLoading: businessesLoading } = useQuery({
    queryKey: [`/api/businesses/category/${id}`],
  });
  
  // Sort and filter businesses
  const filteredBusinesses = businesses
    ? businesses.filter((business: any) => 
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.state.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  
  const sortedBusinesses = [...filteredBusinesses].sort((a: any, b: any) => {
    switch (sortOption) {
      case "recent":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "popular":
        return (b.likeCount || 0) - (a.likeCount || 0);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });
  
  const isLoading = categoryLoading || businessesLoading;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-primary/10 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-center mb-2">
              {categoryLoading ? "Loading..." : `${category?.name} Businesses`}
            </h1>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto">
              Discover the best {category?.name} businesses on Derra.
            </p>
          </div>
        </div>
        
        <div className="container mx-auto py-8 px-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search businesses..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : sortedBusinesses.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">No Businesses Found</h2>
              <p className="text-muted-foreground mb-6">
                {searchTerm 
                  ? `No results found for "${searchTerm}". Try a different search term or check back later.`
                  : `There are no businesses in this category yet. Check back later or be the first to list your business!`
                }
              </p>
              <Button>List Your Business</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedBusinesses.map((business: any) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
