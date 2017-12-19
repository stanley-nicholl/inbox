import React, { Component } from 'react';
import Toolbar from './components/Toolbar'
import Messages from './components/Messages'
import './App.css';



class App extends Component {
  constructor(){
    super()
    this.state = {emails:[
      {
        "id": 1,
        "subject": "You can't input the protocol without calculating the mobile RSS protocol!",
        "read": false,
        "starred": true,
        "labels": ["dev", "personal"]
      },
      {
        "id": 2,
        "subject": "connecting the system won't do anything, we need to input the mobile AI panel!",
        "read": false,
        "starred": false,
        "selected": true,
        "labels": []
      },
      {
        "id": 3,
        "subject": "Use the 1080p HTTP feed, then you can parse the cross-platform hard drive!",
        "read": false,
        "starred": true,
        "labels": ["dev"]
      },
      {
        "id": 4,
        "subject": "We need to program the primary TCP hard drive!",
        "read": true,
        "starred": false,
        "selected": true,
        "labels": []
      },
      {
        "id": 5,
        "subject": "If we override the interface, we can get to the HTTP feed through the virtual EXE interface!",
        "read": false,
        "starred": false,
        "labels": ["personal"]
      },
      {
        "id": 6,
        "subject": "We need to back up the wireless GB driver!",
        "read": true,
        "starred": true,
        "labels": []
      },
      {
        "id": 7,
        "subject": "We need to index the mobile PCI bus!",
        "read": true,
        "starred": false,
        "labels": ["dev", "personal"]
      },
      {
        "id": 8,
        "subject": "If we connect the sensor, we can get to the HDD port through the redundant IB firewall!",
        "read": true,
        "starred": true,
        "labels": []
      }
    ],
    toolbarChecked: 'some'
    }

    this.bulkCheck = this.bulkCheck.bind(this)
    this.markAsRead = this.startTransformation.bind(this, this.markAsRead)
    this.markAsUnread = this.startTransformation.bind(this, this.markAsUnread)
  }

  copyEmails = () => {
    const copied = [...this.state.emails]
    return copied
  }

  startTransformation = (cb) => {
    if(!this.state.emails.some(email => email.selected)) return null
    const result = cb(this.state.emails)
    this.setState({ ...this.state, emails: result })
  }

  bulkCheck = (e) => {
    if(this.state.toolbarChecked === 'every'){
      const copied = this.copyEmails().map(email => {
        email.selected = false;
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

  markAsRead = (emails) => {
    return emails.map(email => {
      const result = { ...email }
      if(email.hasOwnProperty('selected')) email.read = true
      return email
    })

    // ///
    //
    // if(!this.state.emails.some(email => email.selected)) return null
    //
    // const copied = this.copyEmails().map(email => {
    //   if(email.hasOwnProperty('selected')) email.read = true
    //   return email
    // })
    // this.setState({ ...this.state, emails: copied })
  }

  markAsUnread = () => {
    return this.copyEmails().map(email => {
      if(email.hasOwnProperty('selected')) email.read = false
      return email
    })
  }

  deleteMessages = (e) => {
    if(!this.state.emails.some(email => email.selected)) return null

    const idsToDelete = this.state.emails.filter(email=> {
      return email.hasOwnProperty('selected')
    }).map(email=> email.id)

    const copied = this.copyEmails().filter(email=> !idsToDelete.includes(email.id))

    this.setState({ ...this.state, emails: copied })
  }



  applyLabel = (e) => {
    if(!this.state.emails.some(email => email.selected)) return null

    const newLabel = e.target.value
    const copied = this.copyEmails().map(email => {
      if(email.hasOwnProperty('selected') && !email.labels.includes(newLabel) && newLabel !== 'Apply label') email.labels.push(e.target.value)
      return email
    })

    e.target.selectedIndex = 0
    this.setState({ ...this.state, emails: copied })
  }

  removeLabel = (e) => {
    if(!this.state.emails.some(email => email.selected)) return null

    const removeLabel = e.target.value
    const copied = this.copyEmails().map(email => {
      if(email.hasOwnProperty('selected') && email.labels.includes(removeLabel) && removeLabel !== 'Apply label') {
        const index = email.labels.indexOf(removeLabel)
        email.labels.splice(index, 1)
      }
      return email
    })

    e.target.selectedIndex = 0
    this.setState({ ...this.state, emails: copied })
  }

  resolveStar = (e) => {
    const targetId = e.target.id.split('-')[1]

    const copied = this.copyEmails().map(email => {
      if(email.id === parseInt(targetId)) email.starred = email.starred ? false : true
      return email
    })

    this.setState({ ...this.state, emails: copied })
  }

  resolveCheck = (e) => {
    const targetId = e.target.id.split('-')[1]

    const copied = this.copyEmails().map(email => {
      if(email.id === parseInt(targetId)) email.hasOwnProperty('selected') ? delete email.selected : email.selected = true
      return email
    })

    this.setState({ ...this.state, emails: copied })
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
          startTransformation={this.startTransformation}
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
