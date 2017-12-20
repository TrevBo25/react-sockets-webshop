import React, { Component } from 'react';
import './App.css';

// socket.io-client is added when you add the socket.io dependency. It is the client library that loads on the browser side.
import io from 'socket.io-client';

// There is no specific direction when creating the global socket, it defaults to trying to connect to the host that serves the page AKA the server
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
      typers: [],
    }

    this.typing = false;
    this.lastTyping = 0;

    this.send = this.send.bind(this);
    this.isTyping = this.isTyping.bind(this);
    this.isNotTyping = this.isNotTyping.bind(this);
    this.updateTyping = this.updateTyping.bind(this);
  }

  componentDidMount(){

    // Gets the messages on connection

    socket.emit('join')

    // Everyone including the sender

    socket.on('getMessage', messages => {
      this.setState({
        messagesList: messages
      })
    });

    // 





    // Everyone but the sender

    socket.on('newTyper', name => {
        let newTypers = this.state.typers
        newTypers.push(name)
        this.setState({
          typers: newTypers
        })
    });

    socket.on('oldTyper', name => {
      var newerTypers = this.state.typers;
      newerTypers.forEach((e, i, a) => {
        if(e === name){
          a.splice(i,1)
        }
      })
      this.setState({
        typers: newerTypers
      })
    });
    
    //

  }

  send(){

    // Everyone including the sender

    socket.emit('sendMessage', {
      name: this.state.name,
      body: this.state.body,
      room: this.state.room
    })
    this.setState({
      body: ''
    })

    //

  }

  changeRoom(num){
    this.setState({
      room: num
    })
  }

  isTyping(){
    this.typing = true
    socket.emit('typing', this.state.name)
  }

  isNotTyping(){
    this.typing = false
    socket.emit('stopTyping', this.state.name)
  }

  updateTyping(){
    if(!this.typing){
      this.isTyping()
    }
    this.lastTyping = (new Date()).getTime();
    setTimeout(() => {
      var newTyping = (new Date()).getTime();
      var timeDiff = newTyping - this.lastTyping;
      if(timeDiff >= 500 && this.typing){
        this.isNotTyping()
      }
    }, 500)
  }



  render() {
    const messageList = this.state.messagesList.map((e,i) => {
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

    const typersList = this.state.typers.map((e, i) => {
      return(
        <h5 className="typer" key={i}>{e} is typing...</h5>
      )
    })


    return(
      <div className="papa">
        <div className="typersholder">
          {typersList}
        </div>
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
