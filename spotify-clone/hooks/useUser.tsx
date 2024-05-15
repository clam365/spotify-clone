import {User} from "@supabase/auth-helpers-nextjs";
import {Subscription, UserDetails} from "@/types";
import {createContext, useContext, useEffect, useState} from "react";
import {useSessionContext, useUser as useSupaUser} from "@supabase/auth-helpers-react";

type UserContextType = {
    accessToken: string | null;
    user: User | null;
    userDetails: UserDetails | null;
    isLoading: boolean;
    subscription: Subscription | null;
};

export const UserContext = createContext<UserContextType | undefined>(
    undefined
);

export interface Props {
    [propName: string]: any
}

//These have the data, user details, and their subcription status to be used...
export const MyUserContextProvider = (props: Props) => {
    const {session,
        isLoading: isLoadingUser,
        supabaseClient: supabase
    } = useSessionContext();

    const user = useSupaUser();
    const accessToken = session?.access_token ?? null;
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    // Fetching User Details

    const getUserDetails = () => supabase.from('users').select("*").single();
    const getSubscription = () => supabase.from('subscriptions').select('*, prices(*, products(*))').in('status', ['trialing', 'active']).single();

    useEffect(() => {
        //if the data is not ready, Loading Data is true; so we need to load it
        if (user && !isLoadingData && !userDetails && !subscription) {
            setIsLoadingData(true);

            //Fullfilling our loading
            Promise.allSettled([getUserDetails(), getSubscription()]).then(
                (results) => {
                    const userDetailsPromise = results[0];
                    const subscriptionPromise = results[1];

                    if (userDetailsPromise.status === "fulfilled") {
                        setUserDetails(userDetailsPromise.value.data as UserDetails);
                    }

                    if (subscriptionPromise.status === "fulfilled") {
                        setSubscription(subscriptionPromise.value.data as Subscription);
                    }

                    setIsLoadingData(false); //loading completed, reverse it
                }
            )
        }

        else if (!user && !isLoadingUser && !isLoadingData) {
            setUserDetails(null);
            setSubscription(null);
        }

    }, [user, isLoadingUser]);

    const value = {
        accessToken,
        user,
        userDetails,
        isLoading: isLoadingUser || isLoadingData,
        subscription
    };

    return <UserContext.Provider value={value} {...props}/>
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a MyUserContextProvider');
    }
    return context;
}