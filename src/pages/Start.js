import {Link} from "react-router-dom"
function Start() {
  return (
    <>
    <Link to="/login">
        <button>Login</button>
    </Link>
    <Link to="/signup">
        <button>Sign Up</button>
    </Link>
    </>
  )
}

export default Start;