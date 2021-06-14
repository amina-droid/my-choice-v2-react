export * from './globalTypes';

export type Actions<R> = {
  [K in keyof R]: R[K] extends never ? {
    type: K;
  } : {
    type: K;
    payload: R[K]
  }
}[keyof R]

export type CustomEventDict<E extends string, P, T extends EventTarget = any> = [E, P, T];
