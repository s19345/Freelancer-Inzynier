

function Sidebar() {
    return (
        <div className="sidebar">
            <h2>Sidebar</h2>
            <ul>
                <li><a href="#dashboard">Dashboard</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#clients">Clients</a></li>
                <li><a href="#calendar">Calendar</a></li>
                <li><a href='/create-project'>Stw�rz projekt</a></li>
                <li><a href='/create-client'>Stw�rz klienta</a></li>

            </ul>
        </div>
    )
}

export default Sidebar;