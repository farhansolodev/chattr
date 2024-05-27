export function panicIfEnvVarNotSet(name: string) {
    if (!!process.env[name]) return
    throw new Error("Missing environment variable: " + name)
}