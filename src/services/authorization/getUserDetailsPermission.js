import { authorizationUrl } from "../../constants/authorization/authorizationUrl.js";
import { RESPONSE_MESSAGES } from "../../constants/responseMessages.js";
import { STATUS_CODES } from "../../constants/statusCodeConstants.js";
import { getUserByUserId } from "./getUserByUserId.js"
import axios from "axios";

export const getUserDetailPermission = async (user_id, mobileNumber, userEmail, token) => {

    if (!token) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ success: RESPONSE_MESSAGES.ERROR.Fail, message: RESPONSE_MESSAGES.ERROR.INVALIDE_TOKEN });
    }

    // const mobileNumber = data?.mobileNumber;
    // const userEmail = data?.email;

    if (!user_id) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ success: RESPONSE_MESSAGES.ERROR.Fail, status: STATUS_CODES.BAD_REQUEST, message: RESPONSE_MESSAGES.ERROR.NO_USER_ID });
    }

    const url = `${authorizationUrl.get_user}`;
    try {

        const user = await getUserByUserId(user_id, mobileNumber, userEmail, token);
        

        if (user) {
            // Fetch user roles
            const rolesResponse = await axios.get(`${url}/${user.id}/role-mappings`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Extract roles from the response
            const userRoles = {
                realmRoles: rolesResponse.data.realmMappings || [],
                clientRoles: rolesResponse.data.clientMappings || {},
            };

            const clientRolesWithPermissions = Object.entries(
                userRoles.clientRoles
            ).map(([clientId, roles]) => {

                // Ensure `roles` is an array and contains roles
                if (Array.isArray(roles.mappings)) {
                    return {
                        clientId,
                        roles: roles.mappings.map((role) => role.name), // Extract the role names
                    };
                } else {
                    return {
                        clientId,
                        roles: [], // Empty array if no roles assigned
                    };
                }
            });

            // Evalution part start
            const apiUrl = `${authorizationUrl.get_user_resource_role_permission}`;
            const response = await axios.post(
                apiUrl,
                {
                    userId: user.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            // Evaluation part end

            // Combine user data with roles and permissions
            const userWithRoles = {
                roles: {
                    realmRoles: userRoles.realmRoles.map((role) => role.name), // Map realm roles to their names
                    clientRoles: clientRolesWithPermissions, // Include client roles with permissions
                },
            };

            // == user detail start
            const userDetails = {
                "id": user.id,
                "username": user.username,
                "firstName": user.firstName,
                "email": user.email,
                "emailVerified": true,
                "attributes": {
                    "mobile": [
                        user.attributes.mobile
                    ]
                },
            }

            // == user detail end
            // Send response with user data and roles

            // filtering data as per the requirement start
            const roleList = userWithRoles?.roles?.realmRoles
            const authorization = response?.data?.results

            const finalOutput = []

            // Function to filter policy names based on role list
            const groupedPolicies = authorization.map(resource => {

                const matchingPolicies = resource.policies.filter(policyObj => {

                    const policyName = policyObj.policy.name;
                    const lastWord = policyName.split(' '); // Extract the last word from policy name
                    lastWord.pop();
                    let lastWords = lastWord.join(' ');
                    return roleList.includes(lastWords); // Check if last word matches any role in the roleList
                })

                return {
                    // resource: resource.resource.name,
                    policies: matchingPolicies
                };
            }).filter(group => group.policies.length > 0);

            const groupedData = groupedPolicies.reduce((acc, obj) => {
                obj.policies.forEach(policyWrapper => {
                    const { resources, scopes } = policyWrapper.policy;

                    resources.forEach(resource => {
                        const existingResource = acc.find(item => item.resource === resource);
                        if (existingResource) {
                            // If resource already exists, merge scopes
                            existingResource.scope = [...new Set([...existingResource.scope, ...scopes])];
                        } else {
                            // If resource doesn't exist, create new entry
                            acc.push({ resource, scope: [...scopes] });
                        }
                    });
                });
                return acc;
            }, []);

            // filtering data as per the requirement end
            return {
                success: true,
                message: "User detail retrived successfully!",
                userDetail: userDetails,
                userRole: userWithRoles?.roles?.realmRoles,
                userAuthorization: groupedData
                // userAuthorization: response?.data?.results
                // userAuthorization: response?.data?.rpt?.authorization,
            };
        } else {
            throw new Error("No user found with the given mobile number.");
        }
    } catch (error) {
        // console.error('Error:', error.message || (error.response ? error.response.data : error));
        throw new Error(error.message || "An error occurred");
    }
};