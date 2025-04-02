import { userDetail } from './userDetail.js';
import { authorizationUrl } from '../../constants/authorization/authorizationUrl.js';

export const getUserByUserId = async (username, mobileNumber, email, token) => {
    try {
        // Search by username first
        if (username) {
            const usersByUsername = await userDetail(`${authorizationUrl.get_user}?username=${username}`, token);
            if (usersByUsername.length > 0) {
                return usersByUsername[0];
            }
        }

        // If not found by username, search by mobileNumber
        if (mobileNumber) {
            const usersByMobile = await userDetail(`${authorizationUrl.get_user}?first=0&max=1000`, token);
            const userByMobile = usersByMobile.find(user => user?.attributes?.mobile?.includes(mobileNumber));
            if (userByMobile) {
                return userByMobile;
            }
        }

        // If not found by mobileNumber, search by email
        if (email) {
            const usersByEmail = await userDetail(`${authorizationUrl.get_user}?email=${email}`, token);
            if (usersByEmail.length > 0) {
                return usersByEmail[0];
            }
        }

        // If no user is found by any of the provided parameters, return null
        return null;
    } catch (error) {
        console.error("Error fetching user by username, mobile number, or email:", error);
        throw error;
    }
};
