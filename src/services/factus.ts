import axios, { AxiosInstance } from 'axios';

// Tipos de respuesta de Factus
interface FactusAuthResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

interface FactusAuthConfig {
  client_id: string;
  client_secret: string;
  username: string;
  password: string;
}

// Configuración base de Factus
const FACTUS_SANDBOX_URL = 'https://api-sandbox.factus.com.co';
const FACTUS_AUTH_ENDPOINT = `${FACTUS_SANDBOX_URL}/oauth/token`;

export class FactusAuthService {
  private config: FactusAuthConfig;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiration: number | null = null;
  private axiosInstance: AxiosInstance;

  constructor(config: FactusAuthConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: FACTUS_SANDBOX_URL,
      headers: {
        'Accept': 'application/json',
      },
    });

    // Interceptor para agregar el token a las solicitudes
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Restaurar token del localStorage si existe
    this.restoreTokenFromStorage();
  }

  /**
   * Obtener token de acceso inicial
   */
  async authenticate(): Promise<FactusAuthResponse> {
    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('client_id', this.config.client_id);
      formData.append('client_secret', this.config.client_secret);
      formData.append('username', this.config.username);
      formData.append('password', this.config.password);

      const response = await axios.post<FactusAuthResponse>(
        FACTUS_AUTH_ENDPOINT,
        formData,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.setTokens(response.data);
      return response.data;
    } catch (error) {
      console.error('Error en autenticación de Factus:', error);
      throw new Error('No se pudo autenticar con Factus. Verifica tus credenciales.');
    }
  }

  /**
   * Renovar token usando el refresh token
   */
  async refreshAccessToken(): Promise<FactusAuthResponse> {
    if (!this.refreshToken) {
      throw new Error('No hay refresh token disponible');
    }

    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'refresh_token');
      formData.append('refresh_token', this.refreshToken);
      formData.append('client_id', this.config.client_id);
      formData.append('client_secret', this.config.client_secret);

      const response = await axios.post<FactusAuthResponse>(
        FACTUS_AUTH_ENDPOINT,
        formData,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.setTokens(response.data);
      return response.data;
    } catch (error) {
      console.error('Error renovando token de Factus:', error);
      throw new Error('No se pudo renovar el token');
    }
  }

  /**
   * Guardar tokens y su expiración
   */
  private setTokens(data: FactusAuthResponse): void {
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    // Token expira en segundos, convertir a milisegundos y restar 60 segundos de seguridad
    this.tokenExpiration = Date.now() + (data.expires_in * 1000) - 60000;

    // Guardar en localStorage para persistencia
    localStorage.setItem('factus_access_token', data.access_token);
    localStorage.setItem('factus_refresh_token', data.refresh_token);
    localStorage.setItem('factus_token_expiration', this.tokenExpiration.toString());
  }

  /**
   * Restaurar tokens del localStorage
   */
  private restoreTokenFromStorage(): void {
    const accessToken = localStorage.getItem('factus_access_token');
    const refreshToken = localStorage.getItem('factus_refresh_token');
    const expiration = localStorage.getItem('factus_token_expiration');

    if (accessToken && refreshToken && expiration) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.tokenExpiration = parseInt(expiration, 10);
    }
  }

  /**
   * Verificar si el token está vigente
   */
  isTokenValid(): boolean {
    if (!this.accessToken || !this.tokenExpiration) {
      return false;
    }
    return Date.now() < this.tokenExpiration;
  }

  /**
   * Obtener el token actual (renovando si es necesario)
   */
  async getValidToken(): Promise<string> {
    if (this.isTokenValid()) {
      return this.accessToken!;
    }

    // Si el token expiró, renovarlo
    const response = await this.refreshAccessToken();
    return response.access_token;
  }

  /**
   * Obtener instancia de axios configurada con autenticación
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * Limpiar tokens
   */
  logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiration = null;
    localStorage.removeItem('factus_access_token');
    localStorage.removeItem('factus_refresh_token');
    localStorage.removeItem('factus_token_expiration');
  }

  /**
   * Obtener información del token actual
   */
  getTokenInfo(): {
    accessToken: string | null;
    isValid: boolean;
    expiresIn: number | null;
  } {
    return {
      accessToken: this.accessToken,
      isValid: this.isTokenValid(),
      expiresIn: this.tokenExpiration ? this.tokenExpiration - Date.now() : null,
    };
  }
}

// Instancia global del servicio de autenticación
let factusAuth: FactusAuthService | null = null;

/**
 * Inicializar el servicio de Factus con credenciales
 */
export async function initFactusService(config: FactusAuthConfig): Promise<FactusAuthService> {
  factusAuth = new FactusAuthService(config);
  
  // Si el token anterior es válido, no hace falta autenticarse nuevamente
  if (!factusAuth.isTokenValid()) {
    await factusAuth.authenticate();
  }
  
  return factusAuth;
}

/**
 * Obtener la instancia del servicio Factus
 */
export function getFactusService(): FactusAuthService {
  if (!factusAuth) {
    throw new Error('Factus service no inicializado. Ejecuta initFactusService primero.');
  }
  return factusAuth;
}

/**
 * Exportar función para hacer solicitudes a la API de Factus
 */
export async function factusAPI(
  method: string,
  endpoint: string,
  data?: any,
  config?: any
) {
  const service = getFactusService();
  const axiosInstance = service.getAxiosInstance();

  try {
    const response = await axiosInstance({
      method,
      url: endpoint,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error(`Error en solicitud Factus [${method} ${endpoint}]:`, error);
    throw error;
  }
}
