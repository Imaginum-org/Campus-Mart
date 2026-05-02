import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes.jsx";

function App() {
  return (
    <div className="App">
      <AppRoutes />
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
