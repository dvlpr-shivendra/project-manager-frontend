import { ElMessage } from "element-plus"

export function handleAPIException(payload: ApiExceptionPayload, errors: any) {

    if (payload.message) {
        ElMessage.error(payload.message)
    }

    Object.keys(payload.errors).forEach(key => {
        if (Array.isArray(payload.errors[key])) {
            errors.value[key] = payload.errors[key][0]
        } else {
            errors.value[key] = payload.errors[key]
        }
    })

}