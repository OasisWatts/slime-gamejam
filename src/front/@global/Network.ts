type XHROptions = {
  'method': "GET"|"POST",
  'url': string,
  'binary'?: boolean,
  'data'?: string|ArrayBuffer,
  'headers'?: Table<string>
};
export type XHRResponse<T> = {
  'status': number;
  'result': T;
};
type XHRResultHandler = (status:number, result:any) => void;
type ProgressEventHandler = (e:ProgressEvent, req:XMLHttpRequest) => void;

export function getFormData($form:HTMLFormElement):Table<string>{
  const formData = new FormData($form);
  const R:Table<string> = {};

  for(const [ k, v ] of formData.entries()){
    if(typeof v === "string"){
      R[k] = v;
    }
  }
  return R;
};
export class Cookie{
  private static PARSER:RegExp = /^(.+)=(.*)$/;

  // NOTE SSR을 위해 정적 구간에서 정의하지 않는다.
  private static table:Table<string>;

  private static parseCookies():Table<string>{
    const R:Table<string> = {};
    const data = document.cookie;
    let arr:RegExpMatchArray;

    if(!data){
      return R;
    }
    for(const chunk of data.split(';')){
      arr = chunk.trim().match(Cookie.PARSER);
      if(!arr){
        console.warn("Invalid cookie format");
        continue;
      }
      R[arr[1]] = decodeURIComponent(arr[2]);
    }
    return R;
  }
  public static get(name:string):string{
    if(!Cookie.table){
      Cookie.table = Cookie.parseCookies();
    }
    return Cookie.table[name];
  }
  public static set(name:string, value:string):void{
    if(!Cookie.table){
      Cookie.table = Cookie.parseCookies();
    }
    Cookie.table[name] = value;
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  }
}
export class HRef{
  private static PARSER:RegExp = /^(.+)=(.*)$/;

  // NOTE SSR을 위해 정적 구간에서 정의하지 않는다.
  private static table:Table<string>;

  private static parseURL():Table<string>{
    const R:Table<string> = {};
    const data = location.search.slice(1);
    let arr:RegExpMatchArray;

    if(!data){
      return R;
    }
    for(const chunk of data.split('&')){
      arr = chunk.trim().match(HRef.PARSER);
      if(!arr){
        console.warn("Invalid URL format");
        continue;
      }
      R[decodeURIComponent(arr[1])] = decodeURIComponent(arr[2]);
    }
    return R;
  }
  public static stringifyURL(concat:Table<any> = {}, noOrigin?:boolean):string{
    if(!HRef.table){
      HRef.table = HRef.parseURL();
    }
    return "?" + Object.entries(noOrigin ? concat : { ...this.table, ...concat })
      .filter(e => e[1] !== undefined)
      .map(([ k, v ]) => {
        return `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`;
      }).join('&')
    ;
  }
  public static get(name:string):string{
    if(!HRef.table){
      HRef.table = HRef.parseURL();
    }
    return HRef.table[name];
  }
}
export class XHR{
  private static table:Table<XHR> = {};
  private static id:number = 0;

  public static send<T>(
    options:XHROptions,
    onProgress?:ProgressEventHandler
  ):Promise<XHRResponse<T>>{
    return new Promise((res, rej) => {
      const xhr = new XHR(options, (status, result) => {
        const R:XHRResponse<any> = {
          status,
          result
        };
        let rejected = false;

        if(result && result['error']){
          rejected = true;
          rej(status);
        }else if(!result || status >= 400){
          console.error(status ? "xhr-error" : "xhr-error-0", status ? "high" : "medium", options.url, status);
        }
        if(!rejected) res(R);
        delete XHR.table[xhr.id];
      }, onProgress);
    });
  }
  public static get<T>(url:string):Promise<XHRResponse<T>>{
    return XHR.send({
      method: "GET",
      url
    });
  }
  public static post<T>(url:string, data:Table<any>):Promise<XHRResponse<T>>{
    return XHR.send({
      method: "POST",
      url,
      headers: { 'Content-Type': "application/json;charset=utf-8" },
      data: JSON.stringify(data)
    });
  }
  public static progressByRate(ontoProgress:(rate:number) => boolean):ProgressEventHandler{
    return (e, req) => {
      if(e.lengthComputable && !ontoProgress(e.loaded / e.total)){
        req.abort();
      }
    };
  }

  private id:number;
  private source:XMLHttpRequest;

  constructor(options:XHROptions, res?:XHRResultHandler, onProgress?:ProgressEventHandler){
    this.id = ++XHR.id;
    this.source = new XMLHttpRequest();
    this.source.open(options.method, options.url, true);
    for(const i in options.headers){
      this.source.setRequestHeader(i, options.headers[i]);
    }
    this.source.addEventListener('readystatechange', this.getOnReadyStateChangeClosure(res));
    onProgress && this.source.upload.addEventListener('progress', e => onProgress(e, this.source));

    if(options.binary){
      this.source.responseType = "blob";
    }
    this.source.withCredentials = true;
    this.source.setRequestHeader('X-Requested-With', "XMLHttpRequest");
    this.source.send(options.data);

    XHR.table[this.id] = this;
  }
  private getOnReadyStateChangeClosure(res:XHRResultHandler):() => void{
    return () => {
      if(this.source.readyState !== XMLHttpRequest.DONE) return;
      const contentType:string = this.source.getResponseHeader('Content-Type');
      let data:string|Table<any> = this.source.response;

      if(contentType && contentType.startsWith("application/json")){
        data = JSON.parse(String(data));
      }
      res(this.source.status, data);
    };
  }
}