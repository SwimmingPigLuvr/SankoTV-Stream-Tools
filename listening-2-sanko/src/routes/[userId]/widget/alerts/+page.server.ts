import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async ({ params }) => {
    const { userId } = params;
    console.log('Fetching data for userId:', userId);
    try {
        const userData = await getUserDataById(userId);
        if (!userData) {
            console.log('user not found for userID', userId);
            throw error(404, 'User not found');
        }
        console.log('Fetched userData:', userData);
        return {
            userId,
            userAlerts: userData.data?.donationAlerts || [],
            streamerAddress: userData.wallet_address,
        };

    } catch (err) {
        console.error('error in laod function:', err);
        throw error(500, 'internal server error');
    }
};

async function getUserDataById(userId: string) {
    const { data, error: supabaseError } = await supabase
        .from('users')
        .select('id, wallet_address, data, username')
        .eq('id', userId)
        .single();

    if (supabaseError) {
        if (supabaseError.code === 'PGRST116') {
            console.log('no user found with id: ', userId);
            return null;
        }
        console.error('supabaseError:', supabaseError);
        return null;
    }

    return data;
}
