import React, { useState } from 'react';

function Images() {
  const [productId, setProductId] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const handleProductIdChange = (event) => {
    setProductId(event.target.value);
  };

  const handleImageChange = (event) => {
    setSelectedImages([...event.target.files]);
  };

  const handleCaptionChange = (index, event) => {
    const newCaptions = [...captions];
    newCaptions[index] = event.target.value;
    setCaptions(newCaptions);
  };

  const handleImageUpload = async () => {
    try {
      if (!selectedImages.length) {
        throw new Error('Por favor, selecciona una o más imágenes.');
      }
      if (!productId) {
        throw new Error('Por favor, ingresa el ID del producto.');
      }

      const uploadImage = async (image, caption) => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        return new Promise((resolve, reject) => {
          reader.onload = async () => {
            const base64Image = reader.result.split(',')[1];

            const formData = new FormData();
            formData.append('image', base64Image);
            formData.append('caption', caption);
        
            const response = await fetch(`http://localhost:5000/api/v1/productImages/${productId}`, {
              method: 'POST',
              body: formData
            });
        
            if (!response.ok) {
              reject(new Error('Error al subir imagen'));
            } else {
              resolve('Imagen subida correctamente');
            }
          };
          reader.onerror = () => {
            reject(new Error('Error al leer el archivo'));
          };
        });
      };

      const uploadPromises = selectedImages.map((image, index) => 
        uploadImage(image, captions[index] || '')
      );
      await Promise.all(uploadPromises);

      console.log('Todas las imágenes fueron subidas correctamente');
    } catch (error) {
      console.error('Error al subir imágenes:', error.message);
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
      <input
        type="text"
        placeholder="ID del Producto"
        value={productId}
        onChange={handleProductIdChange}
      />
      <br />
      <input type="file" multiple onChange={handleImageChange} />
      {selectedImages.length > 0 && selectedImages.map((image, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Caption"
            value={captions[index] || ''}
            onChange={(event) => handleCaptionChange(index, event)}
          />
        </div>
      ))}
      <br />
      <button onClick={handleImageUpload}>Subir Imágenes</button>
      <button onClick={handleShowImages}>Ver Imágenes</button>
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