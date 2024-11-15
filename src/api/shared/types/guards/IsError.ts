import { generateGuard } from "typing-assets";
import { _Error } from "../_Error";

export const isError = generateGuard<_Error>("code", "number")