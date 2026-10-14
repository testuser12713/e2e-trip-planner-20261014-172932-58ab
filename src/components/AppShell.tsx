import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'

interface NavItem {
  to: string
  label: string
  end?: boolean
}

const NAV_ITEMS: NavItem[] = [{ to: '/', label: 'Reiseliste', end: true }]

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container app-header__inner">
          <Link to="/" className="wordmark">
            Reiseplaner
          </Link>

          <nav className="app-nav" aria-label="Hauptnavigation">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="app-mobile-nav"
            aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span className="menu-toggle__bars" aria-hidden="true" />
          </button>
        </div>

        {menuOpen && (
          <nav
            id="app-mobile-nav"
            className="app-nav app-nav--mobile"
            aria-label="Hauptnavigation mobil"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link'
                }
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main className="container app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <div className="container">
          <p className="app-footer__text">
            Reiseplaner – alle Reisen bleiben in diesem Browser gespeichert.
          </p>
        </div>
      </footer>
    </div>
  )
}
