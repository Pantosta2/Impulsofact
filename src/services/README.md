# Guía de Integración con Factus API

## Configuración

### 1. Credenciales de Factus Sandbox

Primero, necesitas obtener tus credenciales de Factus:
- **client_id**: Tu identificador de cliente
- **client_secret**: Tu secreto de cliente
- **username**: Tu email registrado en Factus
- **password**: Tu contraseña

### 2. Configurar las Credenciales

Hay dos formas de configurar las credenciales:

#### Opción A: Variables de Entorno (Recomendado)

Crea un archivo `.env` en la raíz del proyecto:

```env
FACTUS_CLIENT_ID=tu_client_id_aqui
FACTUS_CLIENT_SECRET=tu_client_secret_aqui
FACTUS_USERNAME=tu_email@example.com
FACTUS_PASSWORD=tu_password_aqui
```

#### Opción B: Editar factus-config.ts

Edita `src/services/factus-config.ts` directamente:

```typescript
export const FACTUS_CONFIG = {
  client_id: 'tu_client_id',
  client_secret: 'tu_client_secret',
  username: 'tu_email@example.com',
  password: 'tu_password',
};
```

### 3. Inicializar el Servicio

En tu archivo principal (`src/app.ts` o `src/main.ts`), importa e inicializa el servicio:

```typescript
import { setupFactusService } from './services/factus-examples';

// Al iniciar la aplicación
await setupFactusService();
```

## Uso

### Obtener Estado del Token

```typescript
import { getFactusService } from './services/factus';

const service = getFactusService();
const info = service.getTokenInfo();
console.log('Token válido:', info.isValid);
console.log('Expira en:', info.expiresIn, 'ms');
```

### Hacer Solicitudes a la API

```typescript
import { factusAPI } from './services/factus';

// GET
const invoices = await factusAPI('GET', '/invoices');

// POST
const newInvoice = await factusAPI('POST', '/invoices', {
  cliente_id: 123,
  monto: 100.00,
  // ... más datos
});

// PUT
const updated = await factusAPI('PUT', '/invoices/456', {
  monto: 150.00,
});

// DELETE
await factusAPI('DELETE', '/invoices/456');
```

### Renovar Token Manualmente

```typescript
import { getFactusService } from './services/factus';

const service = getFactusService();
const newToken = await service.refreshAccessToken();
```

### Cerrar Sesión

```typescript
import { getFactusService } from './services/factus';

const service = getFactusService();
service.logout();
```

## Características

✅ **Autenticación Automática**: Obtiene y gestiona tokens automáticamente
✅ **Renovación de Tokens**: Renueva el token automáticamente si expira
✅ **Persistencia**: Guarda tokens en localStorage para no reautenticarse
✅ **Interceptores**: Agrega automáticamente el token Bearer a las solicitudes
✅ **Manejo de Errores**: Captura y registra errores detallados
✅ **Validación**: Valida que los credenciales estén configurados

## Estructura de Archivos

```
src/services/
├── factus.ts              # Servicio principal de autenticación
├── factus-config.ts       # Configuración de credenciales
├── factus-examples.ts     # Ejemplos de uso
└── README.md             # Este archivo
```

## Documentación Oficial

Para más información sobre la API de Factus, consulta:
- [Autenticación](https://developers.factus.com.co/autenticacion/auth/)
- [Refresh Token](https://developers.factus.com.co/autenticacion/refresh-token/)
- [API Documentation](https://developers.factus.com.co/)

## Troubleshooting

### Error: "Factus service no inicializado"

**Solución**: Asegúrate de llamar a `setupFactusService()` o `initFactusService()` antes de usar el servicio.

### Error: "Las credenciales de Factus no están configuradas"

**Solución**: Verifica que `FACTUS_CLIENT_ID`, `FACTUS_CLIENT_SECRET`, `FACTUS_USERNAME` y `FACTUS_PASSWORD` estén configurados en variables de entorno o en `factus-config.ts`.

### Error: "No se pudo obtener el token"

**Solución**: Verifica que tus credenciales sean correctas y que tengas acceso a la API de Factus Sandbox.

### El token expira constantemente

El token de Factus expira después de 1 hora. El servicio intenta renovarlo automáticamente. Si sigue expirando, verifica tu conexión a internet y que el `refresh_token` sea válido.
