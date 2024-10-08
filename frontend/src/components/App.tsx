import './App.css'
import { useState } from 'react'
import User from '../features/user/User';


// Main App component that receives msalInstance as a prop
function App() {
  const [count, setCount] = useState(0); // State to manage a simple counter

  return (  //JSX
    <>
      <User />
      <h1>SEM</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count} {/* Displaying the current count */}
        </button>
      </div>
    </>
  );
}

export default App
