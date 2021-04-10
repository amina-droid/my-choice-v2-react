import { useEffect, useRef } from 'react';

type Options = Pick<AddEventListenerOptions, 'capture' | 'passive' | 'once'>;

function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: HTMLElementEventMap[K],
  // allow null to support usage with `useRef<HTMLElement | null>(null)`
  element: HTMLElement | null,
  options?: Options
): void;
function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: DocumentEventMap[K],
  element: Document,
  options?: Options
): void;
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: WindowEventMap[K],
  element?: Window,
  options?: Options
): void;
function useEventListener(
  eventName: string,
  handler: EventListenerOrEventListenerObject,
  element?: HTMLElement | Window | Document | null,
  options?: Options
): void;
function useEventListener<
  K extends keyof (HTMLElementEventMap & DocumentEventMap & WindowEventMap)
  >(
  eventName: K,
  handler: (
    event: (HTMLElementEventMap & DocumentEventMap & WindowEventMap)[K]
  ) => void,
  element?: HTMLElement | Document | Window | null,
  options?: Options
): void;
function useEventListener(
  eventName: any,
  handler: any,
  element: any = global,
  options: any = {},
) {
  const savedHandler = useRef<any>();
  const { capture, passive, once } = options;

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) {
      return;
    }

    const eventListener = (event: any) => savedHandler.current(event);
    const opts = { capture, passive, once };
    element.addEventListener(eventName, eventListener, opts);
    // eslint-disable-next-line consistent-return
    return () => {
      element.removeEventListener(eventName, eventListener, opts);
    };
  }, [eventName, element, capture, passive, once]);
}

export default useEventListener;
