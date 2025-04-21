import { useState } from "react";
import  "./loginStyle.css"

const handleLogin = () => {

}


function Login() {
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');

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
                        <button type="submit" className="login-button">Iniciar sesion</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login