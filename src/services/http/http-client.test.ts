import { assert } from 'chai';
import HttpClient from './http-client';

if (typeof Document === 'undefined') {
    (global as any).Document = class {};
}

describe('HttpClient', () => {
    class FakeXMLHttpRequest {
        static requests: FakeXMLHttpRequest[] = [];
        method: string = '';
        url: string = '';
        requestHeaders: Record<string, string> = {};
        withCredentials: boolean = false;
        readyState: number = 0;
        status: number = 200;
        response: any = null;
        onload: (() => void) | null = null;
        onreadystatechange: (() => void) | null = null;
        onabort: (() => void) | null = null;
        onerror: (() => void) | null = null;
        ontimeout: (() => void) | null = null;
        sendData: any = null;

        constructor() {
            FakeXMLHttpRequest.requests.push(this);
        }
        open(method: string, url: string) {
            this.method = method;
            this.url = url;
        }
        setRequestHeader(key: string, value: string) {
            this.requestHeaders[key] = value;
        }
        send(data?: any) {
            this.sendData = data;
            // Имитируем асинхронный ответ
            setTimeout(() => {
                this.readyState = 4;
                if (this.onreadystatechange) this.onreadystatechange();
                if (this.onload) this.onload();
            }, 0);
        }
        abort() {}
    }

    let originalXMLHttpRequest: any;
    beforeEach(() => {
        originalXMLHttpRequest = (global as any).XMLHttpRequest;
        (global as any).XMLHttpRequest = FakeXMLHttpRequest;
        FakeXMLHttpRequest.requests = [];
    });
    afterEach(() => {
        (global as any).XMLHttpRequest = originalXMLHttpRequest;
    });

    describe('Метод queryStringify', () => {
        it('преобразует объект в строку запроса', () => {
            const client = new HttpClient('http://example.com');
            const result = client.queryStringify({ a: 1, b: 'test' });
            assert.equal(result, '?a=1&b=test');
        });
        it('выбрасывает ошибку, если данные не объект', () => {
            const client = new HttpClient('http://example.com');
            assert.throws(() => client.queryStringify(null as any), 'Data must be object');
        });
    });

    describe('HTTP методы', () => {
        it('GET формирует URL с query string', async () => {
            const client = new HttpClient('http://example.com');
            await client.get('/test', { data: { a: 1 } as any });
            const req = FakeXMLHttpRequest.requests[0];
            assert.equal(req.method, 'GET');
            assert.equal(req.url, 'http://example.com/test?a=1');
        });
        it('POST отправляет данные', async () => {
            const client = new HttpClient('http://example.com');
            const postData = 'data';
            await client.post('/test', { data: postData });
            const req = FakeXMLHttpRequest.requests[0];
            assert.equal(req.method, 'POST');
            assert.equal(req.url, 'http://example.com/test');
            assert.equal(req.sendData, postData);
        });
        it('PUT отправляет данные', async () => {
            const client = new HttpClient('http://example.com');
            const putData = 'update';
            await client.put('/test', { data: putData });
            const req = FakeXMLHttpRequest.requests[0];
            assert.equal(req.method, 'PUT');
            assert.equal(req.url, 'http://example.com/test');
            assert.equal(req.sendData, putData);
        });
        it('DELETE работает корректно', async () => {
            const client = new HttpClient('http://example.com');
            await client.delete('/test', {});
            const req = FakeXMLHttpRequest.requests[0];
            assert.equal(req.method, 'DELETE');
            assert.equal(req.url, 'http://example.com/test');
        });
    });

    describe('WebSocket методы', () => {
        class FakeWebSocket {
            static instances: FakeWebSocket[] = [];
            static CONNECTING = 0;
            static OPEN = 1;
            static CLOSING = 2;
            static CLOSED = 3;

            url: string;
            protocols?: string | string[];
            readyState: number;
            onopen: (() => void) | null = null;
            onmessage: ((event: { data: any }) => void) | null = null;
            onerror: ((error: any) => void) | null = null;
            onclose: ((event: any) => void) | null = null;
            sentData: any;

            constructor(url: string, protocols?: string | string[]) {
                this.url = url;
                this.protocols = protocols;
                this.readyState = FakeWebSocket.CONNECTING;
                FakeWebSocket.instances.push(this);
                setTimeout(() => {
                    this.readyState = FakeWebSocket.OPEN;
                    if (this.onopen) this.onopen();
                }, 0);
            }
            send(data: any) {
                this.sentData = data;
            }
            close(code?: number, reason?: string) {
                this.readyState = FakeWebSocket.CLOSED;
                if (this.onclose) this.onclose({ code, reason });
            }
        }

        let originalWebSocket: any;
        beforeEach(() => {
            originalWebSocket = (global as any).WebSocket;
            (global as any).WebSocket = FakeWebSocket;
            FakeWebSocket.instances = [];
        });
        afterEach(() => {
            (global as any).WebSocket = originalWebSocket;
        });

        it('connectWebSocket устанавливает соединение с корректным URL', (done) => {
            const client = new HttpClient('http://example.com');
            client.connectWebSocket('/ws', 'protocol1');
            setTimeout(() => {
                const ws = FakeWebSocket.instances[0];
                assert.equal(ws.url, 'ws://example.com/ws');
                assert.equal(ws.protocols, 'protocol1');
                done();
            }, 10);
        });
        it('sendWebSocketMessage отправляет сообщение, если соединение открыто', (done) => {
            const client = new HttpClient('http://example.com');
            client.connectWebSocket('/ws');
            setTimeout(() => {
                const ws = FakeWebSocket.instances[0];
                client.sendWebSocketMessage('hello');
                assert.equal(ws.sentData, 'hello');
                done();
            }, 10);
        });
        it('sendWebSocketMessage выбрасывает ошибку, если соединение не установлено', () => {
            const client = new HttpClient('http://example.com');
            assert.throws(() => client.sendWebSocketMessage('hello'), 'WebSocket соединение не установлено');
        });
        it('closeWebSocket закрывает соединение и сбрасывает _webSocket', (done) => {
            const client = new HttpClient('http://example.com');
            client.connectWebSocket('/ws');
            setTimeout(() => {
                const ws = FakeWebSocket.instances[0];
                client.closeWebSocket(1000, 'Normal Closure');
                assert.equal(ws.readyState, FakeWebSocket.CLOSED);
                // @ts-ignore: проверяем приватное свойство _webSocket
                assert.isNull(client._webSocket);
                done();
            }, 10);
        });
    });
});
