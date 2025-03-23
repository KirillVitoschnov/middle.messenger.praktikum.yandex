import { HTTPMethodType, RequestOptionsType } from '../../types';

const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export default class HttpClient {
  private _baseUrl = '';
  private _webSocket: WebSocket | null = null;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  _createUrl(url: string) {
    return `${this._baseUrl}${url}`;
  }

  queryStringify(data: Record<string, unknown>): string {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Data must be object');
    }
    let result = '?';
    for (const [key, value] of Object.entries(data)) {
      result += `${key}=${value}&`;
    }
    return result.slice(0, -1);
  }

  isPlainObject(data: unknown): data is Record<string, unknown> {
    return Object.prototype.toString.call(data) === '[object Object]';
  }

  get: HTTPMethodType = (url, options) => {
    const fullUrl = this._createUrl(url);
    let finalUrl = fullUrl;
    if (
      options?.data &&
      typeof options.data === 'object' &&
      !(options.data instanceof Document) &&
      this.isPlainObject(options.data)
    ) {
      finalUrl += this.queryStringify(options.data);
    }
    return this.request(finalUrl, { ...options, method: METHODS.GET });
  };

  post: HTTPMethodType = (url, options) => {
    const fullUrl = this._createUrl(url);
    return this.request(fullUrl, { ...options, method: METHODS.POST });
  };

  put: HTTPMethodType = (url, options) => {
    const fullUrl = this._createUrl(url);
    return this.request(fullUrl, { ...options, method: METHODS.PUT });
  };

  delete: HTTPMethodType = (url, options) => {
    const fullUrl = this._createUrl(url);
    return this.request(fullUrl, { ...options, method: METHODS.DELETE });
  };

  request = (url: string, options: RequestOptionsType) => {
    const { method, data, headers = {}, isCredentials = true } = options;
    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error('No method'));
        return;
      }
      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;
      xhr.open(method, url);
      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });
      if (isCredentials) {
        xhr.withCredentials = true;
      }
      xhr.onload = function () {
        resolve(xhr);
      };
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status < 400) {
            resolve(xhr.response);
          } else {
            reject(xhr);
          }
        }
      };
      xhr.onabort = () => reject(xhr);
      xhr.onerror = () => reject(xhr);
      xhr.ontimeout = () => reject(xhr);
      if (isGet || !data) {
        xhr.send();
      } else {
        xhr.send(data);
      }
    });
  };

  connectWebSocket(path: string, protocols?: string | string[]) {
    const fullUrl = this._createUrl(path).replace(/^http/, 'ws');
    this._webSocket = new WebSocket(fullUrl, protocols);
    this._webSocket.onopen = () => {
      console.log('WebSocket соединение установлено');
    };
    this._webSocket.onmessage = (event) => {
      console.log('Получено сообщение:', event.data);
    };
    this._webSocket.onerror = (error) => {
      console.error('Ошибка WebSocket:', error);
    };
    this._webSocket.onclose = (event) => {
      console.log('WebSocket соединение закрыто', event);
    };
  }

  sendWebSocketMessage(data: string | ArrayBuffer | Blob | ArrayBufferView) {
    if (!this._webSocket || this._webSocket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket соединение не установлено');
    }
    this._webSocket.send(data);
  }

  closeWebSocket(code?: number, reason?: string) {
    if (this._webSocket) {
      this._webSocket.close(code, reason);
      this._webSocket = null;
    }
  }
}
