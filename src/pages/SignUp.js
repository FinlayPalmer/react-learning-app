import { useState } from "react";
import { useNavigate, userNavigate } from "react-router-dom";
import { useLearningAppFascade } from "../useSingleton/useLearningAppFascade";
import loginStyle from "../stylesheets/login.module.css";

function SignUp() {
    const [inputs, setInputs] = useState({});
    const navigate = useNavigate();
    const { signUp } = useLearningAppFascade();
    
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const {firstName, lastName, email, username, password} = inputs;
        signUp(firstName, lastName, email, username, password);
        navigate("/home");
    }

    return (
    <div className={loginStyle.formContainer}>
      <form onSubmit={handleSubmit}>
        <label>Enter your First Name:
          <input 
            type="text"
            name="firstName" 
            value={inputs.firstName || ""}
            onChange={handleChange}
          />
        </label>
        <label>Enter your Last Name:
          <input 
            type="text"
            name="lastName" 
            value={inputs.lastName || ""}
            onChange={handleChange}
          />
        </label>
        <label>Enter your Email:
          <input 
            type="text"
            name="email" 
            value={inputs.email || ""}
            onChange={handleChange}
          />
        </label>
        <label>Enter your Username:
          <input 
            type="text"
            name="username" 
            value={inputs.username || ""}
            onChange={handleChange}
          />
        </label>
        <label>Enter your password:
          <input
          type="text"
          name="password"
          value={inputs.password || ""}
          onChange={handleChange}
          />
        </label>
        <input type="submit" className={loginStyle.formContainerButton}/>
      </form>
    </div>
  )
}

export default SignUp;