/**
 * Configuración de Factus API
 * Reemplaza estos valores con tus credenciales de Factus Sandbox
 */

export const FACTUS_CONFIG = {
  client_id: process.env.FACTUS_CLIENT_ID || 'tu_client_id',
  client_secret: process.env.FACTUS_CLIENT_SECRET || 'tu_client_secret',
  username: process.env.FACTUS_USERNAME || 'tu_email@example.com',
  password: process.env.FACTUS_PASSWORD || 'tu_password',
};

// Validar que las credenciales estén configuradas
export function validateFactusConfig(): boolean {
  const { client_id, client_secret, username, password } = FACTUS_CONFIG;
  
  if (
    client_id === 'tu_client_id' ||
    client_secret === 'tu_client_secret' ||
    username === 'tu_email@example.com' ||
    password === 'tu_password'
  ) {
    console.warn(
      'Advertencia: Las credenciales de Factus no están configuradas. ' +
      'Por favor, establece las variables de entorno o actualiza FACTUS_CONFIG.'
    );
    return false;
  }
  
  return true;
}
