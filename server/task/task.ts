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

  public then<TResult1 = any, TResult2 = never>
          (onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | undefined | null,
           onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
          ) : Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected)
  }

  public catch<TResult = never> (onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<any | TResult> {
    return this.promise.catch(onrejected)
  }

  public finally<T> (onfinally?: (() => void) | undefined | null): Promise<T> {
    return this.promise.finally(onfinally)
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

}
