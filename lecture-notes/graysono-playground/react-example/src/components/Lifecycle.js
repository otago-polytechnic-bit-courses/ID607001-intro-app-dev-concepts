import React, {useState} from 'React'

const Lifecycle = () => {
  const [toggle, setToggle]= useState(false)
  const [count, setCount]= useState(0)

  const handleClick = (e) => {
    setToggle(toggle ? false : true)
    setCount(count + 1)
  }

  let cycle = null

  if (toggle) {
    cycle = <Lifecycle count={count}/>
  }

  return (
    <div>
      <h1>Mount/unmount/update example</h1>
      <button type="button" onClick={handleClick}>{toggle ? 'Unmount the Lifecycle component' : 'Mount the Lifecycle component'}</button>
      {cycle}
    </div>
  )
}

export default Lifecycle