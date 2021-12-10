import axios from 'axios'
import React, { useEffect, useState } from 'react' // Import the useEffect and useState hook from the react dependency

const Post = () => {
  const [post, setPost] = useState([]) // State variables

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts/1') // Making a request
    .then((response) => {
      setPost(response.data) // Set post to the response data
    })
  }, []) // The empty array means render ONLY once. If we pass in post, i.e., [post], 
         // it will re-render the component if post's data changes

  return (
    <div>
      {/* Rendering the post's title and body */}
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  )
}

export default Post