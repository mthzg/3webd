import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container">
        <div className="navbarInner">
          {/* BRAND */}
          <Link to="/" className="brand" aria-label="Go to home">
            <div className="brandIcon">📚</div>

            <div className="brandText">
              <div className="brandTitle">SUPLibrary</div>
              <div className="brandSub">
                Discover • Search • Learn
              </div>
            </div>
          </Link>

          <nav className="navLinks" aria-label="Main navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `navLink ${isActive ? "navLinkActive" : ""}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/advanced-search"
              className={({ isActive }) =>
                `navLink ${isActive ? "navLinkActive" : ""}`
              }
            >
              Advanced search
            </NavLink>
          </nav>

          <div className="navRight">
          </div>
        </div>
      </div>
    </header>
  );
}
