import type { RequestHandler } from "express";
import { z } from "zod";

export const handleInvalidSignup: RequestHandler = (req, res, next) => {
    const { username, email, password } = req.body;

    // parse credentials
    const { success, error } = z.object({
        username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9]+$/),
        email: z.string().email(),
        password: z.string().min(8)
    }).safeParse({ username, email, password })

    // error early if credentials invalid
    if (!success) {
        res.status(422).json({
            success: false,
            reason: "input-validation",
            errors: error.errors,
        })
        return
    }

    next()
}

export const handleInvalidLogin: RequestHandler = (req, res, next) => {
    const { email, password } = req.body;

    // parse credentials
    const { success, error } = z.object({
        email: z.string().email(),
        password: z.string().min(8)
    }).safeParse({ email, password })

    // error early if credentials invalid
    if (!success) {
        res.status(422).json({
            success: false,
            reason: "input-validation",
            errors: error.errors,
        })
        return
    }

    next()
}

export const handleCORS: RequestHandler = (_, res, next) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    next()
}