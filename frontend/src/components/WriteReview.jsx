import React, { useEffect, useState } from 'react';
import './css/WriteReview.css';

function WriteReview({ order, onClose, userData }) {
    const [Comment, setComment] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [error, setError] = useState(null);
    const [rating, setRating] = useState(0);
    const [selectedProductID, setSelectedProductID] = useState(order[0]?.ProductID || '');
    const backendUrl = process.env.NODE_ENV === "development"
        ? "http://localhost:5000"
        : process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        if (order.OrderProducts.length > 0) {  
            setSelectedProductID(order.OrderProducts[0].ProductID); // Inicializa con el primer producto si no se ha seleccionado ninguno
        }
    }, [order]);

    useEffect(() => {
        return () => {
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [imagePreviews]);

    const handleReviewSubmit = async () => {
        try {
            // Validar campos antes de enviar
            if (rating < 1 || rating > 5) {
                setError('La calificación debe estar entre 1 y 5.');
                return;
            }
            if (!Comment.trim()) {
                setError('El comentario no puede estar vacío.');
                return;
            }

            const formData = new FormData();
            formData.append('Comment', Comment);
            formData.append('ProductID', selectedProductID);
            formData.append('Rating', rating);
            formData.append('UserID', userData.UserID);
            formData.append('containsPhoto', selectedImages.length > 0 ? '1' : '0');

            // Agregar imágenes a formData
            selectedImages.forEach((image) => {
                formData.append('images', image);
            });

            const response = await fetch(`${backendUrl}/api/v1/reviews`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al enviar la reseña.');
            }

            onClose(); // Cerrar el formulario tras el éxito
        } catch (error) {
            setError(error.message);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files).slice(0, 4); // Seleccionar hasta 4 imágenes
        setSelectedImages(files);

        // Crear vistas previas de las imágenes
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <div className='write-review-overlay' onClick={handleClose}>
            <div className="write-review-container" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={handleClose}>X</button>
                <h3>Elige el producto para el que quieres escribir una opinión</h3>
                <select 
                    id='select'
                    value={selectedProductID} // Establece el valor seleccionado en el select
                    onChange={(e) => setSelectedProductID(e.target.value)} // Actualiza el estado cuando cambia la selección
                >
                    {order.OrderProducts.map((product) => (
                        <option key={product.ProductID} value={product.ProductID}>
                            {product.ProductName}
                        </option>
                    ))}
                </select>
                <h3>Calificación</h3>
                <input
                    type="number"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value, 10))}
                />
                <textarea
                    value={Comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Escribe tu opinión aquí..."
                />
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                />
                <div className="image-previews">
                    {imagePreviews.map((preview, index) => (
                        <img key={index} src={preview} alt={`Preview ${index}`} />
                    ))}
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button onClick={handleReviewSubmit}>Enviar Opinión</button>
            </div>
        </div>
    );
}

export default WriteReview;
