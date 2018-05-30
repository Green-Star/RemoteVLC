//import * as TaskModel from './task.model'


/* I have to give credit to https://stackoverflow.com/a/45363133/7683968 
   and https://stackoverflow.com/a/44905352/7683968 for this one :) */
export class Task implements Promise<any> {
  private name: string

  private internalResolve
  private internalReject
  private promise: Promise<any>

  constructor(name: string) {
    let _resolve, _reject

    this.promise = new Promise((resolve, reject) => {
      _resolve = resolve
      _reject = reject
    })

    this.internalResolve = _resolve
    this.internalReject = _reject
    this.name = name
  }

/*
  public then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) =>
      TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) =>
      TResult2 | PromiseLike<TResult2>) | undefined | null
    ): Promise<TResult1 | TResult2> {
      return this.promise.then(onfulfilled, onrejected)
    }

  public catch<TResult = never>(
    onrejected?: ((reason: any) =>
      TResult | PromiseLike<TResult>) | undefined | null
    ): Promise<any | TResult> {
      return this.promise.then(onrejected)
    }
    */

  public then<TResult1 = any, TResult2 = never> (onfulfilled?, onrejected?): Promise<TResult1 | TResult2> {
      return this.promise.then(onfulfilled, onrejected)
    }

  public catch<TResult = never> (onrejected?): Promise<any | TResult> {
      return this.promise.then(onrejected)
    }


  public resolve (val: any) { 
    this.internalResolve(val) 
  }

  public reject (reason: any) { 
    this.internalReject(reason) 
  }

  public getName (): string {
    return this.name
  }

  [Symbol.toStringTag]: 'Promise'






/*extends Promise<any> {
  private name: string;

  public myresolve;
  public reject;

  /* I have to give credit to https://stackoverflow.com/a/45363133/7683968 
     and https://stackoverflow.com/a/44909351/7683968 for this one :) */
/****
  constructor(name: string) {
    let _resolve, _reject

    super((resolve, reject) => {
      _resolve = resolve
      _reject = reject
    })

    this.name = name
    this.myresolve = _resolve
    this.reject = _reject
  }

  public resolve(object: any) {
    return this.myresolve(object)
  }

  public then(onfulfilled?, onrejected?) {
    return super.then(onfulfilled, onrejected)
  }

  public getName(): string {
    return this.name
  }

/*
  constructor(name: string, callback: (resolve, reject) => void) {
    this.name = name
    this.promise = new Promise(callback)
    this.resolve = resolve
    this.reject = reject
  }

  resolve(object: any) {
    this.promise.resolve(object)
  }

  reject(object: any) {
    this.promise.reject(object)
  }

  returnPromise() {
    return this.promise
  }

  /* I have to give credit to https://stackoverflow.com/a/45363133/7683968 for this one :) */
  public newTask (name) {
    /*
    let _resolve, _reject

    let promise = new Promise(function(resolve, reject) {
      _resolve = resolve
      _reject = reject
    })

    promise.resolve = _resolve
    promise.reject = _reject

    return { name: name, promise: promise }
    */
  }
}
