import React, { Component } from 'react';
import GroupName from './group_name';
import configs from '../config';

// Sidebar component
class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            group_details : [],
            get_group : this.props.get_group,
            get_new_group : false,
            new_group_name : "",
            new_group_description : ""
        }
        this.add_group = this.add_group.bind(this);
        this.close_add_group = this.close_add_group.bind(this);
        this.create_group = this.create_group.bind(this);
    }

    componentDidMount = async() => {
        const windowUrl = window.location;
        this.state.user = windowUrl.toString().split('/').pop();

        const response = await fetch(configs.api_url + "/group/get_groups", {
            method : "GET",
            credentials: "include",
        })
        const data = await response.json()

        this.setState({group_details : data.data})
    }

    // Get the group components
    get_groups() {
        return this.state.group_details.map(current_group => {
            return (
                <div style={{"float" : "left", "margin-bottom" : "1%"}}>
                    <GroupName
                        group_name={current_group.group_name}
                        group_description={current_group.group_description}
                        click_function = {this.props.get_group}
                    />
                </div>

            )

        })
    }

    // Add a new group
    add_group() {
        this.setState({get_new_group : true})
    }

    // Close the add group form
    close_add_group() {
        this.setState({
            new_group_name : "",
            new_group_description : "",
            get_new_group : false
        })
    }

    handleChange = ({ target: { name, value } }) => {
        this.setState({ ...this.state, [name]: value });
      };

    // Check if group name already exists
    is_group_exists(new_group_name) {
        var exists = false;
        for(var i=0; i<this.state.group_details.length; i++) {
            if(this.state.group_details[i].group_name === new_group_name) {
                exists = true
                return exists
            }
        }
        return exists
    }

    // Create a new group
    create_group = async(e) => {
        e.preventDefault()

        // Check if group already exists
        if(this.state.new_group_name.length > 0) {

            if(this.is_group_exists(this.state.new_group_name)) {
                alert("Group name already exists")
            }

            else {

                // Create a new group using API
                var response = await fetch(configs.api_url + "/group/create_group", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        group_name : this.state.new_group_name,
                        group_description : this.state.new_group_description
                    })
                })
                var data = await response.json()

                // Get all the groups from the database
                response = await fetch(configs.api_url + "/group/get_groups", {
                    method : "GET",
                    credentials: "include",
                })
                data = await response.json()
                this.setState({
                    group_details : data.data,
                    new_group_name : "",
                    new_group_description : "",
                    get_new_group : false
                })
            }
        }
    }


    render() {

        return (
            <div class="col-4 px-0">
                <div class="bg-white">

                    <div class="bg-gray px-4 py-2 bg-light">
                    <p class="h5 mb-0 py-1">Available Groups</p>
                    </div>

                    <div class="messages-box">
                    <div class="list-group rounded-0">
                    {this.get_groups()}
                    </div>
                    <button className="btn btn-primary btn-block" style={{"margin-left" : "40%", "margin-top" : "10%", "margin-bottom" : "10%"}}
                    onClick={this.add_group}>Add group</button>
                    <div>
                    {this.state.get_new_group ? (
                        <div className="mx-5">
                        <form onSubmit={this.create_group}>
                            <h3>Create new group</h3>
                            <div className="form-group">
                                <label>Group name</label>
                                <input type="text" name="new_group_name" className="form-control" placeholder="Enter group name"
                                 value={this.state.new_group_name} onChange={evt => this.handleChange(evt)}/>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <input type="text" name="new_group_description" className="form-control" placeholder="Enter group description"
                                value={this.state.new_group_description} onChange={evt => this.handleChange(evt)}/>
                            </div>
                            <div style={{"margin-left" : "25%"}}>
                            <button type="submit" className="btn btn-primary btn-block" style={{"float" : "left", "margin" : "5%"}}>Submit</button>
                            <button onClick={this.close_add_group} className="btn btn-primary btn-block" style={{"float" : "left", "margin" : "5%"}}>Close</button>
                            </div>
                        </form>
                    </div>
                    ) : (
                        <div></div>
                    )

                    }
                    </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Sidebar;