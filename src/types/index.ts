export * from './globalTypes';

export type Actions<R> = {
  [K in keyof R]: R[K] extends never ? {
    type: K;
  } : {
    type: K;
    payload: R[K]
  }
}[keyof R]
