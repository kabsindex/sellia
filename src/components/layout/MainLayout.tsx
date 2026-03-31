import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Menu, X } from 'lucide-react';
export function MainLayout({ children }: {children: ReactNode;}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navLinks = [
  {
    name: 'Fonctionnalités',
    path: '/features'
  },
  {
    name: 'Tarifs',
    path: '/pricing'
  }];

  return (
    <div className="min-h-screen flex flex-col bg-sellia-bg font-sans">
      <header className="bg-white border-b border-sellia-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-sellia-primary rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-2xl">S</span>
              </div>
              <span className="text-2xl font-bold text-sellia-primary tracking-tight">
                SELLIA
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) =>
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-sellia-accent ${location.pathname === link.path ? 'text-sellia-accent' : 'text-sellia-muted'}`}>
                
                  {link.name}
                </Link>
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/auth">
                <Button variant="ghost">Se connecter</Button>
              </Link>
              <Link to="/auth">
                <Button variant="primary">Commencer gratuitement</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-sellia-text hover:text-sellia-accent focus:outline-none p-2">
                
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen &&
        <div className="md:hidden bg-white border-t border-sellia-border absolute w-full shadow-lg">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) =>
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-4 text-base font-medium text-sellia-text hover:bg-slate-50 rounded-lg">
              
                  {link.name}
                </Link>
            )}
              <div className="pt-4 flex flex-col gap-3">
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" fullWidth>
                    Se connecter
                  </Button>
                </Link>
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="primary" fullWidth>
                    Commencer gratuitement
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        }
      </header>

      <main className="flex-1">{children}</main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-sellia-border py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sellia-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold text-sellia-primary tracking-tight">
              SELLIA
            </span>
          </div>
          <p className="text-sellia-muted text-sm text-center md:text-left">
            © {new Date().getFullYear()} SELLIA. L'assistant business des
            vendeurs WhatsApp.
          </p>
        </div>
      </footer>
    </div>);

}
