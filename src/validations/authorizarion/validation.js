import { RESPONSE_MESSAGES } from "../../constants/responseMessages.js";
export const userRoleResourcePermissionBasedAccessValdation = (userRoles, userResource, userPermission, user_id, mobileNumber, userEmail) => {

    if (!user_id) {
        return RESPONSE_MESSAGES.ERROR.INVALID_USER_ID;
    }

    if (!mobileNumber || !userEmail) {
        return RESPONSE_MESSAGES.ERROR.EMAIL_MOBILE_NOT_FOUND;
    }

    if (!Array.isArray(userRoles) || userRoles.length === 0) {
        return RESPONSE_MESSAGES.ERROR.INVALIDE_ROLE
    }
    if (!Array.isArray(userResource) || userResource.length === 0) {
        return RESPONSE_MESSAGES.ERROR.INVALIDE_RESOURCE
    }
    if (!Array.isArray(userPermission) || userPermission.length === 0) {
        return RESPONSE_MESSAGES.ERROR.INVALIDE_PERMISSION
    }
    return null;
};