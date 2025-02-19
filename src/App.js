import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
// import SearchResults from "./pages/SearchResults";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="/results" element={<SearchResults />} /> */}
            </Routes>
        </Router>
    );
}

export default App;
