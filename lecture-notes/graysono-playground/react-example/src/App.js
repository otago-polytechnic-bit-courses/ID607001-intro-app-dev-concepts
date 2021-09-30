import React from 'react'
import Counter from './components/Counter'
import Post from './components/Post'
import Welcome from './components/Welcome'

const App = () => {
  return (
    <div>
      <h1>Hello, World!</h1>
      <Welcome /> {/* This will render - Welcome an <h1> element. Note: a prop attribute is not given */}
      <Welcome firstName="John" /> {/* 
                                     It will render - Welcome John in an <h1> element. Note: a prop 
                                     attribute is given. Make sure the prop attribute's name is the
                                     same as what is specified in the child component, i.e., Welcome.js. 
                                   */}
      <Counter />
      <Post />
    </div>
  )
}

export default App
