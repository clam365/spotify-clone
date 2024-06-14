//when we look up a song in the search bar, we want a delay until the user has fully stopped typing

import {useEffect, useState} from "react";

function useDebounce<T>(value: T, delay?: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    //every time a user types, a delay will hit on loading songs, when they stop typing its 500ms
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        }, delay || 500);

        return () => {
            clearTimeout(timer);
        }
    }, [value, delay]);

     return debouncedValue;
}

export default useDebounce;