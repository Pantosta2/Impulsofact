/**
 * Ejemplos de uso del servicio de Factus
 * 
 * Este archivo muestra cómo utilizar el servicio de autenticación
 * y las solicitudes a la API de Factus
 */

import { initFactusService, getFactusService, factusAPI } from './factus';
import { FACTUS_CONFIG, validateFactusConfig } from './factus-config';

/**
 * Inicializar Factus en la aplicación
 * Llamar esto una vez al inicio de la aplicación
 */
export async function setupFactusService(): Promise<void> {
  try {
    // Validar configuración
    if (!validateFactusConfig()) {
      console.error('Por favor, configura las credenciales de Factus');
      return;
    }

    // Inicializar servicio
    await initFactusService(FACTUS_CONFIG);
    console.log('✓ Servicio de Factus inicializado correctamente');
  } catch (error) {
    console.error('✗ Error al inicializar Factus:', error);
    throw error;
  }
}

/**
 * Ejemplo: Obtener información del token
 */
export function getTokenStatus(): void {
  try {
    const service = getFactusService();
    const info = service.getTokenInfo();
    console.log('Token Status:', {
      hasToken: !!info.accessToken,
      isValid: info.isValid,
      expiresIn: info.expiresIn ? `${Math.round(info.expiresIn / 1000)}s` : 'N/A',
    });
  } catch (error) {
    console.error('Error obteniendo estado del token:', error);
  }
}

/**
 * Ejemplo: Realizar una solicitud GET a la API de Factus
 */
export async function getFactusData(endpoint: string): Promise<any> {
  try {
    const data = await factusAPI('GET', endpoint);
    console.log(`Datos de ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`Error obteniendo datos de ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Ejemplo: Crear una factura en Factus
 */
export async function createInvoiceInFactus(invoiceData: any): Promise<any> {
  try {
    const data = await factusAPI('POST', '/invoices', invoiceData);
    console.log('Factura creada:', data);
    return data;
  } catch (error) {
    console.error('Error creando factura:', error);
    throw error;
  }
}

/**
 * Ejemplo: Obtener listado de facturas
 */
export async function getInvoices(): Promise<any> {
  try {
    const data = await factusAPI('GET', '/invoices');
    console.log('Listado de facturas:', data);
    return data;
  } catch (error) {
    console.error('Error obteniendo facturas:', error);
    throw error;
  }
}

/**
 * Ejemplo: Actualizar una factura
 */
export async function updateInvoice(invoiceId: string, invoiceData: any): Promise<any> {
  try {
    const data = await factusAPI('PUT', `/invoices/${invoiceId}`, invoiceData);
    console.log('Factura actualizada:', data);
    return data;
  } catch (error) {
    console.error('Error actualizando factura:', error);
    throw error;
  }
}

/**
 * Ejemplo: Eliminar una factura
 */
export async function deleteInvoice(invoiceId: string): Promise<any> {
  try {
    const data = await factusAPI('DELETE', `/invoices/${invoiceId}`);
    console.log('Factura eliminada:', data);
    return data;
  } catch (error) {
    console.error('Error eliminando factura:', error);
    throw error;
  }
}

/**
 * Ejemplo: Renovar token manualmente
 */
export async function renewToken(): Promise<void> {
  try {
    const service = getFactusService();
    const response = await service.refreshAccessToken();
    console.log('Token renovado. Expira en:', response.expires_in, 'segundos');
  } catch (error) {
    console.error('Error renovando token:', error);
    throw error;
  }
}

/**
 * Ejemplo: Cerrar sesión
 */
export function logoutFactus(): void {
  try {
    const service = getFactusService();
    service.logout();
    console.log('Sesión de Factus cerrada');
  } catch (error) {
    console.error('Error cerrando sesión:', error);
  }
}
