import React, { Component } from 'react';
import './App.css';

import io from 'socket.io-client';

const socket = io();

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      name: '',
      body: '',
      room: 1,
      joined: false,
      messages: []
    }
    this.send = this.send.bind(this);
  }

  componentDidMount(){
    socket.on('getMessage', message => {
      console.log('in getMessage')
      if(this.state.room === message.room){
        console.log('in room ' + message.room)
        console.log(message)
        var newMessages = this.state.messages
        newMessages.push(message)
        this.setState({
          messages: newMessages
        })
      }
    })
  }

  send(){
    socket.emit('sendMessage', {
      name: this.state.name,
      body: this.state.body,
      room: this.state.room
    })
    this.setState({
      body: ''
    })
  }

  changeRoom(num){
    this.setState({
      room: num
    })
  }

  render() {
    const messageList = this.state.messages.map((e,i) => {
      if(e.room === this.state.room){
        return(
          <div key={i}>
            {e.name}           {e.body}
          </div>
        )
      } else {
        return(
          <span key={i}></span>
        )
      }
    })

    return(
      <div>
        <input value={this.state.name} onChange={e => this.setState({name: e.target.value})}/>
        <input value={this.state.body} onChange={e => this.setState({body: e.target.value})}/>
        <button onClick={this.send}>SEND</button>
        <select onChange={e => this.changeRoom(e.target.value)}>
          <option value={1}>Room 1</option>
          <option value={2}>Room 2</option>
          <option value={3}>Room 3</option>
        </select>
        {messageList}
      </div>
    )
  }
}

export default App;
