import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[75vh] px-4">
      <Card className="max-w-md w-full p-6 text-center shadow-lg border rounded-2xl">
        <CardHeader className="flex flex-col items-center gap-2 p-0">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
          <CardTitle className="text-2xl font-bold tracking-tight">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-4 p-0 space-y-4">
          <p className="text-sm text-muted-foreground">
            Thank you for your purchase. Your order has been placed and confirmed successfully.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Button
              onClick={() => navigate("/shop/account")}
              className="w-full h-11 rounded-xl text-base"
            >
              View My Orders
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/shop/home")}
              className="w-full h-11 rounded-xl text-base"
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;