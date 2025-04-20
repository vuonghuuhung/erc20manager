import TransactionIndicator from "./components/TransactionIndicator/TransactionIndicator";
import useRouterElements from "./useRouterElements";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const routeElements = useRouterElements();
  return (
    <div>
      {routeElements}
      <Toaster />
      <TransactionIndicator />
    </div>
  );
}

export default App;
