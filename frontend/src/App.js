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
import EditProfile from "./components/user/EditProfile";
import ChangePassword from "./components/user/ChangePassword";
import {PersistGate} from 'redux-persist/integration/react';
import Home from "./components/layout/Home";
import PasswordResetConfirm from "./components/user/PasswordResetConfirm";

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
                            <Route path="password-reset/:uid/:token" element={<PasswordResetConfirm/>}/>
                            <Route path="/edit-profile" element={<EditProfile />}/>
                            <Route path="/change-password" element={<ChangePassword />} />
                        </Route>
                    </Routes>
                </PersistGate>
            </Provider>
        </BrowserRouter>
    );
}

export default App;
