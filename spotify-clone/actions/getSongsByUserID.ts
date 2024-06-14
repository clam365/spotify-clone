import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// Backend function fetching our songs from Supabase. Most clear-cut example of fullstack implementation
// Intended to check on the user and their respective songs
const getSongsByUserID = async (): Promise<Song[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies,
    });

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
        console.log(sessionError.message);
        return [];
    }

    const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('user_id', sessionData.session?.user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.log(error.message);
        return [];
    }

    return (data as Song[]) || [];
};

export default getSongsByUserID;
