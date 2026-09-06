//==========================================
// KG JOB FINDER
// SUPABASE CONNECTION
//==========================================

import { createClient }
from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl =
    "https://pbelikuzdakyoaypwdqe.supabase.co";

const supabaseKey =
    "sb_publishable_ddcV-eh4IxFZyGqXTycZEA_05uDRBKo";

export const supabase =
    createClient(
        supabaseUrl,
        supabaseKey
    );


//==========================================
// REGISTER
//==========================================

export async function registerUser(
    name,
    email,
    password,
    accountType
) {

    const {
        data,
        error
    } = await supabase.auth.signUp({

        email,

        password,

        options: {

            data: {

                name:
                    name,

                account_type:
                    accountType

            }

        }

    });


    if (error) {

        return {
            data,
            error
        };

    }


    //==========================================
    // CREATE PROFILE
    //==========================================

    if (data?.user) {

        const {
            error: profileError
        } = await supabase
            .from("profiles")
            .upsert({

                id:
                    data.user.id,

                full_name:
                    name,

                email:
                    email

            });


        if (profileError) {

            console.error(
                "Profile creation error:",
                profileError
            );

        }

    }


    return {
        data,
        error
    };

}


//==========================================
// LOGIN
//==========================================

export async function loginUser(
    email,
    password
) {

    return await supabase.auth.signInWithPassword({

        email,

        password

    });

}


//==========================================
// FORGOT PASSWORD
//==========================================
export async function resetPassword(email) {

                                        return await supabase.auth.resetPasswordForEmail(

                                            email,

                                            {

                                                redirectTo:
                                                    "https://kgjobfinder-cmyk.github.io/kg-job-finder-privacy/reset-password.html"

                                            }

                                        );

                                    }
//==========================================
// UPDATE PASSWORD
//==========================================

export async function updatePassword(
    password
) {

    return await supabase.auth.updateUser({

        password:
            password

    });

}


//==========================================
// LOGOUT
//==========================================

export async function logoutUser() {

    return await supabase.auth.signOut();

}


//==========================================
// CURRENT SESSION
//==========================================

export async function currentSession() {

    return await supabase.auth.getSession();

}