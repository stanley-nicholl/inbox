import React from 'react'

const Message = ({email, clickBox, clickStar}) => {

  const emailStatus = (email) =>{
      let namesForEmail = `row message`
      if(email.selected === true){
        namesForEmail += ` selected`
      }
      namesForEmail += email.read ? ` read` : ` unread`
      // console.log(email, namesForEmail);
      return namesForEmail
    }

  const addLabel = (label,i) =>{
    return <span className="label label-warning" key={i}>{label}</span>
  }

  return (
    <div className={emailStatus(email)}>
      <div className="col-xs-1">
        <div className="row">
          <div className="col-xs-2">
            <input type="checkbox" checked={email.selected} id={"check-" + email.id} onChange={ e => clickBox(e)}/>
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
