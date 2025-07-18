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
import CreateProject from "./components/Project/CreateProject";
import CreateClient from "./components/client/CreateClient";
import ProjectDetails from "./components/Project/ProjectDetails";
import EditProject from "./components/Project/EditProject";
import UserProjectsList from "./components/Project/UserProjectList";
import ClientList from "./components/client/ClientList";
import ClientDetails from './components/client/ClientDetails';
import EditClient from './components/client/EditClient';
import TaskList from "./components/task/UserTaskList";
import CreateTaskForm from "./components/task/CreateTask";
import TaskDetails from "./components/task/TaskDetails";
import EditTask from "./components/task/EditTask";
import CreateSubtaskPage from "./components/task/subtask/CreateSubtask"


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
                            <Route path="/edit-profile" element={<EditProfile/>}/>
                            <Route path="/change-password" element={<ChangePassword/>}/>
                            <Route path="/create-project" element={<CreateProject/>}/>
                            <Route path="/create-client" element={<CreateClient/>}/>
                            <Route path="/project" element={<UserProjectsList/>}/>
                            <Route path="/project/:projectId" element={<ProjectDetails/>}/>
                            <Route path="/project/:projectId/edit" element={<EditProject/>}/>
                            <Route path="/clients" element={<ClientList/>}/>
                            <Route path="/client/:clientId" element={<ClientDetails/>}/>
                            <Route path="/client/:clientId/edit" element={<EditClient/>}/>
                            <Route path="/project/:projectId/tasks" element={<TaskList/>}/>
                            <Route path="/project/:projectId/create-task" element={<CreateTaskForm/>}/>
                            <Route path="/task/:taskId" element={<TaskDetails/>}/>
                            <Route path="/task/:taskId/edit" element={<EditTask/>}/>
                            <Route path="/tasks/:taskId/subtasks/create" element={<CreateSubtaskPage/>}/>


                        </Route>
                    </Routes>
                </PersistGate>
            </Provider>
        </BrowserRouter>
    );
}

export default App;
