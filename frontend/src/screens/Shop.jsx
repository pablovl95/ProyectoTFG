import React, { useState } from 'react';
import './css/Shop.css';

// Componentes individuales
const Product = ({ name, description, image }) => (
  <div className="product">
    <img src={image} alt={name} />
    <h3>{name}</h3>
    <p>{description}</p>
  </div>
);

const NewsArticle = ({ title, content }) => (
  <div className="news-article">
    <h4>{title}</h4>
    <p>{content}</p>
  </div>
);

// Datos de ejemplo
const products = [
  { name: 'Producto 1', description: 'Descripción del producto 1', image: 'url_de_la_imagen_1' },
  { name: 'Producto 2', description: 'Descripción del producto 2', image: 'url_de_la_imagen_2' },
  // Añadir más productos según sea necesario
];

const news = [
  { title: 'Noticia 1', content: 'Contenido de la noticia 1' },
  { title: 'Noticia 2', content: 'Contenido de la noticia 2' },
  // Añadir más noticias según sea necesario
];

const socialMediaLinks = [
  { name: 'Facebook', url: 'https://facebook.com' },
  { name: 'Twitter', url: 'https://twitter.com' },
  { name: 'Instagram', url: 'https://instagram.com' },
  // Añadir más enlaces según sea necesario
];

const Shop = () => {
  const [activeSection, setActiveSection] = useState('productos');

  return (
    <div className="shop">
      <header className="shop-header">
        <h1>Tienda</h1>
        <nav>
          <ul>
            <li>
              <a 
                href="#productos" 
                onClick={() => setActiveSection('productos')} 
                className={activeSection === 'productos' ? 'active' : ''}
              >
                Productos
              </a>
            </li>
            <li>
              <a 
                href="#noticias" 
                onClick={() => setActiveSection('noticias')} 
                className={activeSection === 'noticias' ? 'active' : ''}
              >
                Noticias
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <section id="productos" className={`products ${activeSection !== 'productos' ? 'hidden' : ''}`}>
        <h2>Productos</h2>
        {products.map((product, index) => (
          <Product 
            key={index} 
            name={product.name} 
            description={product.description} 
            image={product.image} 
          />
        ))}
      </section>

      <section id="noticias" className={`news-section ${activeSection !== 'noticias' ? 'hidden' : ''}`}>
        <h2>Noticias</h2>
        {news.map((article, index) => (
          <NewsArticle 
            key={index} 
            title={article.title} 
            content={article.content} 
          />
        ))}
      </section>

      <footer className="shop-footer">
        <div className="social-media">
          <h4>Síguenos en:</h4>
          <ul>
            {socialMediaLinks.map((link, index) => (
              <li key={index}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default Shop;
