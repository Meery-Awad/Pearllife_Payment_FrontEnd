// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaymentWidget from "./components/PaymentWidget"
import ResultPage from "./components/ResultPage";
import './App.scss'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaymentWidget />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;
