import './App.css';
import {BrowserRouter, Routes, Route} from "react-router";
import {Provider} from 'react-redux'
import {store, persistor} from './redux/store'
import Dashboard from "./components/layout/Dashboard";
import Login from "./components/user/Login";
import Logout from "./components/user/Logout";
import Register from "./components/user/Register";
import UserProfile from "./components/user/UserProfile";
import EditProfile from "./components/user/EditProfile";
import ChangePassword from "./components/user/ChangePassword";
import {PersistGate} from 'redux-persist/integration/react';
import Home from "./components/layout/Home";
import PasswordResetConfirm from "./components/user/PasswordResetConfirm";
import CreateProject from "./components/Project/CreateProject";
import CreateClient from "./components/client/CreateClient";
import ProjectDetails from "./components/Project/ProjectDetails";
import EditProject from "./components/Project/EditProject";
import UserProjectsList from "./components/Project/UserProjectList";
import ClientList from "./components/client/ClientList";
import ClientDetails from './components/client/ClientDetails';
import EditClient from './components/client/EditClient';
import CreateTaskForm from "./components/task/CreateTask";
import TaskDetails from "./components/task/TaskDetails";
import EditTask from "./components/task/EditTask";
import InvitationList from "./components/invitations/InvitationList";
import paths from "./paths";


function App() {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Routes>
                        <Route element={<Home/>}>
                            <Route path={paths.home} element={<Dashboard/>}/>
                            <Route path={paths.login} element={<Login/>}/>
                            <Route path={paths.logout} element={<Logout/>}/>
                            <Route path={paths.register} element={<Register/>}/>
                            <Route path={paths.profile} element={<UserProfile/>}/>
                            <Route path={paths.passwordReset} element={<PasswordResetConfirm/>}/>
                            <Route path={paths.editProfile} element={<EditProfile/>}/>
                            <Route path={paths.changePassword} element={<ChangePassword/>}/>
                            <Route path={paths.clients} element={<ClientList/>}/>
                            <Route path={paths.client()} element={<ClientDetails/>}/>
                            <Route path={paths.createClient} element={<CreateClient/>}/>
                            <Route path={paths.editClient()} element={<EditClient/>}/>
                            <Route path={paths.projectList} element={<UserProjectsList/>}/>
                            <Route path={paths.createProject} element={<CreateProject/>}/>
                            <Route path={paths.project()} element={<ProjectDetails/>}/>
                            <Route path={paths.editProject()} element={<EditProject/>}/>
                            <Route path={paths.createTask()} element={<CreateTaskForm/>}/>
                            <Route path={paths.taskDetails()} element={<TaskDetails/>}/>
                            <Route path={paths.editTask()} element={<EditTask/>}/>
                            <Route path={paths.createSubtask()} element={<CreateTaskForm/>}/>
                            <Route path={paths.friends} element={<FriendsList/>}/>
                            <Route path={paths.statistics} element={<div>Statistics Page</div>}/>
                            <Route path={paths.finances} element={<div>Finances Page</div>}/>
                            <Route path={paths.calendar} element={<div>Calendar Page</div>}/>
                            <Route path={paths.invitationList} element={<InvitationList/>}/>
                        </Route>
                    </Routes>
                </PersistGate>
            </Provider>
        </BrowserRouter>
    );
}

export default App;
