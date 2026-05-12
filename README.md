# Recordatorio de Medicacion

App movil desarrollada en **React Native con Expo** para registrar medicamentos y programar recordatorios mediante notificaciones locales.

Trabajo practico para parcial de React Native.

![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo_SDK-54-000020?logo=expo&logoColor=white)
![React Navigation](https://img.shields.io/badge/React_Navigation-7-6B52AE)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![16KB](https://img.shields.io/badge/16_KB_pages-compatible-success)

---

## Tabla de contenidos

- [Video explicativo](#video-explicativo)
- [Caracteristicas](#caracteristicas)
- [Stack](#stack)
- [Cumplimiento de requisitos del parcial](#cumplimiento-de-requisitos-del-parcial)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Instalacion y ejecucion](#instalacion-y-ejecucion)
- [Como probar la app](#como-probar-la-app)
- [Generar APK](#generar-apk)
- [Troubleshooting](#troubleshooting)

---

## Video explicativo

Mira el video demo del funcionamiento de la app y la explicacion del codigo en YouTube:

[![Ver demo en YouTube](https://img.shields.io/badge/YouTube-Ver_demo-FF0000?logo=youtube&logoColor=white&style=for-the-badge)](https://youtube.com/shorts/IuGmmNgjPQc?feature=share)

> Link: https://youtube.com/shorts/IuGmmNgjPQc?feature=share
>


---

## Caracteristicas

- Registro e inicio de sesion local (sin backend).
- Lista de medicaciones persistente con AsyncStorage.
- Notificacion local programable:
  - **En X segundos** (ideal para test rapido).
  - **Hora fija diaria** (se repite todos los dias).
- Eliminar medicacion cancela la notificacion programada asociada.
- Cerrar sesion.
- Interfaz limpia con componentes reutilizables.

---

## Stack

| Tecnologia | Version |
|---|---|
| Expo | SDK 54 |
| React Native | 0.81.4 |
| React | 19.1.0 |
| React Navigation | 7.x (native-stack) |
| AsyncStorage | 2.2.0 |
| expo-notifications | 0.32.x |
| Node.js | 18.18+ o 20+ |

Compatible con **Android 15+ y 16 KB page size** (requisito Google Play desde noviembre 2025).

---

## Cumplimiento de requisitos del parcial

| # | Requisito | Implementacion |
|---|---|---|
| 1 | Componentes RN | `View`, `Text`, `TextInput`, `Button`, `TouchableOpacity` |
| 1 | Styling | `StyleSheet` en todas las pantallas |
| 1 | Componente reutilizable | `CustomButton` y `MedicationItem` |
| 2 | Stack Navigation | Login -> Register -> Home -> AddMedication |
| 3 | Autenticacion local | Registro y login validando AsyncStorage, sin acceso sin sesion |
| 4 | AsyncStorage | `usuarios`, `sesionActiva`, `medicaciones` |
| 4 | CRUD basico | Agregar, listar, eliminar |
| 4 | Persistencia | Los datos sobreviven al cierre de la app |
| 5 | Notificacion local | `expo-notifications` con triggers `TIME_INTERVAL` y `DAILY` |

---

## Estructura del proyecto

```
recordatorio-medicacion/
├── App.js                          # Entrada principal + navegacion Stack
├── app.json                        # Configuracion Expo
├── babel.config.js
├── package.json
├── .gitignore
├── README.md
├── assets/
│   ├── icon.png
│   ├── adaptive-icon.png
│   ├── splash.png
│   └── favicon.png
├── components/
│   ├── CustomButton.js             # Boton reutilizable
│   └── MedicationItem.js           # Item de lista reutilizable
└── screens/
    ├── LoginScreen.js              # Pantalla de inicio de sesion
    ├── RegisterScreen.js           # Pantalla de registro
    ├── HomeScreen.js               # Listado y gestion de medicaciones
    └── AddMedicationScreen.js      # Alta de medicacion + recordatorio
```

---

## Instalacion y ejecucion

### Requisitos

- **Node.js** version LTS (18.18+ o 20+) -> https://nodejs.org
- **Expo Go** instalado en el celular Android/iOS (Play Store / App Store).
- Conexion a internet (la PC y el celular deben estar en la **misma red WiFi**).

### Pasos

```bash
# 1. Clonar el repo
git clone https://github.com/Dave1246/recordatorio-medicacion.git
cd recordatorio-medicacion

# 2. Instalar dependencias
npm install

# 3. Levantar el proyecto
npx expo start
```

Escanea el QR que aparece en la terminal con **Expo Go** desde el celular.
La app se descarga y abre automaticamente.

### Alternativa - Usar emulador de Android Studio

1. Tener un AVD corriendo (Pixel 6, API 33+, con Google Play).
2. En la terminal donde corre Expo, presionar **`a`**.
3. La app se instala y abre en el emulador.

---

## Como probar la app

1. **Registrarse** con un usuario y contrasena (minimo 4 caracteres).
2. **Iniciar sesion** con esas credenciales.
3. **Agregar medicacion**:
   - Nombre: `Ibuprofeno`
   - Dosis: `1 comprimido`
   - Tab **En segundos** -> poner `5` -> Guardar.
4. Esperar 5 segundos -> aparece la notificacion **Hora de tu medicacion**.
5. **Eliminar** la medicacion con el icono de papelera (se cancela la notif).
6. **Cerrar y abrir la app** -> los datos persisten.
7. **Cerrar sesion** con el boton "Salir" en Home.

---

## Generar APK

### Opcion A - EAS Build (recomendada, en la nube)

```bash
npm install -g eas-cli
eas login
eas build:configure
```

Editar `eas.json` para que la build "preview" sea APK:

```json
{
  "build": {
    "preview": {
      "android": { "buildType": "apk" },
      "distribution": "internal"
    }
  }
}
```

Buildear:

```bash
eas build -p android --profile preview
```

Espera 5-15 min, te da una URL para descargar el APK.

### Opcion B - Build local con Gradle

Requiere Android Studio + JDK 17 + Android SDK 35.

```bash
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

El APK queda en `android/app/build/outputs/apk/release/app-release.apk`.

---

## Troubleshooting

### `npm: comando no reconocido`
Falta Node.js. Instalarlo desde https://nodejs.org (LTS) y reiniciar la terminal.

### `running scripts is disabled on this system` (Windows)
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### `Project is incompatible with this version of Expo Go`
Tu Expo Go en el celular tiene otro SDK que el proyecto. Las opciones son:
- Actualizar Expo Go desde Play Store (recomendado).
- O bajar la version compatible: https://expo.dev/go?sdkVersion=54&platform=android&device=true

### `The required package expo-asset cannot be found`
```bash
npx expo install expo-asset
```

### `The trigger object you provided is invalid... type or channelId`
Asegurate de que `AddMedicationScreen.js` usa la API nueva de triggers:
```js
trigger: {
  type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
  seconds: 10,
  repeats: false,
}
```

### Las notificaciones no aparecen
- Aceptar el permiso de notificaciones al iniciar la app por primera vez.
- En Settings del celular -> Apps -> Expo Go -> Notifications -> Allow.
- En iOS Simulator las notificaciones locales no funcionan. Usar dispositivo fisico o emulador Android.

### `Cannot connect to Metro`
- Verificar que el celular y la PC estan en la **misma red WiFi**.
- Si la red bloquea conexiones P2P (universidades, redes publicas), probar:
  ```bash
  npx expo start --tunnel
  ```

### Errores raros con `metro` / `TerminalReporter`
Recrear el proyecto desde cero usando:
```bash
npx create-expo-app@latest mi-app --template blank
# despues copiar App.js, screens/ y components/ adentro
```

---
