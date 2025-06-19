# 🛒 Plataforma de Venta Directa Productor-Consumidor

Desarrollo completo de una plataforma web que conecta directamente a productores con consumidores, eliminando intermediarios y fomentando el comercio local.

## 📦 Tecnologías utilizadas

- **Frontend**: React.js + CSS responsive  
- **Backend**: Node.js + Express.js + SQL 
- **Testing**: Cypress (end-to-end)  
- **Otros**: Firebase-auth, Firebase-store

---

## 🚀 Características principales

- 🔍 Catálogo de productos por productor
- 🛒 Carrito de compras y pedidos
- 💬 Comunicación directa con el productor
- 🧾 Gestión de usuarios (login, registro)
- 📱 Diseño responsive para dispositivos móviles
- ✅ Test automatizados de interfaz con Cypress

---

## 🧱 Estructura del proyecto

```
/backend
  ├── apis/
  ├── sql/
  └── index.js

/frontend
  ├── public/
  ├── src/
  │   ├── components/
  │   ├── screens/
  │   ├── utils/
  │   └── App.jsx
  └── cypress/
```

---

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Pablovl95/ProyectoTFG.git
cd ProyectoTFG
```

### 2. Instalar dependencias

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

---

## ▶️ Ejecución del proyecto

### Iniciar el backend

```bash
cd backend
npm start
```

### Iniciar el frontend

```bash
cd frontend
npm start
```

- El frontend estará disponible en `http://localhost:3000`  
- El backend estará en `http://localhost:5000` (o el puerto configurado)

---

## 🧪 Ejecutar tests con Cypress

```bash
cd frontend
npx cypress open
```

Desde la interfaz de Cypress, selecciona los tests a ejecutar.

---

## 📌 Objetivos del proyecto

- Potenciar el comercio justo y local
- Ofrecer una plataforma moderna, intuitiva y segura
- Reducir los costes de distribución mediante la venta directa

---

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).
