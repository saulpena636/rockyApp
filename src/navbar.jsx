import { useNavigate } from "react-router-dom";
import "./navbar.css"

function Navbar() {
    const navigate = useNavigate();

    const cerrar = () => {
        localStorage.clear();
        navigate("/")
    }

    const resumenes = () => {
        navigate("/resumen_mensual")
    }

    return (
        <>
            <div className="nav">
                <div className="nav1">Cronograma</div>
                <div className="nav1" onClick={resumenes}>Finanzas mensuales</div>
                <div className="nav1"><img src="/account.png" alt="profile" className="profile" /> {localStorage.getItem('user')}</div>
                <div className="nav1" onClick={cerrar}>Cerrar sesion</div>
            </div>
        </>
    )
}

export default Navbar;