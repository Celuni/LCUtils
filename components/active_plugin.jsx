'use babel';

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

class ActivePlugin extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const Controls = this.props.plugin.controls;
        
        return (
            <div id={this.props.plugin.name + "_div"} className="plugin_div">
                <p className="name_and_version">{this.props.plugin.name} - {this.props.plugin.version}</p>
                <p className="description">{this.props.plugin.description}</p>
                <p className="author">{this.props.plugin.author}</p>
                <Controls plugin={this.props.plugin} />
                <hr></hr>
            </div>
        );
    }
}

ActivePlugin.propTypes = {
    plugin: PropTypes.object
}

module.exports = ActivePlugin;