// src\pages\api\auth\[...nextauth].ts
import { comparePasswords } from "@/lib/auth/user-validation/server";
import { getConnectedClient } from "@/lib/database/mongodb";
import { getFormattedDate, getFormattedTime } from "@/lib/helpers/date";
import { ResponseError } from "@/lib/helpers/errors";
import { logger } from "@/lib/helpers/logger";
import { ErrorMessages } from "@/lib/helpers/messages";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export function getNextAuthOptions(req?: NextApiRequest): NextAuthOptions {
  const nextAuthOptions: NextAuthOptions = {
    // adapter: MongoDBAdapter(mongoClientPromise, { databaseName: process.env.MONGODB_DATABASE }),
    // Configure one or more authentication providers
    session: { strategy: "jwt" },
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SEC!,
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
        async authorize(credentials) {
          try {
            const mongoClient = await getConnectedClient();
            if (!mongoClient) {
              throw new ResponseError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                ErrorMessages.DatabaseConnectionFailed
              );
            }
            if (!credentials) {
              throw new ResponseError(StatusCodes.BAD_REQUEST, ErrorMessages.InvalidCredentials);
            }
            const database = process.env.MONGODB_DATABASE!;
            const collection = process.env.MONGODB_USERS_COLLECTION!;
            const users = mongoClient.db(database).collection(collection);
            const user = await users.findOne({ email: credentials.email });
            if (!user) {
              throw new ResponseError(StatusCodes.NOT_FOUND, ErrorMessages.UserNotFound);
            }
            const isValid = await comparePasswords(credentials.password, user.password);
            if (!isValid) {
              throw new ResponseError(StatusCodes.UNAUTHORIZED, ErrorMessages.InvalidCredentials);
            }
            return { id: user._id.toString(), ...user };
          } catch (error) {
            logger.error(error);
            throw error;
          }
        },
      }),
    ],
    callbacks: {
      async signIn({ user, account }) {
        try {
          if (!account) {
            throw new ResponseError(StatusCodes.BAD_REQUEST, ErrorMessages.InvalidCredentials);
          }
          if (account.type === "oauth") {
            const mongoClient = await getConnectedClient();
            if (!mongoClient) {
              throw new ResponseError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                ErrorMessages.DatabaseConnectionFailed
              );
            }
            const database = process.env.MONGODB_DATABASE!;
            const collection = process.env.MONGODB_USERS_COLLECTION!;
            const users = mongoClient.db(database).collection(collection);
            const existingUser = await users.findOne({ email: user.email });
            if (existingUser) {
              return true;
            }

            const newUserDocument = {
              login_type: account.type,
              date_created: getFormattedDate(),
              time_created: getFormattedTime(),
              ...user,
              items: [],
            };
            const insertResult = await users.insertOne(newUserDocument);
            if (!insertResult || !insertResult.insertedId) {
              throw new ResponseError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                ErrorMessages.UserCreationFailed
              );
            }
          }
          return true;
        } catch (error) {
          logger.error(error);
          throw error;
        }
      },
    },
  };
  return nextAuthOptions;
}

export default function NextAuthHandler(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, getNextAuthOptions(req));
}
