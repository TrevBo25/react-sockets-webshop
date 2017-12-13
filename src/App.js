import React, { Component } from 'react';
import './App.css';

import io from 'socket.io-client';

const socket = io();

class App extends Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }
  render() {
    return (
      <div>
        
      </div>
    );
  }
}

export default App;
