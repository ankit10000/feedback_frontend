import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FeedbackForm from "./components/FeedbackForm";
import ShowFeedBackData from "./components/ShowFeedBackData";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<FeedbackForm />} />
                <Route path="/show_data" element={<ShowFeedBackData />} />
            </Routes>
        </Router>
    );
}

export default App;
