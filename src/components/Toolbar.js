import React from 'react';

const labels = ['dev', 'personal', 'gschool']

const Toolbar = ({
  emails,
  toolbarChecked,
  bulkCheck,
  markAsRead,
  markAsUnread,
  applyLabel,
  removeLabel,
  deleteMessages,
  startTransformation
}) => {

  const toolBarIcon = (emails) =>{
    if(emails.every(email => email.hasOwnProperty('selected'))) return 'fa fa-check-square-o'
    if(emails.some(email => email.hasOwnProperty('selected'))) return 'fa fa-minus-square-o'
    return 'fa fa-square-o'
  }

  const unreadCount = (emails) =>{
    let count = 0
    emails.forEach(email => {if(!email.read) count++})
    return count
  }

  const Label = (label, i) =>{
    return <option key={i} value={label}>{label}</option>
  }

  return (
    <div className="row toolbar">
      <div className="col-md-12">
        <p className="pull-right">
          <span className="badge badge">{unreadCount(emails)}</span>
          unread messages
        </p>

        <button className="btn btn-default">
          <i className={toolBarIcon(emails)} onClick={ e => bulkCheck(e)}></i>
        </button>

        <button className="btn btn-default" onClick={ e => startTransformation(markAsRead)}>
          Mark As Read
        </button>

        <button className="btn btn-default" onClick={ e => this.startTransformation(markAsUnread)}>
          Mark As Unread
        </button>

        <select className="form-control label-select" onChange={ e => applyLabel(e)}>
          <option>Apply label</option>
          {labels.map((label,i) => Label(label,i))}
        </select>

        <select className="form-control label-select" onChange={ e => removeLabel(e)}>
          <option>Remove label</option>
          {labels.map((label,i) => Label(label,i))}
        </select>

        <button className="btn btn-default" onClick={ e => deleteMessages(e)}>
          <i className="fa fa-trash-o"></i>
        </button>
      </div>
    </div>
  )
}

export default Toolbar
