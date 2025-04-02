export const authorizationUrl = {
    "access_token": `${process.env.KEYCLOAK_SERVER_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
    "get_user": `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users`,
    "get_user_resource_role_permission": `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/clients/${process.env.KEYCLOAK_CLIENT_ID}/authz/resource-server/policy/evaluate`
}