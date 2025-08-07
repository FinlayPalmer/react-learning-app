import {Link} from "react-router-dom";
import loginStyle from "../stylesheets/login.module.css"

function Start() {
  return (
    <div className={loginStyle.formContainer}>
      <div className={loginStyle.formContainerLink}>
        <Link to="/login">
            <button className={loginStyle.formContainerButton}>Login</button>
        </Link>
        <Link to="/signup">
            <button className={loginStyle.formContainerButton}>Sign Up</button>
        </Link>
      </div>
    </div>
  )
}

export default Start;