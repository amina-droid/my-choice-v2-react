declare global {
  interface Window {
    timeDiff: number;
  }
}

export const getTime = () => Date.now() - window.timeDiff;
