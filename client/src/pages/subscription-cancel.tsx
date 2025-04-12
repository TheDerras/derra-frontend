import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function SubscriptionCancel() {
  const [, setLocation] = useLocation();

  return (
    <div className="container mx-auto py-20 px-4 max-w-3xl">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Payment Cancelled</CardTitle>
          <CardDescription>
            Your subscription payment was cancelled
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="rounded-full bg-orange-50 p-3">
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
                className="text-orange-500"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-lg font-medium">Payment Cancelled</p>
            <p className="text-muted-foreground max-w-md">
              You've cancelled the payment process. Your business listing will not be activated until you complete the payment.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 pb-6">
          <Button 
            onClick={() => setLocation("/")}
            variant="outline"
          >
            Return to Home
          </Button>
          <Button
            onClick={() => setLocation("/create-listing")}
          >
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}