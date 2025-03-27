import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import { ProtectedRoute } from "./lib/protected-route";
import DashboardPage from "./pages/dashboard-page";
import ProvidersPage from "./pages/providers-page";
import ProviderProfilePage from "./pages/provider-profile-page";
import TradeAccountPage from "./pages/trade-account-page";
import CheckoutPage from "./pages/checkout-page";
import CheckoutSuccessPage from "./pages/checkout-success-page";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/providers" component={ProvidersPage} />
      <ProtectedRoute path="/providers/:id" component={ProviderProfilePage} />
      <ProtectedRoute path="/trade-accounts/:id" component={TradeAccountPage} />
      <ProtectedRoute path="/checkout/:subscriptionId" component={CheckoutPage} />
      <ProtectedRoute path="/checkout/success/:subscriptionId" component={CheckoutSuccessPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
