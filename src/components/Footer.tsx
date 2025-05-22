
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="text-lg font-bold text-black flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
              Portugal Golden Visa Funds
            </Link>
            <p className="text-sm text-gray-600 mt-2">
              Helping investors navigate the Portuguese Golden Visa program
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-primary">Home</Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-600 hover:text-primary">About</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Legal</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link to="/disclaimer" className="text-gray-600 hover:text-primary">Disclaimer</Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-600 hover:text-primary">Privacy Policy</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-300 mt-8 pt-6 text-center text-gray-600 text-sm">
          <p>© {currentYear} Portugal Golden Visa Funds. All rights reserved.</p>
          <p className="mt-2">This website is for informational purposes only and does not constitute investment advice.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
