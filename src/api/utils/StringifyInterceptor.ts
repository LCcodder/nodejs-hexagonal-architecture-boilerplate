export const stringifyForQuery = <T>(datastream: T): string => {
    if (Array.isArray(datastream)) {
        return `[${datastream}]`
    }

    switch (typeof datastream) {
        case "number" || "bigint":
            return (datastream as number).toString()
        case "undefined" || null:
            return "null"
        case "string" || "symbol":
            return `'${datastream}'`
        default:
            return `'${datastream}'`
    }

}