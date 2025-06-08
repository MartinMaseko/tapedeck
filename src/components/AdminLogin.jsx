import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./tapestyle.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const tokenResult = await user.getIdTokenResult();
      if (tokenResult.claims.admin) {
        navigate("/dashboard");
      } else {
        setError("You are not authorized as an admin.");
        await auth.signOut();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin} className="form-container">
        <input
          className="form-inputs"
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="form-inputs"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="update-btns" type="submit">Login</button>
        {error && <p style={{color: "red"}}>{error}</p>}
      </form>
    </div>
  );
}

export default AdminLogin;