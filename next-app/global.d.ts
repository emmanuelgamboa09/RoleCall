import mongoose from 'mongoose'

declare global {
    var mongooseInst: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    namespace NodeJS {
        interface ProcessEnv extends ProcessEnv {
            AUTH0_SECRET: string
            AUTH0_BASE_URL: string
            AUTH0_ISSUER_BASE_URL: string
            AUTH0_CLIENT_ID: string
            AUTH0_CLIENT_SECRET: string
            DB_USER: string
            DB_PWD: string
        }
    }
}

export { }