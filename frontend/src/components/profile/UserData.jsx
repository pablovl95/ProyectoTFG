import React, { useState, useEffect } from "react";
import { auth } from "../../auth";
import { EmailAuthProvider, updatePassword, reauthenticateWithCredential } from 'firebase/auth';
import '../css/profile/UserData.css';

const UserData = ({ userData, changeUserData, setNotification }) => {
    const backendUrl = process.env.NODE_ENV === "development"
        ? "http://localhost:5000"
        : process.env.REACT_APP_BACKEND_URL;
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [user, setUser] = useState(null);
    const [isGoogleUser, setIsGoogleUser] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Estados locales para los campos de usuario
    const [firstName, setFirstName] = useState(userData.FirstName || '');
    const [lastName, setLastName] = useState(userData.LastName || '');
    const [email, setEmail] = useState(userData.Email || '');
    const [phone, setPhone] = useState(userData.Phone === "NULL" ? "" : userData.Phone);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user);
            if (user) {
                const providers = user.providerData.map(provider => provider.providerId);
                setIsGoogleUser(providers.includes('google.com'));
            }
        });
        return () => unsubscribe();
    }, []);

    const handleChangePassword = async () => {
        if (!user || !user.email) {
            setErrorMessage('Error al obtener la información del usuario.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('Las nuevas contraseñas no coinciden.');
            return;
        }

        try {
            const credentials = EmailAuthProvider.credential(
                user.email,
                currentPassword
            );
            await reauthenticateWithCredential(user, credentials);
            await updatePassword(user, newPassword);
            setErrorMessage('Contraseña cambiada exitosamente.');
            setNotification({ type: 'success', message: 'Contraseña cambiada exitosamente.' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

        } catch (error) {
            setErrorMessage('Hubo un error al cambiar la contraseña. Por favor, inténtalo de nuevo más tarde.');
            setNotification({ type: 'error', message: 'Hubo un error al cambiar la contraseña. Por favor, inténtalo de nuevo más tarde.' });
        }
    };

    const handleSaveChanges = async () => {
        if (!user) {
            setErrorMessage('Error al obtener la información del usuario.');
            setNotification({ type: 'error', message: 'Error al obtener la información del usuario.' });
            return;
        }
        const body = { "FirstName": firstName, "LastName": lastName, "Phone": phone }
        try {
            const response = await fetch(`${backendUrl}/api/v1/users/${user.uid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });


            if (response.ok) {
                const updatedUserData = body;
                console.log('Updated User Data:', updatedUserData);
                console.log('User Data:', userData);
                const newDat = { ...userData, ...updatedUserData }
                console.log('New User Data:', newDat);
                setErrorMessage('Datos actualizados exitosamente.');
                setNotification({ type: 'success', message: 'Datos actualizados exitosamente.' });
                changeUserData(newDat);
            } else {
                const errorText = await response.text(); // Captura el texto de error completo
                console.log('Error Text:', errorText);
                setErrorMessage(`Error al actualizar los datos: ${errorText}`);
                setNotification({ type: 'error', message: `Error al actualizar los datos: ${errorText}` });
            }
        } catch (error) {
            setErrorMessage('Hubo un error al actualizar los datos. Por favor, inténtalo de nuevo más tarde.');
            setNotification({ type: 'error', message: 'Hubo un error al actualizar los datos. Por favor, inténtalo de nuevo más tarde.' });
        }
    };

    return (
        <>
            <div className="profile-details-user-info">
                <h4>Mis datos</h4>
                <div className="separator"></div>
                <div className="profile-detail-user-content-row">
                    <div className='profile-detail-a'>
                        <a>Nombre</a>
                        <input
                            type="text"
                            value={firstName == "NULL" ? "" : firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Nombre"
                        />
                    </div>
                    <div className='profile-detail-a'>
                        <a>Apellidos</a>
                        <input
                            type="text"
                            value={lastName == "NULL" ? "" : lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Apellidos"
                        />
                    </div>
                </div>
                <div className="profile-detail-user-content-row">
                    <div className='profile-detail-a'>
                        <a>Email</a>
                        <input
                            type="email"
                            value={email == "NULL" ? "" : email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                    </div>
                    <div className='profile-detail-a'>
                        <a>Telefono</a>
                        <input
                            type="tel"
                            value={phone == "NULL" ? "" : phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Teléfono"
                        />
                    </div>
                </div>
                <button className="save-button" onClick={handleSaveChanges}>
                    Guardar
                </button>
            </div>
            <div className="profile-details-change-password">
                {!isGoogleUser ? (
                    <>
                        <h4>Cambiar contraseña</h4>
                        <div className='separator'></div>
                        <div className="current-password-container">
                            <p>Contraseña Actual</p>
                            <input type="password" value={currentPassword} placeholder='Contraseña Actual' onChange={(e) => setCurrentPassword(e.target.value)} />
                        </div>
                        <div className="profile-details-new-password">
                            <div>
                                <p>Nueva Contraseña</p>
                                <input type="password" value={newPassword} placeholder='Nueva Contraseña' onChange={(e) => setNewPassword(e.target.value)} />
                            </div>
                            <div>
                                <p>Confirmar Contraseña</p>
                                <input type="password" value={confirmPassword} placeholder='Confirmar Contraseña' onChange={(e) => setConfirmPassword(e.target.value)} />
                            </div>
                        </div>
                        <button onClick={handleChangePassword}>Cambiar Contraseña</button>
                    </>
                ) : (
                    <div className="google-sign-in">
                        <span>Se ha iniciado sesión con Google, si deseas cambiar la contraseña hazlo desde Google</span>
                    </div>
                )}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
        </>
    );
};

export default UserData;