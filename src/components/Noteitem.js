import React from 'react'

const Noteitem = (props) => {
const {note} = props;

  return (
    <div className="col-md-3">
      <div className="card my-3">
  
        <div className="card-body">
            <div className="d-flex align-items-center">
            <h4 className="card-title">{note.title}</h4><i class="fa-solid fa-pen-to-square mx-2"></i>
            <i class="fa-solid fa-trash-can mx-2"></i>
            
            </div>
            <p className="card-text">{note.description}</p>
            
        </div>
        </div>
    </div>
  )
}

export default Noteitem;
