import { randomBytes } from "node:crypto"
import { mongoClient } from "../.."
import { getMongoCollection } from "../../db"

type AuthenticationSucceeded = {
    success: true;
    sessionId: string;
}

type AuthenticationFailed = {
    success: false;
    reason: string;
}

type AuthenticationResult = AuthenticationSucceeded |AuthenticationFailed

export const signup = async (username: string, email: string, password: string): Promise<AuthenticationResult> => {
    const users = getMongoCollection(mongoClient, 'users')
    
    // dont register the same user twice
    if (!!await users.findOne({ email })) {
        return {
            success: false,
            reason: "user-exists",
        }
    }

    users.insertOne({ username, email, password })

    return {
        success: true,
        sessionId: createUserSession(email)
    }
}

export const login = async (email: string, password: string): Promise<AuthenticationResult> => {
    const exists = !!await getMongoCollection(mongoClient, 'users').findOne({ email, password })

    if (exists) {
        return {
            success: true,
            sessionId: createUserSession(email)
        }
    }

    return {
        success: false,
        reason: "invalid-credentials"
    }
}


function createUserSession(email: string) {
    const sessions = getMongoCollection(mongoClient, 'sessions')
    const sessionId = new TextDecoder('ascii').decode(randomBytes(16))
    sessions.insertOne({ email, sessionId })
    return sessionId
}