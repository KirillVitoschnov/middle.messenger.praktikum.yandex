import { HTTPMethodType, RequestOptionsType } from '../../types';

const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export default class HttpClient {
  private _baseUrl = '';

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

  get: HTTPMethodType = (url, options) => {
    const fullUrl = this._createUrl(url);

    return this.request(
      options?.data ? `${fullUrl}${this.queryStringify(options.data)}` : fullUrl,
      {
        ...options,
        method: METHODS.GET,
      },
    );
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

      if (headers) {
        Object.keys(headers).forEach((key) => {
          xhr.setRequestHeader(key, headers[key]);
        });
      }

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
}
