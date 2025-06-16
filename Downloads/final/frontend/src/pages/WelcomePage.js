import { useNavigate } from "react-router-dom";

function WelcomePage() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Welcome to the Assessment Page</h1>
            <button onClick={() => navigate("/assessment/adult")}>Adult Assessment</button>
            <button onClick={() => navigate("/assessment/kids")}>Kids Assessment</button>
        </div>
    );
}

export default WelcomePage;
