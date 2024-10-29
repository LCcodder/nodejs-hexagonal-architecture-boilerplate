import z from "zod"

export default z.object({
    body: z.object({
        to: z.string().min(6).max(1024)
    }).strict()
})