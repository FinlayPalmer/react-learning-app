import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/home");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Enter your name:
        <input 
          type="text"
          name="username" 
          value={inputs.username || ""}
          onChange={handleChange}
        />
      </label>
      <label>Enter your password:
        <input
        type="password"
        name="password"
        value={inputs.password || ""}
        onChange={handleChange}
        />
      </label>
      <input type="submit" />
    </form>
  )
}

export default Login;