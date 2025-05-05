import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import  "./loginStyle.css"
import { login, username_get } from "../../services/user";

function Login() {
    const [username,setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    if (localStorage.getItem('user') !== null) {
        navigate("/cronograma")
    }

    const handleLogin = async (params) => {
        params.preventDefault()
        const datos = new URLSearchParams ({"username":username, "password":password}).toString();
        const respuesta = await login(datos);
        if ("access_token" in respuesta){
            const usuario1 = await username_get(username)
            localStorage.setItem('user', usuario1.username)
            localStorage.setItem('name', usuario1.nombre)
            localStorage.setItem('id',usuario1.id)
            navigate("/cronograma");
        }
        else{
            alert("Usuario o contraseña incorrectos")
        }
        console.log(respuesta)
    }
    const handleSign = () => {
        navigate("/signup")
    }

    return (
        <>
            <div className="fondo">
                <div className="loginCont">
                    <form onSubmit={handleLogin} className="formLogin">
                        <div className="loginTitulo">
                            Iniciar sesion
                        </div>
                        <div className="loginp">
                            Inicia sesion con tu usuario y contraseña
                        </div>
                        <div className="md3-input">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className={username ? 'filled' : ''}
                        />
                        <label className={username ? 'active' : ''}>Username</label>
                        </div>

                        <div className="md3-input">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={password ? 'filled' : ''}
                        />
                        <label className={password ? 'active' : ''}>Contraseña</label>
                        </div>                  
                        <button type="submit" className="login-button">Iniciar sesion</button>
                    </form>
                    <a onClick={handleSign}>Registratre aqui!</a>
                </div>
            </div>
        </>
    )
}

export default Login