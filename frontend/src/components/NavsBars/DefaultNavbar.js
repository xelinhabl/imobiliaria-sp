import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import AnimatedSection from  '../Animated/AnimatedSection'; // Componente de seção animada
import "./DefaultNavBar.css";

const DefaultNavbar = ({ routes, action, transparent, relative, light, center }) => {
  const navbarClasses = `default-navbar ${transparent ? "transparent" : ""} ${relative ? "relative" : ""} ${light ? "light" : ""} ${center ? "center" : ""}`;

  return (
    <AnimatedSection animation="fade-down" delay="100">
      <nav className={navbarClasses}>
        <div className="navbar-container">
          {/* Links */}
          <ul className="navbar-links">
            {routes.map((route, index) => (
              <li key={index}>
                <Link to={route.route}>{route.name}</Link>
              </li>
            ))}
          </ul>

          {/* Ação (ex: botão de download) */}
          {action && (
            <div className="navbar-action">
              <a href={action.route} target="_blank" rel="noopener noreferrer">
                {action.label}
              </a>
            </div>
          )}

          {/* Mídias sociais */}
          <div className="navbar-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </a>
          </div>
        </div>
      </nav>
    </AnimatedSection>
  );
};

DefaultNavbar.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      route: PropTypes.string.isRequired,
    })
  ).isRequired,
  action: PropTypes.shape({
    type: PropTypes.string,
    route: PropTypes.string,
    label: PropTypes.string,
    color: PropTypes.string,
  }),
  transparent: PropTypes.bool,
  relative: PropTypes.bool,
  light: PropTypes.bool,
  center: PropTypes.bool,
};

DefaultNavbar.defaultProps = {
  action: null,
  transparent: false,
  relative: false,
  light: false,
  center: false,
};

export default DefaultNavbar;