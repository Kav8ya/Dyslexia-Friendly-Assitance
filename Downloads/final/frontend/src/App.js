import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import AdultAssessment from "./pages/AdultAssessment";
import KidsAssessment from "./pages/KidsAssessment";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/assessment/adult" element={<AdultAssessment />} />
                <Route path="/assessment/kids" element={<KidsAssessment />} />
            </Routes>
        </Router>
    );
}

export default App;
