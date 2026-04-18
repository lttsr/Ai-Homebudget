import "./App.css";
import AppProvider from "./providers/app";
import AppRoutes from "./routes/routes.tsx";

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
