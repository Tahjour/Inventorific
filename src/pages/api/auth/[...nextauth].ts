// src\pages\api\auth\[...nextauth].ts
import { comparePasswords } from "@/lib/auth/user-validation/server";
import { getConnectedClient } from "@/lib/database/mongodb";
import { getFormattedDate, getFormattedTime } from "@/lib/helpers/date";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  // adapter: MongoDBAdapter(mongoClientPromise, { databaseName: process.env.MONGODB_DATABASE }),
  // Configure one or more authentication providers
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID : "",
      clientSecret: process.env.GOOGLE_CLIENT_SEC ? process.env.GOOGLE_CLIENT_SEC : "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const mongoClient = await getConnectedClient();
        if (!mongoClient) {
          throw new Error("Error connecting to MongoDB");
        }
        if (!credentials) {
          throw new Error("No credentials provided");
        }
        const database = process.env.MONGODB_DATABASE ? process.env.MONGODB_DATABASE : "";
        const collection = process.env.MONGODB_USERS_COLLECTION
          ? process.env.MONGODB_USERS_COLLECTION
          : "";
        const users = mongoClient.db(database).collection(collection);
        const user = await users.findOne({ email: credentials.email });
        if (!user) {
          mongoClient.close();
          throw new Error("No user found");
        }
        const isValid = await comparePasswords(credentials.password, user.password);
        if (!isValid) {
          mongoClient.close();
          throw new Error("Invalid password");
        }
        mongoClient.close();
        return { id: user._id.toString(), ...user };
      },
    }),
  ],
  callbacks: {
    async signIn(params) {
      if (!params.account) {
        throw new Error("No account provided");
      }
      if (params.account.type === "oauth") {
        const mongoClient = await getConnectedClient();
        if (!mongoClient) {
          throw new Error("Error connecting to MongoDB");
        }
        const database = process.env.MONGODB_DATABASE ? process.env.MONGODB_DATABASE : "";
        const collection = process.env.MONGODB_USERS_COLLECTION
          ? process.env.MONGODB_USERS_COLLECTION
          : "";
        const users = mongoClient.db(database).collection(collection);
        const existingUser = await users.findOne({ email: params.user.email });
        if (existingUser) {
          return true;
        }

        const newUserDocument = {
          type: params.account.type,
          date_created: getFormattedDate(),
          time_created: getFormattedTime(),
          ...params.user,
          items: [],
        };
        try {
          await users.insertOne(newUserDocument);
        } catch (error) {
          console.error("Error adding user:", error);
          return false;
        }
        mongoClient.close();
      }
      return true;
    },
  },
};

export default NextAuth(authOptions);
