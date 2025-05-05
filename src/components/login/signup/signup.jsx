import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css"
import { create_user } from "../../../services/user";

function Signup() {
    const [username, setUsername] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (params) => {
        params.preventDefault()
        const datos = {username, nombre, apellido, email, password};
        const respuesta = await create_user(datos);
        console.log(respuesta);
        localStorage.setItem('user', username);
        localStorage.setItem('name', username);
        navigate("/cronograma");
    }

    return (
        <>
            <div className="fondo">
                <div className="signCont">
                    <form onSubmit={handleLogin} className="formLogin">
                        <div className="loginTitulo">
                            Registrarse
                        </div>
                        <div className="loginp">
                            Ingresa tus datos para registrarse
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

                        <div className="formInt">
                            <div className="md3-input">
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                    className={nombre ? 'filled' : ''}
                                />
                                <label className={nombre ? 'active' : ''}>Nombre</label>
                            </div>

                            <div className="md3-input">
                                <input
                                    type="text"
                                    value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}
                                    required
                                    className={apellido ? 'filled' : ''}
                                />
                                <label className={apellido ? 'active' : ''}>Apellido</label>
                            </div>
                        </div>

                        <div className="formInt">
                            <div className="md3-input">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className={email ? 'filled' : ''}
                                />
                                <label className={email ? 'active' : ''}>Correo</label>
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
                        </div>
                        <button type="submit" className="login-button">Registrate</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Signup;