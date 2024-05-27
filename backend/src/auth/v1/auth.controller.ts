import type { CookieOptions, RequestHandler } from "express";
import * as authService from "./auth.service";
import { randomBytes } from "node:crypto";

const cookieOptions: CookieOptions = {
    // because XSS
    httpOnly: true,

    // CORS will block cross-domain API data if 'Secure;' isn't set on the cookie
    sameSite: "none",
    secure: true,
}

export const signup: RequestHandler = async (req, res) => {
    const { username, email, password } = req.body

    const result = await authService.signup(username, email, password)
    if (!result.success) {
        res.status(409).json({ 
            success: result.success, 
            reason: result.reason 
        })
        return
    }

    res.status(201)
        .cookie('sid', result.sessionId, cookieOptions)
        .send()
};

export const login: RequestHandler = async (req, res) => {
    const { email, password } = req.body;

    const result = await authService.login(email, password)
    if (!result.success) {
        res.status(401)
            .json({
                success: result.success,
                reason: result.reason
            })
        return
    }

    res.status(200)
        .cookie('sid', result.sessionId, cookieOptions)
        .send()
};