import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router";
import {Provider} from 'react-redux'
import {store, persistor} from './redux/store'
import Dashboard from "./components/Dashboard";
import Login from "./components/user/Login";
import Logout from "./components/user/Logout";
import Register from "./components/user/Register";
import UserProfile from "./components/user/UserProfile";
import {PersistGate} from 'redux-persist/integration/react';
import Home from "./components/layout/Home";

function App() {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Routes>
                        <Route element={<Home/>}>
                            <Route path="/" element={<Dashboard/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/logout" element={<Logout/>}/>
                            <Route path="/register" element={<Register/>}/>
                            <Route path="/profile" element={<UserProfile/>}/>
                        </Route>
                    </Routes>
                </PersistGate>
            </Provider>
        </BrowserRouter>
    );
}

export default App;
