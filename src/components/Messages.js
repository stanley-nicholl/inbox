import React from 'react'
import Message from './Message'

const Messages =({emails, clickStar, clickBox, selected, composeMessage}) => {
  return (
    <div>
      {emails.map(email=> {
        return <Message email={email} selected={selected} clickStar={clickStar}  clickBox={clickBox} key={email.id}/>
      })}
    </div>
  )
}



export default Messages
