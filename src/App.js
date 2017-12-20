import React, { Component } from 'react';
import Toolbar from './components/Toolbar'
import Messages from './components/Messages'
import './App.css';



class App extends Component {
  constructor(){
    super()
    this.state = {emails:[],
    toolbarChecked: ''
    }

    this.bulkCheck = this.bulkCheck.bind(this)
  }

  // baseOperations = (cb) =>{
  //   if(!this.state.emails.some(email => email.selected)) return null
  //
  // }

  async componentDidMount() {
    const emailResponse = await fetch('http://localhost:8082/api/messages')
    const emailsJson = await emailResponse.json()
    const emails = emailsJson._embedded.messages
    let toolbarCheck
    if(emails.every(email => email.selected === true)){toolbarCheck = 'every'}
    else if(emails.some(email => email.selected === true)){toolbarCheck = 'some'}
    else{toolbarCheck = 'none'}
    this.setState({emails: emails, toolbarChecked: toolbarCheck})
  }

  async componentWillUpdate(props) {
    const emailResponse = await fetch('http://localhost:8082/api/messages')
    const emailsJson = await emailResponse.json()
    const emails = emailsJson._embedded.messages
    let toolbarCheck
    if(emails.every(email => email.selected === true)){toolbarCheck = 'every'}
    else if(emails.some(email => email.selected === true)){toolbarCheck = 'some'}
    else{toolbarCheck = 'none'}
    if(props !== this.props) this.setState({emails: emails, toolbarChecked: toolbarCheck})
  }

  async updateDb(ids, command, value){
    const body = {
      "messageIds": ids,
      "command": command,
      value
      }
    const response = await fetch('http://localhost:8082/api/messages', {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
  }

  bulkCheck = (e) => {
    if(this.state.toolbarChecked === 'every'){
      const copied = this.copyEmails().map(email => {
        email.selected=false;
        return email
      })

      this.setState({emails: copied, toolbarChecked: 'none'})
    }else{
      const copied = this.copyEmails().map(email => {
        email.selected = true
        return email
      })

      this.setState({emails: copied, toolbarChecked: 'every'})
    }
  }

  copyEmails = () => {
    const copied = [...this.state.emails]
    return copied
  }

  markAsRead = () => {
    if(!this.state.emails.some(email => email.selected)) return null
    const copied = this.copyEmails().filter(email => {
      if(email.selected === true) return email
    }).map(email=> email.id)
    this.updateDb(copied, 'read', {"read": true})
    .then(result => {
      this.componentWillUpdate()
    })
  }

  markAsUnread = () => {
    if(!this.state.emails.some(email => email.selected)) return null
    const copied = this.copyEmails().filter(email => {
      if(email.selected === true) return email
    }).map(email => email.id)
    this.updateDb(copied, 'read', {"read": false})
      .then(result => {
        this.componentWillUpdate()
      })
  }

  deleteMessages = (e) => {
    if(!this.state.emails.some(email => email.selected)) return null
    const copied = this.copyEmails().filter(email => email.selected != true).map(email => email.id)
    this.updateDb(copied, 'delete')
      .then(result => {
        this.componentWillUpdate()
      })
  }



  applyLabel = (e) => {
    if(!this.state.emails.some(email => email.selected)) return null
    const newLabel = e.target.value
    const copied = this.copyEmails().filter(email => {
      if(email.selected === true && !email.labels.includes(newLabel) && newLabel !== 'Apply label')
      return email
    }).map(email=> email.id)
    console.log(copied);
    e.target.selectedIndex = 0
    this.updateDb(copied, 'addLabel', {"label": newLabel})
      .then(result => {
        this.componentWillUpdate()
      })
  }

  removeLabel = (e) => {
    if(!this.state.emails.some(email => email.selected)) return null
    const removeLabel = e.target.value
    const copied = this.copyEmails().filter(email => {
      if(email.selected === true && email.labels.includes(removeLabel) && removeLabel !== 'Apply label') return email
    }).map(email => email.id)
    e.target.selectedIndex = 0
    this.updateDb(copied, 'removeLabel', {"label": removeLabel})
      .then(result => {
        this.componentWillUpdate()
      })
  }

  resolveStar = (e) => {
    const targetId = [...e.target.id.split('-')[1]]
    const value = e.target.className === 'star fa fa-star' ? false : true
    this.updateDb(targetId, 'star', {"star": value})
      .then(result => {
        this.componentWillUpdate()
      })
  }

  resolveCheck = (e) => {
    const targetId = [...e.target.id.split('-')[1]]
    const copied = this.copyEmails().filter(email => email.id === targetId)
    const value = copied.selected ? false : true
    this.updateDb(targetId, 'star', {"selected": value})
      .then(result => {
        this.componentWillUpdate()
      })
  }



  render() {
    return (
      <div className="App container">
        <Toolbar
          emails={this.state.emails}
          toolbarChecked={this.state.toolbarChecked}
          bulkCheck={this.bulkCheck}
          markAsRead={this.markAsRead}
          markAsUnread={this.markAsUnread}
          applyLabel={this.applyLabel}
          removeLabel={this.removeLabel}
          deleteMessages={this.deleteMessages}
        />
        <Messages
          emails={this.state.emails}
          clickStar={this.resolveStar}
          clickBox={this.resolveCheck}
         />
      </div>
    );
  }
}

export default App;
