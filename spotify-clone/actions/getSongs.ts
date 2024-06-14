import {Song} from "@/types";
import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";


//Backend function fetching our songs from Supabase. Most clear-cut example of fullstack implementation
const getSongs = async (): Promise<Song[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies,

    });

    const {data, error} = await supabase
        .from('songs')
        .select('*')
        .order('created_at', {ascending: false});

        if (error) {
            console.log(error);
        }

    return  (data as any ) || [];
}

export default getSongs;