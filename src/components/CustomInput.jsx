import React from 'react';
import style from './Calendar.css';

class CustomInput extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        return (
                    <button
                        className="btn btn-primary"
                        onClick={this.props.onClick}>
                        {this.props.value}
                    </button>
        );
    }
}

export default CustomInput;