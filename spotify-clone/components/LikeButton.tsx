"use client";

import React, {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {useSessionContext} from "@supabase/auth-helpers-react";
import useAuthModal from "@/hooks/useAuthModal";
import {useUser} from "@/hooks/useUser";
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai";

import {toast} from "react-hot-toast";


interface LikeButtonProps {
    songId: string;
}
const LikeButton: React.FC<LikeButtonProps> = ({songId}) => {

  const router = useRouter();
  const {supabaseClient} = useSessionContext();

  const authModal = useAuthModal();
  const {user} = useUser();
  const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        //Does the user exist?
        if (!user?.id) {
            return;
        }

        //Fetch the user data on if the user id matches and the songId matches the tables also
        const fetchData = async () => {
            const { data, error } = await supabaseClient
                .from('liked_songs')
                .select('*')
                .eq('user_id', user.id)
                .eq('song_id', songId)
                .single();

            //Error Check
            if (!error && data) {
                setIsLiked(true);
            }
        };

        fetchData().then(); //Do the function

    }, [songId, supabaseClient, user?.id]);

    const Icon = isLiked ? AiFillHeart : AiOutlineHeart; //depending on Liked State or not, it will choose the image
    const handleLike = async () => {
        //If logged out, it will open Authentication
        if (!user) {
            return authModal.onOpen;
        }

        if (isLiked) {
            const {error} = await supabaseClient
                .from('liked_songs')
                .delete()
                .eq('user_id', user.id)
                .eq('song_id', songId);

            if (error) {
                toast.error(error.message);
            }
            else {
                setIsLiked(false);
            }
        }
        else {
            const {error} = await supabaseClient
                .from('liked_songs')
                .insert({
                    song_id: songId,
                    user_id: user.id
                })
            if (error) {
                toast.error(error.message);
            }
            else {
                setIsLiked(true);
                toast.success('Liked!');
            }
        }
        router.refresh();
    }

  return (
      <button className={"hover:opacity-75 transition"} onClick={handleLike}>
          <Icon color={isLiked ? '#22c55e' : 'white'} size={25}/>
      </button>
  );
}

export default LikeButton;