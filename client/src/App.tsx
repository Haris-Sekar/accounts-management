import Pages from "./pages/Pages";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <Router>
      <ToastContainer closeOnClick />
      <Pages />
    </Router>
  );
}

export default App;