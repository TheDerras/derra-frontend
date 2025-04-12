import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import BusinessCard from "@/components/business/business-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Search } from "lucide-react";

export default function SearchResults() {
  const [location, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  
  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setSearchTerm(q);
    }
  }, [location]);
  
  // Fetch search results
  const { data: businesses, isLoading, error, refetch } = useQuery({
    queryKey: [`/api/businesses/search?q=${encodeURIComponent(searchTerm)}`],
    enabled: searchTerm.length > 0,
  });
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update the URL with the search query
    const params = new URLSearchParams();
    params.set("q", searchTerm);
    setLocation(`/search?${params.toString()}`);
    
    // Refetch data
    refetch();
  };
  
  // Sort businesses
  const sortedBusinesses = businesses
    ? [...businesses].sort((a: any, b: any) => {
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
      })
    : [];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-primary/10 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-center mb-6">Search Results</h1>
            
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input 
                  placeholder="Search businesses by name, description, or location..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-6 text-lg"
                />
                <Button 
                  type="submit" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="container mx-auto py-8 px-4">
          {/* Results count and filters */}
          {businesses && businesses.length > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <p className="text-muted-foreground mb-4 md:mb-0">
                Found {businesses.length} result{businesses.length !== 1 ? 's' : ''} for "{searchTerm}"
              </p>
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
          )}
          
          {/* Results */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Error Loading Results</h2>
              <p className="text-muted-foreground mb-6">
                There was an error searching for businesses. Please try again.
              </p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </div>
          ) : businesses?.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">No Results Found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find any businesses matching "{searchTerm}". Try a different search term or browse categories.
              </p>
              <Button onClick={() => setLocation("/")}>Browse All Businesses</Button>
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
