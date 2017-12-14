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
      messagesList: [],
    }
    this.typing = false;
    this.lastTyping = 0;
    this.send = this.send.bind(this);
    this.isTyping = this.isTyping.bind(this);
    this.isNotTyping = this.isNotTyping.bind(this);
    this.updateTyping = this.updateTyping.bind(this);
  }

  componentDidMount(){
    socket.emit('roomChange', this.state.room)
    socket.on('getMessage', messages => {
      console.log(messages)
      this.setState({
        messagesList: messages
      })
      console.log(this.state.messagesList)
    });
    
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
    }, this.roomChange)
  }

  roomChange(){
    socket.emit('roomChange', this.state.room)
  }

  isTyping(){
    this.typing = true
    console.log('typing')
    socket.emit('typing', this.state.name)
  }

  isNotTyping(){
    this.typing = false
    console.log('nottyping')
    socket.emit('stopTyping', this.state.name)
  }

  updateTyping(){
    console.log('hi')
    if(!this.typing){
      console.log('hit')
      this.isTyping()
    }
    this.lastTyping = (new Date()).getTime();

    setTimeout(() => {
      var newTyping = (new Date()).getTime();
      var timeDiff = newTyping - this.lastTyping;
      console.log(timeDiff)
      if(timeDiff >= 2000 && this.typing){
        this.isNotTyping()
      }
    }, 2000)
  }

  render() {
    const messageList = this.state.messagesList.map((e,i) => {
      console.log(e)
      if(e.room == this.state.room){
        return(
          <div key={i} className="messageholder">
            <h1 className="messagename">{e.name}</h1>
            <h1 className="messagebody">{e.body}</h1>
          </div>
        )
      } else {
        return(
          <span key={i}></span>
        )
      }
    })

    return(
      <div className="papa">
          <select onChange={e => this.changeRoom(e.target.value)} className="dropdown">
            <option value={1} className="dropdownelem">Room 1</option>
            <option value={2} className="dropdownelem">Room 2</option>
            <option value={3} className="dropdownelem">Room 3</option>
          </select>
        <div className="chatholder">
          {messageList}
        </div>
          <div className="inputsholder" >
            <input className="inputname" placeholder="Name: " value={this.state.name} onChange={e => this.setState({name: e.target.value})}/>
            <input className="inputbody" placeholder="Message: " onKeyUp={this.updateTyping} value={this.state.body} onChange={e => this.setState({body: e.target.value})}/>
            <button className="button" onClick={this.send}>SEND</button>
          </div>
      </div>
    )
  }
}

export default App;
