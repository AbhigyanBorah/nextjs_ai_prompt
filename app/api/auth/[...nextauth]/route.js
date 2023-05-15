import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';

import User from "@models/user";
import {connectToDB} from "@utils/database";


const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_ID,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET_KEY,
        })
    ],

    async session({session}) {

        const sessionUser = await User.findOne({
            email: session.user.email
        });

        session.user.id = sessionUser._id.toString();

        return session;
    },

    async signIn({profile}) {
        try {
            await connectToDB();

            //check if a user is already logged in
            const userExists = await User.findOne({
                email: profile.email
            });

            //if not, create a new user
            if (!userExists) {
                await User.create({
                    email: profile.email,
                    username: profile.name.replace(" ", "").toLowercase(),
                    image: profile.picture
                });
            }

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
});

export {handler as GET, handler as POST};