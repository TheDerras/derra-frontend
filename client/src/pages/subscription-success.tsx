import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SubscriptionSuccess() {
  const [, setLocation] = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [businessId, setBusinessId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [, params] = useRoute("/subscription/success");
  
  // Get the order ID from URL query parameters
  const query = new URLSearchParams(window.location.search);
  const orderId = query.get("token");

  useEffect(() => {
    async function verifyPayment() {
      if (!orderId) {
        setError("Missing payment information");
        setIsVerifying(false);
        return;
      }

      try {
        const response = await apiRequest("POST", "/api/subscription/verify", { 
          orderId 
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to verify payment");
        }
        
        const data = await response.json();
        setBusinessId(data.businessId);
        toast({
          title: "Payment Successful",
          description: "Your subscription has been activated!",
          variant: "default",
        });
      } catch (err: any) {
        console.error("Payment verification error:", err);
        setError(err.message || "Failed to verify payment");
        toast({
          title: "Payment Verification Failed",
          description: err.message || "There was a problem verifying your payment",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    }

    verifyPayment();
  }, [orderId, toast]);

  return (
    <div className="container mx-auto py-20 px-4 max-w-3xl">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Subscription {isVerifying ? "Processing" : error ? "Error" : "Successful"}</CardTitle>
          <CardDescription>
            {isVerifying 
              ? "We're confirming your payment..." 
              : error 
                ? "There was a problem with your subscription" 
                : "Your business listing subscription is now active!"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          {isVerifying ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-lg text-muted-foreground">Verifying your payment...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="rounded-full bg-destructive/10 p-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="42" 
                  height="42" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-destructive"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <p className="text-lg font-medium">Payment Verification Failed</p>
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="rounded-full bg-green-50 p-3">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <p className="text-lg font-medium">Payment Successful!</p>
              <p className="text-muted-foreground">
                Your business listing subscription has been activated. Your listing is now visible to everyone!
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-4 pb-6">
          <Button 
            onClick={() => setLocation("/")}
            variant="outline"
          >
            Return to Home
          </Button>
          {businessId && (
            <Button
              onClick={() => setLocation(`/business/${businessId}`)}
            >
              View Your Listing
            </Button>
          )}
          {businessId && (
            <Button
              onClick={() => setLocation("/dashboard")}
              variant="secondary"
            >
              Go to Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}