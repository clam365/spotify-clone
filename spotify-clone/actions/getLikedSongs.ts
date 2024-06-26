import {Song} from "@/types";
import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";


//Backend function fetching our songs from Supabase. Most clear-cut example of fullstack implementation
const getLikedSongs = async (): Promise<Song[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies,
    });

    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();

    const {data, error} = await supabase
        .from('liked_songs')
        .select('*, songs(*)')
        .eq('user_id', session?.user?.id)
        .order('created_at', {ascending: false});

        if (error) {
            console.log(error);
            return [];
        }

        if (!data) {
            return [];
        }

    //Spreading relations
    return data.map( (item) => ({
        ...item.songs
    }));
}

export default getLikedSongs;