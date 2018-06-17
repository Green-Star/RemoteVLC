export function delay<T> (millis: number, value?: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), millis))
}

export function resolvedPromise<T> (value?: T): Promise<T> {
  return new Promise(resolve => resolve(value))
}
