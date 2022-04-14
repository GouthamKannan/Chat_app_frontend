import React, { Component } from 'react';
import Sidebar from './sidebar';
import {Navbar} from 'react-bootstrap'
import Cookies from 'js-cookie';
import configs from '../config'
import socketClient from 'socket.io-client'


// Chat window component
class ChatWindow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chats : [],
            user : "",
            group_name : "",
            group_description : ""
        }
        this.get_group = this.get_group.bind(this);
        this.log_out = this.log_out.bind(this);
    }

    componentDidMount = async() => {

        // Update the user name in state
        const windowUrl = window.location;
        this.setState({user_name : windowUrl.toString().split('/').pop().replace("?", "").replace("#", "")});

        // Get the availabel groups in the database
        const response = await fetch(configs.api_url + "/group/get_groups", {
          method : "GET",
          credentials: "include",
        })
        const data = await response.json()

        // Update the state with group details
        if (data.data.length > 0) {
            this.setState({group_details : data.data[0].group_name})
            this.setState({group_description : data.data[0].group_description})
        }

        // Intialize the socket for communication
        var socket = socketClient(configs.socket_url)
        socket.on('connection', () => {console.log("Connected to backend")})

        // Handle new message from server
        socket.on("new_message", (chat_data) => {
            this.setState({chats : chat_data})
        })
        this.socket = socket;
    }

    // Update the state on clicking on the group
    get_group = async(group_name, group_description) => {
        const response = await fetch(configs.api_url + "/chat/get_chats?group=" + group_name, {
            method : "GET",
            credentials: "include",
        })

        // Update the chat in the state variable
        const data = await response.json()
        this.setState({
            chats : data.data,
            group_name : group_name,
            group_description : group_description
        })
    }

    // get the username from state
    get_user_name() {
        return this.state.user_name
    }

    // Handle log out
    log_out = async() => {
        Cookies.remove("session_id")
        await fetch(configs.api_url + "/user/logout", {
          method : "GET",
          credentials: "include",
        })
        window.location = "/"
    }

    // Add the group name above the chats if group is selected
    get_header() {
        if(this.state.group_name.length>0) {
            return (
                <div class="bg-gray px-4 py-2">
                    <p class="h5 mb-0 py-1">{this.state.group_name}</p>
                    <br></br>
                    <p>{this.state.group_description}</p>
                    <hr className="my-1"></hr>
                </div>
            )
        }
        else {
            return (
                <div class="bg-gray px-4 py-2">
                    <p class="h5 mb-0 py-1">Select a group to chat</p>
                    <hr className="my-1"></hr>
                </div>
            )
        }
    }

    // Put the chat data inside html tag to render
    get_chat() {

        var chat_data = []
        for (var i=0; i<this.state.chats.length; i++) {
            if (this.state.chats[i].group_name === this.state.group_name) {
                if (this.state.chats[i].user_name === this.state.user_name) {
                    chat_data.push(
                        <div className="media w-100 ml-auto mb-3" style={{"padding-left" : "50%", "padding-right" : "0%"}}>
                            <p className="text-small mb-0 text-muted"><b>You</b></p>
                            <div className="media-body">
                            <div className="bg-primary rounded py-2 px-3 mb-2">
                                <p className="text-small mb-0 text-white">{this.state.chats[i].message}</p>
                            </div>
                            <p className="small text-muted">{this.state.chats[i].timestamp}</p>
                            </div>
                        </div>
                    )
                }
                else {
                    chat_data.push(
                        <div className="media w-50 mb-3">
                            <p className="text-small mb-0 text-muted"><b>{this.state.chats[i].user_name}</b></p>
                            <div className="media-body ml-3">
                            <div className="bg-light rounded py-2 px-3 mb-2">
                                <p className="text-small mb-0 text-muted">{this.state.chats[i].message}</p>
                            </div>
                            <p className="small text-muted">{this.state.chats[i].timestamp}</p>
                            </div>
                        </div>
                    )
                }
            }
        }
        return(chat_data)
    }

    // Handle new messages from the user
    add_message = async(e) => {
        e.preventDefault();

        // Get the timestamp
        var today = new Date()
        var timestamp = today.getDate() + "/" + today.getMonth() + "/" + today.getFullYear() +
                        " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()

        // Emit the message to the socket server
        this.socket.emit("add_message", {
            user_name : this.state.user_name,
            group_name : this.state.group_name,
            timestamp : timestamp,
            message : this.state.message
        })

        this.setState({
            message: ""
          });
    }

    // Update the entered message in the state
    update_message(evt) {
        this.setState({
          message: evt.target.value
        });
      }

    render() {

        // Check whether user logged in or not
        if(Cookies.get('session_id')) {

          return (
              <div className="mb-3">
              <Navbar bg="light" expand="lg">
                <div style={{"float" : "left", "margin-left" : "20%"}}>
                    <span >{this.state.user_name}</span>
                </div>
                <div style={{"float" : "left", "margin-left" : "60%"}}>
                    <button className="btn btn-secondary btn-block" onClick={this.log_out}>Log out</button>
                </div>
              </Navbar>
              <div className="maincontainer">
              <div className="container py-3 px-4">
              <div className="row rounded-lg overflow-hidden shadow">
              <Sidebar get_group={this.get_group}/>

                <div className="col-8 px-0">

                {this.get_header()}

                <div className="px-4 py-5 chat-box bg-white">
                {this.get_chat()}
                <div>
                <hr className="my-5"></hr>
                <form className="bg-light" onSubmit={this.add_message}>

                <div className="input-group">
                    <input type="text" placeholder="Type a message" aria-describedby="button-addon2" className="form-control rounded-0 border-0 py-2 bg-light"
                    value={this.state.message} onChange={evt => this.update_message(evt)}/>
                    <div className="input-group-append">
                    <button id="button-addon2" type="submit" className="btn btn-link"> <i className="fa fa-paper-plane"></i></button>
                    </div>
                </div>
                </form>
                </div>

                </div>
                </div>
              </div>
              </div>
              </div>
              </div>
          )
        }
        else{
          window.location = "/";
        }
    }
}

export default ChatWindow;
