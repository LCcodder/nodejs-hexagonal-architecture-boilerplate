import z from "zod"

export default z.object({
    body: z.object({
        email: z.string().min(6).max(32),
        password: z.string().min(8).max(64),
    }).strict()
})