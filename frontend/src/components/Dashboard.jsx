import Sidebar from './Sidebar';
import SearchField from './SearchField';

function Dashboard() {
    return (
        <div>
            <header>
                <h1>My Dashboard</h1>
                <div>
                    <SearchField />
                </div>
            </header>
            <div>
                <h2>Dashboard</h2>
                <p>Welcome to the dashboard!</p>
            </div>
            <Sidebar />
        </div>
    )
}

export default Dashboard;