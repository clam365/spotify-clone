"use client";
import {useEffect, useState} from "react";
import AuthModal from "@/components/AuthModal";

const ModalProvider = () => {

    const [isMounted, setIsMounted] = useState(false);

    //We never want to render a modal if it's server side rendering
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <AuthModal/>
        </>
    );
}

export default ModalProvider;