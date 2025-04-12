import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRandomBusinessImage } from "@/lib/utils";
import { PlusCircle, Edit, Trash2, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function BusinessDashboard() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const auth = useAuth();
  const [businessToDelete, setBusinessToDelete] = useState<number | null>(null);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!auth?.isLoading && !auth?.isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to access your dashboard",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [auth?.isLoading, auth?.isAuthenticated, navigate, toast]);
  
  // Fetch user's businesses
  const { data: businesses, isLoading, error, refetch } = useQuery({
    queryKey: [`/api/users/${auth?.user?.id}/businesses`],
    enabled: !!auth?.user?.id,
  });
  
  // Handle business deletion
  const handleDeleteBusiness = async () => {
    if (!businessToDelete) return;
    
    try {
      await apiRequest("DELETE", `/api/businesses/${businessToDelete}`);
      
      toast({
        title: "Success",
        description: "Business deleted successfully",
      });
      
      // Refetch businesses
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete business",
        variant: "destructive",
      });
    } finally {
      setBusinessToDelete(null);
    }
  };
  
  if (auth?.isLoading) {
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
  
  if (!auth?.isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Business Dashboard</h1>
          <Button onClick={() => navigate("/create-listing")}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Listing
          </Button>
        </div>
        
        <Tabs defaultValue="listings">
          <TabsList className="mb-6">
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="listings">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : error ? (
              <Card>
                <CardContent className="pt-6 flex flex-col items-center">
                  <AlertCircle className="text-destructive h-12 w-12 mb-4" />
                  <h2 className="text-xl font-bold mb-2">Error Loading Businesses</h2>
                  <p className="text-muted-foreground">There was an error loading your business listings.</p>
                </CardContent>
              </Card>
            ) : businesses?.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <h2 className="text-xl font-bold mb-4">No Business Listings Yet</h2>
                  <p className="text-muted-foreground mb-6">You haven't created any business listings yet. Get started by creating your first listing!</p>
                  <Button onClick={() => navigate("/create-listing")}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create New Listing
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses?.map((business: any) => (
                  <Card key={business.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={business.image || getRandomBusinessImage(business.id)} 
                        alt={business.name}
                        className="w-full h-full object-cover"
                      />
                      {business.status === "pending" && (
                        <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                          Pending
                        </div>
                      )}
                      {business.isPaid && (
                        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                          Active
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle>{business.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{business.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>{business.city}, {business.state}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => navigate(`/business/${business.id}`)}>
                        View
                      </Button>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-blue-500">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500"
                              onClick={() => setBusinessToDelete(business.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Business Listing</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this business listing? This action cannot be undone and no refund will be provided.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setBusinessToDelete(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteBusiness} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Business Analytics</CardTitle>
                <CardDescription>
                  View insights about your business listings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-12 text-muted-foreground">
                  Analytics dashboard coming soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-12 text-muted-foreground">
                  Account settings dashboard coming soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
