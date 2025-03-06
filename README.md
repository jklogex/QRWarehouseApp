# Aplicación de Autorización QR para Almacén

Una aplicación móvil en React Native para autorizar la entrada y salida del almacén mediante códigos QR. Esta aplicación está diseñada para tres tipos de usuarios: Conductores, Supervisores y Personal de Seguridad.

## Características

### Autenticación de Usuario y Gestión de Roles
- Sistema seguro de inicio de sesión y registro
- Control de acceso basado en roles (Conductor, Supervisor, Seguridad)
- Gestión de perfiles de usuario

### Funciones del Conductor
- Generación de código QR único con los detalles y estado del conductor
- Actualizaciones de estado en tiempo real (Autorizado/No Autorizado para salir)
- Interfaz simple para presentar el código QR al personal de seguridad

### Funciones del Supervisor
- Ver y gestionar una lista de todos los conductores
- Actualizar el estado del conductor (Autorizar/No Autorizar para salir)
- Actualizaciones en tiempo real de los códigos QR de los conductores

### Funciones del Guardia de Seguridad
- Funcionalidad de escaneo de códigos QR
- Verificación del estado e identidad del conductor
- Validación en tiempo real contra los registros de la base de datos

## Implementación Técnica

- **Frontend**: React Native para desarrollo móvil multiplataforma
- **Backend**: Firebase Authentication y Firestore Database
- **Código QR**: Capacidades de generación y escaneo
- **Actualizaciones en Tiempo Real**: Reflejo inmediato de los cambios de estado

## Primeros Pasos

### Requisitos Previos
- Node.js (v14 o posterior)
- npm o yarn
- Entorno de desarrollo React Native configurado
- Android Studio (para desarrollo en Android)
- Xcode (para desarrollo en iOS, solo Mac)

### Instalación

1. Clonar el repositorio
```
git clone <url-del-repositorio>
cd QRWarehouseApp
```

2. Instalar dependencias
```
npm install
```

3. Configurar Firebase
   - Crear un proyecto Firebase en [Firebase Console](https://console.firebase.google.com/)
   - Habilitar Autenticación y Firestore Database
   - Actualizar la configuración de Firebase en `src/services/firebase.ts`

4. Ejecutar la aplicación
```
# Para Android
npx react-native run-android

# Para iOS
npx react-native run-ios
```

## Estructura del Proyecto

```
src/
├── assets/         # Imágenes, fuentes y otros activos estáticos
├── components/     # Componentes UI reutilizables
├── navigation/     # Configuración de navegación
├── screens/        # Componentes de pantalla
│   ├── auth/       # Pantallas de autenticación
│   ├── driver/     # Pantallas específicas para conductores
│   ├── supervisor/ # Pantallas específicas para supervisores
│   └── security/   # Pantallas específicas para seguridad
└── services/       # Firebase y otros servicios
```

## Uso

### Flujo de Trabajo del Conductor
1. Iniciar sesión como Conductor
2. Ver el estado actual de autorización de salida
3. Navegar a la pantalla de Código QR
4. Presentar el código QR al personal de seguridad en la salida

### Flujo de Trabajo del Supervisor
1. Iniciar sesión como Supervisor
2. Ver lista de conductores
3. Seleccionar un conductor para ver detalles
4. Actualizar el estado de autorización del conductor según sea necesario

### Flujo de Trabajo del Guardia de Seguridad
1. Iniciar sesión como Seguridad
2. Escanear el código QR del conductor en el punto de salida
3. Verificar la identidad y el estado de autorización del conductor
4. Permitir o denegar la salida según el estado

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulte el archivo LICENSE para más detalles.

## Agradecimientos

- Comunidad de React Native
- Firebase por los servicios de backend
- Todos los contribuyentes a este proyecto
