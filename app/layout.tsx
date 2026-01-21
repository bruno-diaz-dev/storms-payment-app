import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <header className="header">
          {/* LOGO → HOME */}
          <Link href="/" className="header-left" aria-label="Volver al inicio">
            <img
              src="/storms-logo.png"
              alt="Storms"
              className="logo"
            />
            <span className="logo-text">Storms · Admin</span>
          </Link>

          <input type="checkbox" id="menu-toggle" />
          <label htmlFor="menu-toggle" className="hamburger">
            ☰
          </label>

          <nav className="menu">
            <Link href="/tournaments">Torneos</Link>
            <Link href="/players">Jugadores</Link>
            <Link href="/payments">Pagos</Link>
          </nav>
        </header>

        <main className="main">{children}</main>
      </body>
    </html>
  );
}
