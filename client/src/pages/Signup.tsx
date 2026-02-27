import { useEffect, useState } from "react";
import { useGridStore } from "../store/gridstore";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";


export default function Signup(){
const [username , setUsername] = useState("");
const [loading, setLoading] = useState(false);
const navigate = useNavigate();

useEffect(() => {
  const id = localStorage.getItem('auth_id');
  if (id) navigate('/game');
}, []);

const handleClick = async(e: React.FormEvent) =>{
    e.preventDefault();
    setLoading(true);
  try{
        const response = await fetch(`${API_URL}/api/users` ,{
        method: "POST",
        headers:{
            "content-Type":"application/json",
        },
        body:JSON.stringify({username})
    });
    const data = await response.json();
   if (!response.ok) {
      // 🔥 Handle backend error
      throw new Error(data.message || "Something went wrong");
    }

   const {id , username : username1} = data.user;
        // Store user id as string so socket payload/store type remain consistent.
        const normalizedUserId = String(id);
        useGridStore.getState().setCurrentUser(normalizedUserId);
         localStorage.setItem("auth_id", normalizedUserId);
         localStorage.setItem("auth_username" , username1);

         navigate("/game");
  }catch(error){
    console.error("Error:", error);
  }finally{
    setLoading(false);
  }
}

return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleClick}>
        <h2 style={styles.title}>Create Account</h2>

        <input
          style={styles.input}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <button style={styles.button} disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
  },
  card: {
    background: "#1e293b",
    padding: "2rem",
    borderRadius: "12px",
    width: "320px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  title: {
    color: "white",
    textAlign: "center",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
  },
  button: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer",
  },
  message: {
    color: "#38bdf8",
    textAlign: "center",
  },
};
