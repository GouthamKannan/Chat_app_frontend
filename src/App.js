import React from 'react';
import './App.css';
//Importing bootstrap and other modules
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Navbar } from 'react-bootstrap'


import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import Login from './components/login';
import Signup from './components/signup';
import ChatWindow from './components/chatwindow';
import ForgetPassword from './components/forget_password';
import Footer from './components/footer';
import ResetPassword from './components/reset_password'

function App() {

    return (

        <BrowserRouter >
        <Routes >
        <Route path = "/" element = {
            <div >
                <Navbar bg = "light" expand = "lg" >
                    <div style = { { "float": "left", "margin-left": "10%" } } >
                        <p > Chat Application </p>
                    </div>
                </Navbar>
                <Login />
            </div>
        }/>

        <Route path = "/login/:msg" element = {
            <div >
                <Navbar bg = "light" expand = "lg" >
                    <div style = { { "float": "left", "margin-left": "10%" } } >
                        <p > Chat Application </p>
                    </div>
                </Navbar>
                <Login />
            </div>
        }/>

        <Route path = "/sign-up" element = {
            <div >
                <Navbar bg = "light" expand = "lg" >
                    <div style = { { "float": "left", "margin-left": "10%" } } >
                        <p > Chat Application </p>
                    </div>
                </Navbar>
                <Signup />
            </div>
        } />

        <Route path = "/forget-password" element = {
            <div >
                <Navbar bg = "light" expand = "lg" >
                    <div style = { { "float": "left", "margin-left": "10%" } } >
                        <p > Chat Application </p>
                    </div>
                </Navbar>
                <ForgetPassword />
            </div>
        } />
        <Route path = "/reset-password/:id" element = {
            <div >
                <Navbar bg = "light" expand = "lg" >
                    <div style = { { "float": "left", "margin-left": "10%" } } >
                        <p > Chat Application </p>
                    </div>
                </Navbar>
                <ResetPassword />
            </div>
        } />

        <Route path = "/chat-window/:user_name" element = { <ChatWindow /> } />
        </Routes>
        <Footer />
        </BrowserRouter>

    )
};

export default App;