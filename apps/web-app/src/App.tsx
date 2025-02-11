import useRouterElements from "./useRouterElements";

function App() {
  const routeElements = useRouterElements();

  return <div>{routeElements}</div>;
}

export default App;
