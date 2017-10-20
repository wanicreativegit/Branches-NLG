import React, { Component } from 'react';


export default class MyGreatPlace extends Component {


    render() {
        return (
            <div className="marker">
            <div className="text">
            {this.props.text}
            </div>
            </div>
        );
    }
}