import { Injectable } from '@nestjs/common';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | '*';

// Definición de códigos de mensaje
const MESSAGE_CODES = {
  AUTH: {
    LOGIN_SUCCESS: 'auth.login.success',
    LOGIN_FAILED: 'auth.login.failed',
    REGISTER_SUCCESS: 'auth.register.success',
    REGISTER_CONFLICT: 'auth.register.conflict',
  },
  TASK: {
    LIST_SUCCESS: 'task.list.success',
    CREATE_SUCCESS: 'task.create.success',
    GET_SUCCESS: 'task.get.success',
    UPDATE_SUCCESS: 'task.update.success',
    DELETE_SUCCESS: 'task.delete.success',
    NOT_FOUND: 'task.not_found',
  },
  COMMON: {
    SUCCESS: 'common.success',
    CREATED: 'common.created',
    NO_CONTENT: 'common.no_content',
    BAD_REQUEST: 'common.bad_request',
    UNAUTHORIZED: 'common.unauthorized',
    FORBIDDEN: 'common.forbidden',
    NOT_FOUND: 'common.not_found',
    CONFLICT: 'common.conflict',
    SERVER_ERROR: 'common.server_error',
  },
} as const;

// Mensajes base
const BASE_MESSAGES: Record<string, string> = {
  [MESSAGE_CODES.AUTH.LOGIN_SUCCESS]: 'Inicio de sesión exitoso',
  [MESSAGE_CODES.AUTH.LOGIN_FAILED]: 'Credenciales inválidas',
  [MESSAGE_CODES.AUTH.REGISTER_SUCCESS]: 'Usuario registrado exitosamente',
  [MESSAGE_CODES.AUTH.REGISTER_CONFLICT]: 'El usuario ya existe',
  [MESSAGE_CODES.TASK.LIST_SUCCESS]: 'Lista de tareas obtenida exitosamente',
  [MESSAGE_CODES.TASK.CREATE_SUCCESS]: 'Tarea creada exitosamente',
  [MESSAGE_CODES.TASK.GET_SUCCESS]: 'Tarea obtenida exitosamente',
  [MESSAGE_CODES.TASK.UPDATE_SUCCESS]: 'Tarea actualizada exitosamente',
  [MESSAGE_CODES.TASK.DELETE_SUCCESS]: 'Tarea eliminada exitosamente',
  [MESSAGE_CODES.TASK.NOT_FOUND]: 'Tarea no encontrada',
  [MESSAGE_CODES.COMMON.SUCCESS]: 'Operación exitosa',
  [MESSAGE_CODES.COMMON.CREATED]: 'Recurso creado exitosamente',
  [MESSAGE_CODES.COMMON.NO_CONTENT]: 'Operación exitosa sin contenido',
  [MESSAGE_CODES.COMMON.BAD_REQUEST]: 'Solicitud inválida',
  [MESSAGE_CODES.COMMON.UNAUTHORIZED]: 'No autorizado',
  [MESSAGE_CODES.COMMON.FORBIDDEN]: 'Acceso denegado',
  [MESSAGE_CODES.COMMON.NOT_FOUND]: 'Recurso no encontrado',
  [MESSAGE_CODES.COMMON.CONFLICT]: 'Conflicto con el estado actual del recurso',
  [MESSAGE_CODES.COMMON.SERVER_ERROR]: 'Error interno del servidor',
};

interface RouteConfig {
  [key: string]: {
    [key in HttpMethod]?: {
      [statusCode: number]: string;
    };
  };
}

@Injectable()
export class ResponseMessageService {
  private readonly routes: RouteConfig = {
    '/auth/login': {
      POST: {
        200: MESSAGE_CODES.AUTH.LOGIN_SUCCESS,
        201: MESSAGE_CODES.AUTH.LOGIN_SUCCESS,
        401: MESSAGE_CODES.AUTH.LOGIN_FAILED,
      },
    },
    '/auth/register': {
      POST: {
        201: MESSAGE_CODES.AUTH.REGISTER_SUCCESS,
        409: MESSAGE_CODES.AUTH.REGISTER_CONFLICT,
      },
    },
    '/tasks': {
      GET: {
        200: MESSAGE_CODES.TASK.LIST_SUCCESS,
      },
      POST: {
        201: MESSAGE_CODES.TASK.CREATE_SUCCESS,
      },
    },
    '/tasks/:id': {
      GET: {
        200: MESSAGE_CODES.TASK.GET_SUCCESS,
        404: MESSAGE_CODES.TASK.NOT_FOUND,
      },
      PUT: {
        200: MESSAGE_CODES.TASK.UPDATE_SUCCESS,
        404: MESSAGE_CODES.TASK.NOT_FOUND,
      },
      DELETE: {
        200: MESSAGE_CODES.TASK.DELETE_SUCCESS,
        404: MESSAGE_CODES.TASK.NOT_FOUND,
      },
    },
    '*': {
      '*': {
        200: MESSAGE_CODES.COMMON.SUCCESS,
        201: MESSAGE_CODES.COMMON.CREATED,
        204: MESSAGE_CODES.COMMON.NO_CONTENT,
        400: MESSAGE_CODES.COMMON.BAD_REQUEST,
        401: MESSAGE_CODES.COMMON.UNAUTHORIZED,
        403: MESSAGE_CODES.COMMON.FORBIDDEN,
        404: MESSAGE_CODES.COMMON.NOT_FOUND,
        409: MESSAGE_CODES.COMMON.CONFLICT,
        500: MESSAGE_CODES.COMMON.SERVER_ERROR,
      },
    },
  };

  public getMessage(route: string, method: string, statusCode: number): string {
    // Obtener el código de mensaje para la ruta específica
    const messageCode =
      this.routes[route]?.[method as HttpMethod]?.[statusCode];
    if (messageCode) {
      return BASE_MESSAGES[messageCode];
    }

    // Si no hay mensaje específico, usar el mensaje por defecto
    const defaultMessageCode = this.routes['*']?.['*']?.[statusCode];
    return defaultMessageCode
      ? BASE_MESSAGES[defaultMessageCode]
      : 'Operación completada';
  }
}
