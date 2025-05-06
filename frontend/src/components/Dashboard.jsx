import Sidebar from './Sidebar';
import SearchField from './SearchField';

function Dashboard() {
    return (
        <div className="dashboard">
            <header>
                <h1>My Dashboard</h1>
                <div className="search-field">
                    <SearchField />
                </div>
            </header>
            <div className="content">
                <h2>Dashboard</h2>
                <p>Welcome to the dashboard!</p>
            </div>
            <Sidebar />
        </div>
    )
}

export default Dashboard;