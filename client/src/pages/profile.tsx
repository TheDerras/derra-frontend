import { useEffect } from "react";
import { Redirect, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Business } from "@shared/schema";
import { Loader2, Heart, Building, LogOut } from "lucide-react";

export default function ProfilePage() {
  const auth = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  // Redirect if not authenticated
  if (!auth?.isAuthenticated) {
    return <Redirect to="/auth" />;
  }

  if (auth?.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Get user's businesses
  const { 
    data: userBusinesses, 
    isLoading: businessesLoading 
  } = useQuery<Business[]>({
    queryKey: [`/api/users/${auth.user?.id}/businesses`],
    enabled: !!auth.user?.id,
  });

  // Get user's liked businesses
  const { 
    data: favoriteBusinesses, 
    isLoading: favoritesLoading 
  } = useQuery<Business[]>({
    queryKey: [`/api/users/${auth.user?.id}/likes`],
    enabled: !!auth.user?.id,
  });

  const handleLogout = async () => {
    try {
      await auth.logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* User Profile Sidebar */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-3xl">
                    {auth.user?.username?.substring(0, 1).toUpperCase()}
                  </span>
                </div>
              </div>
              <CardTitle className="text-2xl">{auth.user?.username}</CardTitle>
              <p className="text-muted-foreground">{auth.user?.email}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-start gap-2"
                  onClick={() => navigate("/create-listing")}
                >
                  <Building className="h-4 w-4" />
                  <span>Create New Business</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="businesses" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="businesses" className="flex-1">Your Businesses</TabsTrigger>
              <TabsTrigger value="favorites" className="flex-1">Favorites</TabsTrigger>
            </TabsList>
            
            {/* Your Businesses Tab */}
            <TabsContent value="businesses" className="space-y-4">
              <h2 className="text-2xl font-bold">Your Businesses</h2>
              
              {businessesLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : userBusinesses && userBusinesses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userBusinesses.map((business) => (
                    <Card key={business.id} className="overflow-hidden">
                      <div className="aspect-video bg-muted relative">
                        {business.image ? (
                          <img 
                            src={business.image} 
                            alt={business.name} 
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-primary/10">
                            <Building className="h-10 w-10 text-primary" />
                          </div>
                        )}
                        {business.isPaid ? (
                          <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Active
                          </div>
                        ) : (
                          <div className="absolute top-2 right-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                            Inactive
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{business.name}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                          {business.description}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/business/${business.id}`)}
                            className="flex-1"
                          >
                            View
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => navigate(`/edit-business/${business.id}`)}
                            className="flex-1"
                          >
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-muted/50 rounded-lg p-8 text-center">
                  <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No businesses yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't created any business listings yet. 
                    Create your first listing to start showcasing your business.
                  </p>
                  <Button onClick={() => navigate("/create-listing")}>
                    Create Business Listing
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Favorites Tab */}
            <TabsContent value="favorites" className="space-y-4">
              <h2 className="text-2xl font-bold">Your Favorites</h2>
              
              {favoritesLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : favoriteBusinesses && favoriteBusinesses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteBusinesses.map((business) => (
                    <Card key={business.id} className="overflow-hidden">
                      <div className="aspect-video bg-muted relative">
                        {business.image ? (
                          <img 
                            src={business.image} 
                            alt={business.name} 
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-primary/10">
                            <Building className="h-10 w-10 text-primary" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{business.name}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                          {business.description}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => navigate(`/business/${business.id}`)}
                        >
                          View Business
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-muted/50 rounded-lg p-8 text-center">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't added any businesses to your favorites yet.
                    Explore businesses and click the heart icon to add them to your favorites.
                  </p>
                  <Button onClick={() => navigate("/")}>
                    Explore Businesses
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}