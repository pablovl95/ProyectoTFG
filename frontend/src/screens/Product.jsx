import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import ImageGallery from "../components/ImageGallery";
import "./css/Product.css";
import CardReviews from "../components/CardReviews";
import ImageReviewsSlider from "../components/ImageReviewsSlider";
import { calculateStarsPercentage, renderStarsProductCard } from "../utils/utils";

const Product = ({ changeCart, setNotification }) => {
  const [showNav, setShowNav] = useState(window.innerWidth > 768);
  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
  const [productInfo, setProductInfo] = useState({});
  const [nutritionalInfo, setNutritionalInfo] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  const backendUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.REACT_APP_BACKEND_URL;

  const totalStarsPercentage = calculateStarsPercentage(product, reviews);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const productResponse = await fetch(`${backendUrl}/api/v1/products/${params.id}`);
      if (!productResponse.ok) {
        throw new Error("Error fetching product data");
      }
      const productData = await productResponse.json();

      const urls = productData?.images.map(product => 
        product.ImageContent);
      setImages(urls);
      setProductInfo(productData.info);
      setNutritionalInfo(productData.nutritional);
      setProduct(productData.product);
      const reviewsResponse = await fetch(`${backendUrl}/api/v1/reviews/${params.id}`);
      if (!reviewsResponse.ok) {
        setReviews([]);
      }
      const reviewsData = await reviewsResponse.json();
      setReviews(reviewsData);
      console.log(product)
    } catch (error) {
      setNotification({ type: 'error', message: "Ha ocurrido un problema con el producto. Reinicia la página o vuelve más tarde." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setShowNav(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const isShippingFree = quantity >= productInfo.Min_units_for_free_shipping;

  const addToCart = () => {
    const existingProductIndex = cart.findIndex(item => item.ProductID === product.ProductID);
    const ShippingCost = productInfo.Shipping_cost;
    const MinUnits = productInfo.Min_units_for_free_shipping;

    const updatedProduct = { ...product, ImageContent: images[0], quantity: parseInt(quantity, 10), ShippingCost, MinUnits };
    if (existingProductIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += parseInt(quantity, 10);
      updatedCart[existingProductIndex].ShippingCost = ShippingCost;
      updatedCart[existingProductIndex].MinUnits = MinUnits;
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...cart, updatedProduct];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
    changeCart();
  };

  if (loading) {
    return (
      <div style={{ padding: "10rem", paddingBottom: "20rem", width: "10%", margin: "auto" }}>
        <ClipLoader
          color={"green"}
          loading={loading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }



  return (
    <div className="product-container-global">
      <p className="breadcrumbs">
        <Link to={`/search?PrincipalCategoryId=${product?.PrincipalCategoryID}`} style={{ textDecoration: "none", color: "green" }}>
          {"Productos > "}{product?.PrincipalCategoryName} {product?.SecundaryCategoryName ? " > " : ""} {product?.SecundaryCategoryName} {product?.TertiaryCategoryName ? " > " : ""} {product?.TertiaryCategoryName}
        </Link>
      </p>
      <div className="product-container">
        <div className="product-image">
          <p>{product?.StockAvailability > 0 ? "Disponible" : "No disponible"}</p>
          <ImageGallery imageUrls={images} />
        </div>
        <div className="product-details">
          <div className="product-header">
            <h2>{product?.ProductName}</h2>
            <p>
              Visita la tienda de{" "}
              <Link to={`/next-implementations`} style={{ textDecoration: "none", color: "green" }}>
                {product?.ShopName}
              </Link>
            </p>
            <div>
              <p>
                {product?.Rating?.toFixed(2)} {renderStarsProductCard(product?.Rating)}
                {" | "}
                <a href="#comentarios" style={{ textDecoration: "none", color: "green" }}>
                  {product?.TotalComments} Valoraciones | Buscar en esta página
                </a>
              </p>
            </div>
            <h1>{product?.Price} €</h1>
            <a> 0,99 €/kg</a>

          </div>
          <div className="quantity-container">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <input
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              />
              <button onClick={() => setQuantity(Math.min(100, quantity + 1))}>+</button>
            </div>
            <button className="add-to-cart-button" onClick={addToCart}>Añadir al carrito</button>

          </div>

          <div className="product-description">
            {!isShippingFree && (
              <p>
                Incluye {productInfo.Shipping_cost} € de costes de envío. Añade {productInfo.Min_units_for_free_shipping - quantity} unidades más para obtener envío gratuito.
              </p>
            )}
            {isShippingFree && (
              <p>¡Envío gratuito!</p>
            )}
            <h3>Acerca de este producto</h3>
            <p>{product?.ProductDescription}</p>
          </div>
        </div>
      </div>
      <div className="separator"></div>
      <div>
        <h2>Información adicional sobre el producto</h2>
      </div>
      <div className="product-tables">
        <div className="additional-info">
          <table>
            <tbody>
              <tr>
                <td>Dimensiones</td>
                <td>{productInfo.Dimensions}</td>
              </tr>
              <tr>
                <td>Peso</td>
                <td>{productInfo.Weight} kg</td>
              </tr>
              <tr>
                <td>Volumen</td>
                <td>{productInfo.Volume} L</td>
              </tr>
              <tr>
                <td>Unidad</td>
                <td>{productInfo.Unit}</td>
              </tr>
              <tr>
                <td>Unidades</td>
                <td>{productInfo.Units}</td>
              </tr>
              <tr>
                <td>Precio por unidad</td>
                <td>{productInfo.Price_per_unit} €</td>
              </tr>
              <tr>
                <td>Fabricante</td>
                <td>{productInfo.Manufacturer}</td>
              </tr>
              <tr>
                <td>Marca</td>
                <td>{productInfo.Brand}</td>
              </tr>
              <tr>
                <td>Instrucciones de almacenamiento</td>
                <td>{productInfo.Storage_instructions}</td>
              </tr>
              <tr>
                <td>País de origen de los ingredientes</td>
                <td>{productInfo.Country_of_origin_ingredients}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="additional-info">
          <table>
            <tbody>
              <tr>
                <td>Calorías</td>
                <td>{nutritionalInfo.Calories} kcal</td>
              </tr>
              <tr>
                <td>Grasa total</td>
                <td>{nutritionalInfo.Total_fat} g</td>
              </tr>
              <tr>
                <td>Grasa saturada</td>
                <td>{nutritionalInfo.Saturated_fat} g</td>
              </tr>
              <tr>
                <td>Grasa trans</td>
                <td>{nutritionalInfo.Trans_fat} g</td>
              </tr>
              <tr>
                <td>Colesterol</td>
                <td>{nutritionalInfo.Cholesterol} mg</td>
              </tr>
              <tr>
                <td>Sodio</td>
                <td>{nutritionalInfo.Sodium} mg</td>
              </tr>
              <tr>
                <td>Carbohidratos totales</td>
                <td>{nutritionalInfo.Total_carbohydrates} g</td>
              </tr>
              <tr>
                <td>Fibra</td>
                <td>{nutritionalInfo.Fiber} g</td>
              </tr>
              <tr>
                <td>Azúcares</td>
                <td>{nutritionalInfo.Sugars} g</td>
              </tr>
              <tr>
                <td>Proteínas</td>
                <td>{nutritionalInfo.Protein} g</td>
              </tr>
              <tr>
                <td>Vitaminas</td>
                <td>{nutritionalInfo.Vitamins}</td>
              </tr>
              <tr>
                <td>Minerales</td>
                <td>{nutritionalInfo.Minerals}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="separator"></div>
      {reviews.length > 0 && (
        <div id="comentarios" className="product-reviews">
          <div className="Opiniones">
            <div className="product-opiniones-header">
              <h2>Opiniones de clientes</h2>
              <div className="StarsTitle">
                {renderStarsProductCard(product?.Rating)} {product?.Rating.toFixed(2)} Estrellas de 5
              </div>
              {product?.TotalComments} Valoraciones totales
            </div>
            {[5, 4, 3, 2, 1].map(stars => (
              <div key={stars} className="starsLine">
                <a>{stars} Estrellas</a>
                <div className="WidthDiv">
                  <div className="WidthPercentage" style={{ width: `${totalStarsPercentage[stars]}%` }}></div>
                </div>
                {totalStarsPercentage[stars]}%
              </div>
            ))}
          </div>
          <div className="Reseñas">
            <h2>Reseñas con imágenes</h2>
            <ImageReviewsSlider Reviews={reviews} />
            <h2>Principales Reseñas</h2>
            <CardReviews Reviews={reviews} />
          </div>
        </div>
      )}
      {reviews.length === 0 && (
        <div id="comentarios" className="product-reviews">
          <div className="Opiniones">
            <h2>Opiniones de clientes</h2>
            {[5, 4, 3, 2, 1].map(stars => (
              <div key={stars} className="starsLine">
                <a>{stars} Estrellas</a>
                <div className="WidthDiv">
                  <div className="WidthPercentage" style={{ width: `${totalStarsPercentage[stars]}%` }}></div>
                </div>
                {totalStarsPercentage[stars]}%
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
