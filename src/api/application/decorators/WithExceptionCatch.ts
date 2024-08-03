
export function withExceptionCatch  (_target: any, _key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    
    descriptor.value = async (...args: unknown[]) => {
        try {
            return await originalMethod.apply(...args)
        } catch (error) {
            console.log(error)
            return {
                code: 503,
                message: "Service unavailable"
            }
        }
    }

    return descriptor
}
