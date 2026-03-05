import crypto from "crypto"

export const generateApiKey = ():string => {
    const random = crypto.randomBytes(32).toString("hex")
    return `invox_${random}`
}

export const hashApiKey = (key: string):string =>{
    return crypto.createHash("sha256").update(key).digest("hex")
}

export const verifyAPIKey = (key: string, hash: string): boolean =>{ 
    const hashKey = hashApiKey(key)
    return crypto.timingSafeEqual(
        Buffer.from(hashKey),
        Buffer.from(hash)
    )
}

export const getKeyPrefix = (rawKey: string): string => {
    return rawKey.slice(0, 12) // "invox_" + first 6 chars
}