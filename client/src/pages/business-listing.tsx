import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import BusinessComments from "@/components/business/business-comments";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { Heart, ExternalLink, Phone, Calendar, MapPin, Star, AlertTriangle } from "lucide-react";
import { getRandomBusinessImage } from "@/lib/utils";

export default function BusinessListing() {
  const { id } = useParams();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const auth = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  
  // Fetch business details
  const { data: business, isLoading, error } = useQuery({
    queryKey: [`/api/businesses/${id}`],
  });

  // Fetch category details
  const { data: category } = useQuery({
    queryKey: [`/api/categories/${business?.categoryId}`],
    enabled: !!business?.categoryId,
  });
  
  // Handle like/unlike
  const handleLikeToggle = async () => {
    if (!auth?.isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to like businesses",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (isLiked) {
        await apiRequest("DELETE", `/api/businesses/${id}/like`);
        setIsLiked(false);
        toast({
          title: "Success",
          description: "Business unliked",
        });
      } else {
        await apiRequest("POST", `/api/businesses/${id}/like`);
        setIsLiked(true);
        toast({
          title: "Success",
          description: "Business liked",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto py-8 flex-grow flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !business) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto py-8 flex-grow">
          <Card className="max-w-lg mx-auto">
            <CardContent className="pt-6 flex flex-col items-center">
              <AlertTriangle className="text-destructive h-12 w-12 mb-4" />
              <h1 className="text-2xl font-bold mb-4">Business Not Found</h1>
              <p className="text-muted-foreground mb-6">This business listing may have been removed or is unavailable.</p>
              <Button onClick={() => navigate("/")}>Return to Homepage</Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative h-64 md:h-80 lg:h-96 bg-gray-200">
          <img 
            src={business.image || getRandomBusinessImage(business.id)} 
            alt={business.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
          <div className="absolute bottom-0 left-0 w-full p-6 text-white">
            <div className="container mx-auto">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">{business.name}</h1>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center mr-4">
                      <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{business.rating || "New"}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{business.city}, {business.state}</span>
                    </div>
                    {business.isVerified && (
                      <span className="ml-3 text-green-400 flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLikeToggle}
                  className={`p-2 rounded-full bg-white ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
                >
                  <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Business Details */}
        <div className="container mx-auto py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <Tabs defaultValue="about">
                <TabsList className="mb-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about">
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-xl font-bold mb-4">About {business.name}</h2>
                      <p className="text-muted-foreground mb-6">{business.description}</p>
                      
                      <h3 className="text-lg font-semibold mb-2">Category</h3>
                      <p className="text-muted-foreground mb-4">
                        {category?.name || 'Loading category...'}
                      </p>
                      
                      {business.tags && business.tags.length > 0 && (
                        <>
                          <h3 className="text-lg font-semibold mb-2">Tags</h3>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {business.tags.map((tag: string, index: number) => (
                              <span key={index} className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews">
                  <BusinessComments businessId={parseInt(id)} />
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar */}
            <div>
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                  
                  {business.phone && (
                    <div className="flex items-center mb-4">
                      <Phone className="h-5 w-5 text-primary mr-3" />
                      <span>{business.phone}</span>
                    </div>
                  )}
                  
                  {business.website && (
                    <div className="flex items-center mb-4">
                      <ExternalLink className="h-5 w-5 text-primary mr-3" />
                      <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Visit Website
                      </a>
                    </div>
                  )}
                  
                  {business.email && (
                    <div className="flex items-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <a href={`mailto:${business.email}`} className="text-primary hover:underline">
                        {business.email}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-primary mr-3" />
                    <span>{business.city}, {business.state}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">Actions</h2>
                  
                  <div className="space-y-3">
                    <Button 
                      className="w-full flex items-center justify-center" 
                      variant="outline"
                      onClick={() => {
                        if (business.phone) {
                          window.location.href = `tel:${business.phone}`;
                        }
                      }}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Business
                    </Button>
                    
                    {business.website && (
                      <Button 
                        className="w-full flex items-center justify-center"
                        onClick={() => {
                          if (business.website) {
                            window.open(business.website, '_blank');
                          }
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Website
                      </Button>
                    )}
                    
                    {!business.isRestaurant && (
                      <Button className="w-full flex items-center justify-center" variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Service
                      </Button>
                    )}
                    
                    <Button 
                      className="w-full flex items-center justify-center" 
                      variant={isLiked ? "default" : "outline"}
                      onClick={handleLikeToggle}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                      {isLiked ? 'Liked' : 'Like Business'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
