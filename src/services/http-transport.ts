type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions extends RequestInit {
  method?: HTTPMethod;
  data?: any;
  timeout?: number;
}

export default class HTTPTransport {
  static METHODS = {
    GET: 'GET' as HTTPMethod,
    POST: 'POST' as HTTPMethod,
    PUT: 'PUT' as HTTPMethod,
    DELETE: 'DELETE' as HTTPMethod,
  };

  queryStringify(data: Record<string, any>): string {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Data must be object');
    }

    let result = '?';

    for (const [key, value] of Object.entries(data)) {
      result += `${key}=${value}&`;
    }

    return result.slice(0, -1);
  }

  get = (url: string, options: RequestOptions): Promise<XMLHttpRequest> => {
    return this.request(
      options.data ? `${url}${this.queryStringify(options.data)}` : url,
      { ...options, method: HTTPTransport.METHODS.GET },
      options.timeout,
    );
  };

  post = (url: string, options: RequestOptions): Promise<XMLHttpRequest> => {
    return this.request(url, { ...options, method: HTTPTransport.METHODS.POST }, options.timeout);
  };

  put = (url: string, options: RequestOptions): Promise<XMLHttpRequest> => {
    return this.request(url, { ...options, method: HTTPTransport.METHODS.PUT }, options.timeout);
  };

  delete = (url: string, options: RequestOptions): Promise<XMLHttpRequest> => {
    return this.request(url, { ...options, method: HTTPTransport.METHODS.DELETE }, options.timeout);
  };

  request = (url: string, options: RequestOptions, timeout = 5000): Promise<XMLHttpRequest> => {
    const { headers = {}, method, data } = options;

    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error('No method'));
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === HTTPTransport.METHODS.GET;
      xhr.open(method, url);

      Object.keys(headers).forEach((key) => {
        //@ts-ignore
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = function () {
        resolve(xhr);
      };

      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.timeout = timeout;
      xhr.ontimeout = reject;

      if (isGet || !data) {
        xhr.send();
      } else {
        xhr.send(data);
      }
    });
  };
}
