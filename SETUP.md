# 🚀 Setup Guide — Quiniela Mundial 2026
## Metal Shapers Racing Store

La app ya está corriendo en **http://localhost:5173**

---

## ⚡ Paso 1: Habilitar Google Auth en Firebase

1. Ve a **[Firebase Console](https://console.firebase.google.com/project/mundi-df835)**
2. En el menú izquierdo → **Authentication** → **Sign-in method**
3. Habilita **Google** como proveedor
4. Guarda

---

## ⚡ Paso 2: Crear la base de datos Firestore

1. En Firebase Console → **Firestore Database**
2. Si no existe, click **Create database**
3. Selecciona modo **Production** (o Test para empezar)
4. Elige la región más cercana (us-central1)

### Reglas de seguridad recomendadas:
Ve a **Firestore → Rules** y pega esto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /quinielas/{uid} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == uid;
      allow update: if request.auth != null;
    }
    match /results/{doc} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

---

## ⚡ Paso 3: Configura tu email de admin

En **`src/App.jsx`**, línea 13:
```js
const ADMIN_EMAILS = ["TU_EMAIL@gmail.com"];
```

Reemplaza con tu correo de Google para tener acceso al panel de administrador.

---

## ⚡ Paso 4: Agregar dominio autorizado (cuando publiques)

1. Firebase Console → **Authentication → Settings → Authorized domains**
2. Agrega tu dominio de producción

---

## 🎮 Cómo usar la app

### Como cliente:
1. Entrar con Google
2. Llenar los 72 partidos (una vez guardado, no se puede cambiar)
3. Ver tu quiniela y posición en la tabla

### Como administrador:
1. Ingresar con el email configurado como admin
2. Ir a 🔧 **Admin**
3. Ingresar los marcadores reales de cada partido
4. Click **Recalcular Puntos** — actualiza automáticamente toda la tabla

---

## 📦 Publicar en producción

```bash
npm run build
```

Luego sube la carpeta `dist/` a Firebase Hosting, Vercel, o Netlify.
