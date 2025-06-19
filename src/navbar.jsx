import { useNavigate } from "react-router-dom";
import "./navbar.css"

function Navbar() {
    const navigate = useNavigate();

    const cerrar = () => {
        localStorage.clear();
        navigate("/")
    }

    const cronograma = () => {
        navigate("/cronograma")
    }

    const resumenes = () => {
        navigate("/resumen_mensual")
    }

    return (
        <>
            <div className="nav">
                <img src="/Logo1.png" alt="logo" className="logo" style={{height:"60px"}} />
                <div style={{ height: "100%", display: "flex"}}>
                    <div className="nav1" onClick={cronograma}>Cronograma</div>
                    <div className="nav1" onClick={resumenes}>Finanzas mensuales</div>
                    <div className="nav1"><img src="/account.png" alt="profile" className="profile" /> {localStorage.getItem('user')}</div>
                    <div className="nav1" onClick={cerrar}>Cerrar sesion</div>
                </div>
            </div>
        </>
    )
}

export default Navbar;