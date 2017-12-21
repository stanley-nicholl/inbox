import React from 'react'

const Message = ({email, clickBox, clickStar, selected}) => {

  const emailStatus = (email, selected) =>{
      let namesForEmail = `row message`
      if(selected.includes(email.id)){
        namesForEmail += ` selected`
      }
      namesForEmail += email.read ? ` read` : ` unread`
      return namesForEmail
    }

  const checked = (email, selected) =>{
    if(selected.includes(email.id)) return true
    return false
  }

  const addLabel = (label,i) =>{
    return <span className="label label-warning" key={i}>{label}</span>
  }

  return (
    <div className={emailStatus(email, selected)}>
      <div className="col-xs-1">
        <div className="row">
          <div className="col-xs-2">
            <input type="checkbox" checked={checked(email, selected)} id={"check-" + email.id} onChange={ e => clickBox(e)}/>
          </div>
          <div className="col-xs-2">
            <i className={email.starred ? "star fa fa-star": "star fa fa-star-o"} id={"star-" + email.id} onClick={ e => clickStar(e)}></i>
          </div>
        </div>
      </div>
      <div className="col-xs-11">
        {email.labels.map((label, i) => addLabel(label, i))}
        <a href="#">
          {email.subject}
        </a>
      </div>
    </div>
  )
};

export default Message;
