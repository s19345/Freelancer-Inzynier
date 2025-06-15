import { Link } from "react-router";

function Sidebar() {
    return (
        <div className="sidebar">
            <h2>Sidebar</h2>
            <ul>
                <li><a href="#dashboard">Dashboard</a></li>
                <li><Link to="/project">Projects</Link></li>
                <li><a href="#clients">Clients</a></li>
                <li><a href="#calendar">Calendar</a></li>
                <li><a href='/create-project'>Stwórz projekt</a></li>
                <li><a href='/create-client'>Stwórz klienta</a></li>
            </ul>
        </div>
    )
}

export default Sidebar;