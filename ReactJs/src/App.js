// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaymentWidget from "./components/PaymentWidget"
import ResultPage from "./components/ResultPage";
import './App.scss'
// import Users from "./components/img/UsersData/usersData";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaymentWidget />} />
        <Route path="/result" element={<ResultPage />} />
        {/* <Route path="usersData" element={<Users/>}/> */}
      </Routes>
    </Router>
  );
}

export default App;
