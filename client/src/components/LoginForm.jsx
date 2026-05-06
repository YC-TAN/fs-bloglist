import { useNavigate } from "react-router-dom";
import { useUserActions } from "../store/user";
import useField from "../hooks/useField";

const LoginForm = () => {
  const { login } = useUserActions();
  const username = useField("text");
  const password = useField("password");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({
      username: username.value,
      password: password.value,
    });
    e.target.reset();
    navigate("/");
  };

  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            username
            <input {...username} />
          </label>
        </div>
        <div>
          <label>
            password
            <input {...password} />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </>
  );
};

export default LoginForm;
