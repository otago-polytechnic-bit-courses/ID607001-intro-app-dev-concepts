import React from 'react'

const Welcome = (props) => {
  return (
    <div>
      <h1>Welcome {props.firstName}</h1> {/* Pass a prop called firstName */}
    </div>
  )
}

export default Welcome