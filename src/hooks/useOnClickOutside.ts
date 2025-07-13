import { useEffect, type RefObject } from 'react';

type EventHandler = (event: MouseEvent | TouchEvent) => void;

function useOnClickOutside(
    refs: RefObject<HTMLElement>[],
    handler: EventHandler
): void {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const isClickInside = refs.some(ref => 
                ref.current && ref.current.contains(event.target as Node)
            );

            if (isClickInside) {
                return;
            }

            handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, 
    [refs, handler]);
}

export default useOnClickOutside;