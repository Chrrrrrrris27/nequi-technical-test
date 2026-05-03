# Nequi Technical Test

Aplicación móvil que permite gestionar, crear, actualizar, completar y eliminar tareas segmentándolas por categorías de igual manera creadas por el usuario.

## Stack utilizado
- Ionic
- Angular
- Cordova
- Firebase (Remote Config)

## Requisitos previos para configuración local
- Node.js
- npm
- Ionic CLI

### Android setup
- Java JDK
- Android Studio

### IOS setup
- XCode
- CocoaPods

## Instalación
1. Clonar repositorio
2. Instalar dependencias:
    ```
    npm install
    npm install -g cordova
3. Agregar plataforma a utilizar:
    - Android:
        ```
        ionic cordova platform add android
        ```
    - IOS:
        ```
        ionic cordova platform add ios
        ```

## Ejecución
### Web:
```
ionic serve
```
### Android:
 - Ejecutar en emulador:
    - Iniciar emulador en Android Studio (o dispositivo conectado por cable) y verificar ejecución con:
    ```
    adb devices
    ```
    - Ejecutar comando
    ```
    npm run cordova:run:android
    ```
 - Generar apk para dispositivos:
    ```
        npm run cordova:build:android
    ```

### IOS:
- Emulador:
    ```
    ionic cordova run ios
    ```
- Dispositivo real (conectado):
    ```
    ionic cordova run ios --device
    ```

## Estructura del proyecto:
- src /
    - app /
        - core
        - features
        - shared
        - tabs
    - assets
    - environments
    - seed
    - theme

## Features implementadas
### Todos
- Create todo
- Toggle todo (completed, not completed)
- Edit todo
- Delete todo
- Filter by category

### Categories
- Create category
- Edit category
- Delete category (cuando una categoría es eliminada, las tareas asociadas a esta categorías son actualizadas con categoryId en null)

### Feature flags
- "enabledSelectorCategoriesFilter":
    - Tipo: boolean
    - Valor por defecto: false
    - Permite cambiar el filtro de tareas por categoría entre un filtro tipo selector desplegable y un filtro de chips en scroll horizontal.
