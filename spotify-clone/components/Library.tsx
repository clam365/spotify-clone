"use client";

import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModal";
import React from "react";
import { Song } from "@/types";
import MediaItem from "@/components/MediaItem";

interface LibraryProps {
    songs: Song[];
}

const Library: React.FC<LibraryProps> = ({ songs }) => {
    const authModal = useAuthModal();
    const uploadModal = useUploadModal();
    const { user } = useUser();

    const onClick = () => {
        // This is to add songs. If there is no user login yet, prompt login
        if (!user) {
            return authModal.onOpen();
        }

        // TODO: check for stripe subscription

        // Else return
        return uploadModal.onOpen();
    };

    return (
        <div className={"flex flex-col"}>
            <div className={"flex items-center justify-between px-5 pt-4"}>
                <div className={"inline-flex items-center gap-x-2"}>
                    <TbPlaylist size={26} className={"text-neutral-400"} />
                    <p className={"text-neutral-400 font-medium text-md"}>
                        Your Library
                    </p>
                </div>
                <AiOutlinePlus
                    onClick={onClick}
                    size={20}
                    className={"text-neutral-400 cursor-pointer hover:text-white transition"}
                />
            </div>
            <div className={"flex flex-col gap-y-2 mt-4 px-3"}>
                {songs.map((item) => (
                    <MediaItem
                        key={item.id}
                        data={item}
                        onClick={() => {}} // Add appropriate onClick handler if needed
                    />
                ))}
            </div>
        </div>
    );
};

export default Library;
