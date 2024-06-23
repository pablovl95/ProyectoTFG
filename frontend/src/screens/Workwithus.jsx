import React, { useState } from 'react';
import './css/Workwithus.css';

const Workwithus = () => {
    const [formData, setFormData] = useState({
      nombre: '',
      email: '',
      telefono: '',
      motivo: '',
      mensaje: '',
      recursos: [],  
    });
  
    const handleChange = (e) => {
      if (e.target.name === 'recursos') {
        setFormData({ ...formData, recursos: Array.from(e.target.files) });
      } else {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      }
    };
  const handleDownload = (file) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); 
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (let key in formData) {
      if (key === 'recursos') {
        formData[key].forEach((file) => {
          data.append(key, file);
        });
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch('/api/solicitudes', {
        method: 'POST',
        body: data, 
      });

      if (response.ok) {
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          motivo: '',
          mensaje: '',
          recursos: [],
        });
        alert('¡Gracias por tu interés! Nos pondremos en contacto contigo pronto.');
      } else {
        console.error('Error al enviar la solicitud:', response.statusText);
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
  };

  return (
    <div className="workwithus-container">
      <h1>Colabora con Nosotros</h1>
      <form onSubmit={handleSubmit}>
        <select name="motivo" value={formData.motivo} onChange={handleChange} required>
          <option value="">Selecciona un motivo</option>
          <option value="crear-tienda">Crear una tienda</option>
          <option value="punto-recogida">Ofrecer un punto de recogida</option>
          <option value="transportista">Convertirse en transportista</option>
          <option value="otro">Otro</option> 
        </select>
        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required />
        <input type="tel" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} />
        <textarea name="mensaje" placeholder="Cuéntanos más sobre tu propuesta" value={formData.mensaje} onChange={handleChange}></textarea>
        <input 
          type="file" 
          name="recursos"
          accept="image/*, application/pdf" 
          multiple={true}
          onChange={handleChange}
        />
        <div className="image-previews">
          {formData.recursos.map((file, index) => (
            <div key={index} className="image-preview">
              <span onClick={() => handleDownload(file)}>{file.name}</span> 
            </div>
          ))}
        </div>
        <button type="submit">Enviar Solicitud</button>
      </form>
    </div>
  );
};

export default Workwithus;
