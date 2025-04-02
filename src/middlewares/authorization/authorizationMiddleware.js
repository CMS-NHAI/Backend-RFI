import { generateAccessToken } from "../../services/authorization/authorizationAccessToken.js";
import { getUserByUserId } from "../../services/authorization/getUserByUserId.js";
import { getUserDetailPermission } from "../../services/authorization/getUserDetailsPermission.js";
import { RESPONSE_MESSAGES } from "../../constants/responseMessages.js";
import { STATUS_CODES } from "../../constants/statusCodeConstants.js";
import { userRoleResourcePermissionBasedAccessValdation} from "../../validations/authorizarion/validation.js"

/**
 * Description: Middleware use to filter the request on the basis of @role @resource and @permission
*/
export const userRoleResourcePermissionBasedAccess = (userRoles, userResource, userPermission) => {
    return async (req, res, next) => {
        try {
            const mobileNumber = req.user?.phone_number;
            const userEmail = req.user?.email;
            const userId = req.user?.user_id;
            let user_id = Number(userId + "00");
            // Validation
            const validationError = userRoleResourcePermissionBasedAccessValdation(userRoles, userResource, userPermission, user_id, mobileNumber, userEmail)
            if (validationError) {
                return res.status(STATUS_CODES?.BAD_REQUEST).json({
                    success: RESPONSE_MESSAGES?.ERROR?.Fail,
                    status: STATUS_CODES?.BAD_REQUEST,
                    message: validationError,
                });
            }
            // Retrieve Keycloak token
            const token = await generateAccessToken();
            if (!token) {
                return res.status(STATUS_CODES?.BAD_REQUEST).json({ success: RESPONSE_MESSAGES?.ERROR?.Fail, status: STATUS_CODES?.BAD_REQUEST, message: RESPONSE_MESSAGES?.ERROR?.INVALIDE_TOKEN });
            }

            // Fetch user by email or mobile
            const user = await getUserByUserId(user_id, mobileNumber, userEmail, token);
           
            if (!user) {
                return res.status(STATUS_CODES?.NOT_FOUND).json({ success: RESPONSE_MESSAGES?.ERROR?.Fail, status: STATUS_CODES?.NOT_FOUND, message: RESPONSE_MESSAGES?.ERROR?.USER_NOT_FOUND });
            }

            // Fetch user details for role, resource, and permission validation
            const userDetail = await getUserDetailPermission(user_id, mobileNumber, userEmail, token);
            if (!userDetail) {
                return res.status(STATUS_CODES?.NOT_FOUND).json({ success: RESPONSE_MESSAGES?.ERROR?.Fail, status: STATUS_CODES?.NOT_FOUND, message: RESPONSE_MESSAGES?.ERROR?.USER_DETAIL_NOT_FOUND });
            }

            // Validate roles
            const hasUserRoles = userRoles.some(role => userDetail?.userRole.includes(role));
            if (!hasUserRoles) {
                return res.status(STATUS_CODES?.FORBIDDEN).json({ success: RESPONSE_MESSAGES?.ERROR?.Fail, status: STATUS_CODES?.FORBIDDEN, message: RESPONSE_MESSAGES?.ERROR?.INSUFFICIENT_PERMISSION });
            }

            // Validate resources
            const matchedResource = userDetail?.userAuthorization?.filter(auth => userResource.includes(auth.resource));
            if (!matchedResource || matchedResource.length === 0) {
                return res.status(STATUS_CODES?.FORBIDDEN).json({ success: RESPONSE_MESSAGES?.ERROR?.Fail, status: STATUS_CODES?.FORBIDDEN, message: RESPONSE_MESSAGES?.ERROR?.INSUFFICIENT_PERMISSION });
            }
        
            // Validate permissions
            const hasPermission = matchedResource.some(auth =>
                auth.scope.some(scope => userPermission.includes(scope))
            );

            if (!hasPermission) {
                return res.status(STATUS_CODES?.FORBIDDEN).json({ success: RESPONSE_MESSAGES?.ERROR?.Fail, status: STATUS_CODES?.FORBIDDEN, message: RESPONSE_MESSAGES?.ERROR?.INSUFFICIENT_PERMISSION });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(STATUS_CODES?.INTERNAL_SERVER_ERROR).json({ message: error?.message || RESPONSE_MESSAGES?.ERROR?.UNEXPECTED_ERROR });
        }
    };
};
