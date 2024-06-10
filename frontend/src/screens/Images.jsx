import React, { useState, useEffect } from 'react';

function Images() {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/products');
      if (!response.ok) {
        throw new Error('Error al obtener los productos');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error al obtener los productos:', error.message);
    }
  };

  const handleProductIdChange = (event) => {
    setProductId(event.target.value);
  };

  const handleImageChange = (event) => {
    setSelectedImages([...event.target.files]);
  };

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
    setProductId(event.target.value);
  };

  const handleImageUpload = async () => {
    try {
      if (!selectedImages.length) {
        throw new Error('Por favor, selecciona una o más imágenes.');
      }
      if (!productId) {
        throw new Error('Por favor, ingresa el ID del producto.');
      }

      const uploadPromises = selectedImages.map((image) =>
        uploadImage(image)
      );
      await Promise.all(uploadPromises);

      console.log('Todas las imágenes fueron subidas correctamente');
    } catch (error) {
      console.error('Error al subir imágenes:', error.message);
    }
  };

  const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append('image', image);

    const response = await fetch(`http://localhost:5000/api/v1/productImages/${productId}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Error al subir imagen');
    }
  };

  const handleShowImages = async () => {
    try {
      if (!productId) {
        throw new Error('Por favor, ingresa el ID del producto.');
      }

      const response = await fetch(`http://localhost:5000/api/v1/productImages/${productId}`);
      if (!response.ok) {
        throw new Error('Error al obtener las imágenes');
      }
      const data = await response.json();
      console.log('Imágenes:', data);
      setImageUrls(data.map(item => item.Image));
    } catch (error) {
      console.error('Error al obtener las imágenes:', error.message);
    }
  };

  return (
    <div>
      <h2>Subir Imágenes</h2>
      <select value={selectedProduct} onChange={handleProductChange}>
        <option value="">Selecciona un producto</option>
        {products.map(product => (
          <option key={product.ProductID} value={product.ProductID}>
            {product.ProductName}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="ID del Producto"
        value={productId}
        onChange={handleProductIdChange}
      />
      <br />
      <input type="file" multiple onChange={handleImageChange} />

      <br />
      <button onClick={handleImageUpload}>Subir Imágenes</button>
      {imageUrls.length > 0 && (
        <div>
          <h3>Imágenes Subidas</h3>
          {imageUrls.map((url, index) => (
            <img key={index} src={`data:image/png;base64, ${url}`} alt={`Uploaded ${index}`} style={{ maxWidth: '100%' }} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Images;


