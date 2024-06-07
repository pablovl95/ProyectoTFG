import React, { useEffect, useState } from 'react';

function WriteReview({ order, onClose, userData }) {
    const [Comment, setComment] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [error, setError] = useState(null);
    const backendUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.REACT_APP_BACKEND_URL;
    const handleReviewSubmit = async () => {
        try {
            const formData = new FormData();
            const containsPhoto = selectedImages.length > 0 ? 1 : 0;
            const selectedProductID = document.querySelector('select').value;
            formData.append('Comment', Comment);
            formData.append('ProductID', selectedProductID);
            formData.append('Rating', parseInt(document.querySelector('input[type="number"]').value),10);
            formData.append('UserID', userData.UserID);
            formData.append('containsPhoto', containsPhoto);

            const response = await fetch(`${backendUrl}/api/v1/reviews`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al enviar la reseña.');
            }

            // Lógica para manejar el éxito de la operación
            onClose();
        } catch (error) {
            setError(error.message);
        }
    };


    const handleImageChange = (e) => {
        const files = e.target.files;
        const imagesArray = Array.from(files).slice(0, 4); // Seleccionar hasta 4 imágenes

        // Convertir imágenes a base64
        Promise.all(imagesArray.map(fileToBase64))
            .then((base64Images) => {
                setSelectedImages(base64Images);
                setImagePreviews(base64Images);
            })
            .catch((error) => console.error('Error al convertir imágenes a base64:', error));
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };
    useEffect(() => {
        console.log(order);
    }, [order]);

    return (
        <div className="write-review-container">
            <h3>Elige el producto para el que quieres escribir una opinión</h3>
            <select >
                {order.map((product) => (
                    <option key={product.ProductID} value={product.ProductID}>
                        {product.ProductName}
                    </option>
                ))}
            </select>
            <h3>Calificacion</h3>
            <input type="number" min="1" max="5" />
            <textarea
                value={Comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escribe tu opinión aquí..."
            />
            <input type="file" accept="image/*" multiple onChange={handleImageChange} />
            <div className="image-previews">
                {imagePreviews.map((preview, index) => (
                    <img key={index} src={preview} alt={`Preview ${index}`} />
                ))}
            </div>
            {error && <p>{error}</p>}
            <button onClick={handleReviewSubmit}>Enviar Opinión</button>
        </div>
    );
}

export default WriteReview;
