import React, { Component } from 'react';
import Toolbar from './components/Toolbar'
import Messages from './components/Messages'
import Compose from './components/Compose'
import './App.css';



class App extends Component {
  constructor(){
    super()
    this.state = {
      emails:[],
      toolbarChecked: '',
      compose: false,
      selected: []
    }
    this.bulkCheck = this.bulkCheck.bind(this)
  }

  async componentDidMount() {
    const emails = await this.fetchEmails()
    let toolbarCheck
    if(emails.every(email => email.selected === true)){toolbarCheck = 'every'}
    else if(emails.some(email => email.selected === true)){toolbarCheck = 'some'}
    else{toolbarCheck = 'none'}
    this.setState({emails: emails, toolbarChecked: toolbarCheck})
  }

  fetchEmails = async () => {
    const emailResponse = await fetch('http://localhost:8082/api/messages')
    const emailsJson = await emailResponse.json()
    const emails = emailsJson._embedded.messages
    return emails
  }

  async updateDb(ids, command, value){
    let body = {
      "messageIds": ids,
      "command": command,
      }
      if(command !== 'delete'){
        body = Object.assign({}, body, value)
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

  async composeMessage(e){
    e.preventDefault()
    console.log('compose');
    const subject = e.target.subject.value
    const messageBody = e.target.body.value
    if(!subject || !messageBody) return null
    let body = {
      "subject": subject,
      "body": messageBody,
      }
      console.log(body);
    await fetch('http://localhost:8082/api/messages', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
   this.fetchEmails()
    .then(emails => {
      console.log(emails);
      this.setState({emails: emails})
    })
  }

  changeCompose = (value) => {
    this.setState({compose: value})
  }

  bulkCheck = (e) => {
    let selected
    if(this.state.toolbarChecked === 'every'){
      selected = []
      this.setState({selected: selected, toolbarChecked: 'none'})
    }else{
      selected = []
      selected = this.copyEmails().map(email => {
        return email.id
      })
      this.setState({selected: selected, toolbarChecked: 'every'})
    }
  }

  copyEmails = () => {
    const copied = [...this.state.emails]
    return copied
  }

  markAsRead = () => {
    if(!this.state.selected.length === 0) return null
    const copied = this.copyEmails().filter(email => {
      if(this.state.selected.includes(email.id)) return email
    }).map(email=> email.id)
    this.updateDb(copied, 'read', {"read": true})
    .then(result => {
      return this.fetchEmails()
    })
    .then(emails=> {
      this.setState({emails: emails})
    })
  }

  markAsUnread = () => {
    if(!this.state.selected.length === 0) return null
    const copied = this.copyEmails().filter(email => {
      if(this.state.selected.includes(email.id)) return email
    }).map(email=> email.id)
    this.updateDb(copied, 'read', {"read": false})
    .then(result => {
      return this.fetchEmails()
    })
    .then(emails => {
      this.setState({emails: emails})
    })
  }

  deleteMessages = (e) => {
    if(!this.state.selected.length === 0) return null
    const copied = this.copyEmails().filter(email => this.state.selected.includes(email.id)).map(email => email.id)
    this.updateDb(copied, 'delete')
      .then(result => {
        return this.fetchEmails()
      })
      .then(emails => {
        this.setState({emails: emails})
      })
  }

  applyLabel = (e) => {
    if(!this.state.selected.length === 0) return null
    const newLabel = e.target.value
    const copied = this.copyEmails().filter(email => {
      if(this.state.selected.includes(email.id) && !email.labels.includes(newLabel) && newLabel !== 'Apply label')
      return email
    }).map(email=> email.id)
    e.target.selectedIndex = 0
    this.updateDb(copied, 'addLabel', {"label": newLabel})
      .then(result => {
        return this.fetchEmails()
      })
      .then(emails => {
        this.setState({emails: emails})
      })
  }

  removeLabel = (e) => {
    if(!this.state.selected.length === 0) return null
    const removeLabel = e.target.value
    const copied = this.copyEmails().filter(email => {
      if(this.state.selected.includes(email.id) && email.labels.includes(removeLabel) && removeLabel !== 'Apply label')
      return email
    }).map(email=> email.id)
    e.target.selectedIndex = 0
    this.updateDb(copied, 'removeLabel', {"label": removeLabel})
      .then(result => {
        return this.fetchEmails()
      })
      .then(emails => {
        this.setState({emails: emails})
      })
  }

  resolveStar = (e) => {
    const targetId = [...e.target.id.split('-')[1]]
    const id = []
    id.push(parseInt(targetId[0]))
    const value = e.target.className === 'star fa fa-star' ? false : true
    this.updateDb(id, 'star', {"star": value})
    .then(result => {
      return this.fetchEmails()
    })
    .then(emails => {
      console.log(emails);
      this.setState({emails: emails})
    })
  }

  resolveCheck = (e) => {
    let selected = []
    const targetId = parseInt(e.target.id.split('-')[1])
    if(!this.state.selected.includes(targetId)) {
      selected = [...this.state.selected, targetId]
    }else{
      const index = this.state.selected.indexOf(targetId)
      selected = [...this.state.selected]
      selected.splice(index, 1)
    }
    let toolbarChecked
    if(selected.length === this.state.emails.length){
      toolbarChecked = 'every'
    }else if(selected.length === 0){
      toolbarChecked = 'none'
    }else{
      toolbarChecked = 'some'
    }
    this.setState({selected: selected, toolbarChecked: toolbarChecked})
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
          compose={this.state.compose}
          changeCompose={this.changeCompose}
        />
        {this.state.compose &&<Compose composeMessage={this.composeMessage}/>}
        <Messages
          emails={this.state.emails}
          selected={this.state.selected}
          clickStar={this.resolveStar}
          clickBox={this.resolveCheck}
          composeMessage={this.composeMessage}
         />
      </div>
    );
  }
}

export default App;
