import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useAuth } from "@/lib/auth-context";
import ListingForm from "@/components/business/listing-form";
import ListingPreview from "@/components/business/listing-preview";
import CreatePayment from "@/components/business/create-payment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

export default function CreateListing() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const auth = useAuth();
  const [currentStep, setCurrentStep] = useState<'details' | 'preview' | 'payment' | 'success'>('details');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: 0,
    city: '',
    state: '',
    phone: '',
    website: '',
    email: '',
    image: '',
    tags: []
  });
  const [createdBusinessId, setCreatedBusinessId] = useState<number | null>(null);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!auth?.isLoading && !auth?.isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a business listing",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [auth?.isLoading, auth?.isAuthenticated, navigate, toast]);
  
  const handleUpdateFormData = (newData: any) => {
    setFormData({ ...formData, ...newData });
  };
  
  const handleCreateBusiness = (businessId: number) => {
    setCreatedBusinessId(businessId);
    setCurrentStep('payment');
  };
  
  const handlePaymentSuccess = () => {
    setCurrentStep('success');
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
      
      <main className="flex-grow">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">List Your Business on Derra</h1>
          
          {currentStep === 'success' ? (
            <div className="max-w-lg mx-auto text-center py-12">
              <div className="flex justify-center mb-6">
                <CheckCircle2 className="h-24 w-24 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Success!</h2>
              <p className="text-muted-foreground mb-8">
                Your business listing has been created and is now live on Derra.
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/business/${createdBusinessId}`)}
                >
                  View Your Listing
                </Button>
                <Button onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="flex border-b">
                <button 
                  className={`px-6 py-4 text-sm font-medium ${currentStep === 'details' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                  onClick={() => currentStep !== 'payment' && setCurrentStep('details')}
                  disabled={currentStep === 'payment'}
                >
                  1. Business Details
                </button>
                <button 
                  className={`px-6 py-4 text-sm font-medium ${currentStep === 'preview' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                  onClick={() => currentStep !== 'payment' && setCurrentStep('preview')}
                  disabled={currentStep === 'payment'}
                >
                  2. Preview & Confirm
                </button>
                <button 
                  className={`px-6 py-4 text-sm font-medium ${currentStep === 'payment' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                  disabled
                >
                  3. Payment
                </button>
              </div>
              
              <div className="p-6">
                {currentStep === 'details' && (
                  <ListingForm 
                    formData={formData} 
                    onUpdateFormData={handleUpdateFormData} 
                    onNext={() => setCurrentStep('preview')} 
                  />
                )}
                
                {currentStep === 'preview' && (
                  <ListingPreview 
                    formData={formData} 
                    onBack={() => setCurrentStep('details')}
                    onSubmit={handleCreateBusiness}
                  />
                )}
                
                {currentStep === 'payment' && createdBusinessId && (
                  <CreatePayment 
                    businessId={createdBusinessId}
                    onSuccess={handlePaymentSuccess}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
