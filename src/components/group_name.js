
import React, { Component } from 'react';

// Group name component
class GroupName extends Component {
    constructor(props){
        super(props);
        this.state = {
            group_name : this.props.group_name,
            group_description : this.props.group_description
        }
        this.handleClick = this.handleClick.bind(this)
    }

    // When clicking on the group name
    handleClick() {
        this.props.click_function(this.state.group_name, this.state.group_description)
    }


    render() {

        return (
            <button class="list-group-item list-group-item-action active text-white rounded-0" onClick={this.handleClick}>
                <div class="media"><img src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png" alt="user" width="50" class="rounded-circle" />
                    <div class="media-body ml-4">
                    <div class="d-flex align-items-center justify-content-between mb-1">
                        <h6 class="mb-0">{this.state.group_name}</h6>
                    </div>
                    <p class="font-italic mb-0 text-small">{this.state.group_description}</p>
                    </div>
                </div>
            </button>
        )
    }
}

export default GroupName;