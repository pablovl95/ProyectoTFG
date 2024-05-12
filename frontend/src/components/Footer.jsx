import React from 'react';
import "./css/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
      <div className="column">
      <h2>Recursos</h2>
      <a>Revistas</a>
      <a>Valores PH</a>
      <a>Beneficios PH</a>
      <a></a>
      </div>
      <div className="column">
      <h2>Sobre Nosotros</h2>
      <a>Nuestras Marcas</a>
      <a>Seguimiento de Pedidos</a>
      <a>¿Quiénes somos?</a>
      <a>Trabaja con nosotros</a>
      </div>
      <div className="column">
      <h2>Política de privacidad</h2>
      <a>Cookies</a>
      <a>Condiciones Generales de Venta</a>
      <a>Compliance</a>
      <a></a>
      </div>
      </div>
      <p>&copy; 2024 Todos los derechos reservados.</p>
    </footer>
  );
}



export default Footer;
