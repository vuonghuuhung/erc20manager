import useRouterElements from "./useRouterElements";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const routeElements = useRouterElements();
  return (
    <div>
      {routeElements}
      <Toaster />
    </div>
  );
}

export default App;
