import { NavLink } from "react-router-dom";

function Nav({status}) {

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <nav className="navbar navbar-expand-lg navbar-light">
                        <div className="container-fluid">
                                <h4> FREE MONEY FUNDRAISER</h4>
                                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                                        <span className="navbar-toggler-icon"></span>
                                    </button>
                            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                                <div className="navbar-nav">
                                    {status === 2 || status === 3 || status === 4 ? <NavLink to="/" end className={ ({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Create Idea</NavLink> : null}
                                    
                                    {status === 2 || status === 3 || status === 4 ? <NavLink to="/all" end className={ ({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>All Ideas</NavLink> : null}

                                    {status === 3 ? <NavLink to="/review" className={ ({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Review</NavLink> : null}
                                    {status === 3 ? <NavLink to="/comments" className={ ({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Comments</NavLink> : null}

                                    {status !== 1 ? <NavLink to="/logout" className="nav-link">Logout</NavLink> : null}
                                    {status === 1 ? <NavLink to="/register" className="nav-link">Register</NavLink> : null}
                                    {status === 1 ? <NavLink to="/login" className="nav-link">Login</NavLink> : null}
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default Nav;