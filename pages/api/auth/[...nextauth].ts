import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const providers = []

if ((process.env.ONYXMD_GITHUB_ENABLED || '').toLocaleLowerCase() === 'true') {
    providers.push(Providers.GitHub({
        clientId: process.env.ONYXMD_GITHUB_CLIENT_ID,
        clientSecret: process.env.ONYXMD_GITHUB_CLIENT_SECRET,
    }))
}
if ((process.env.ONYXMD_GENERIC_AUTH_ENABLED || '').toLocaleLowerCase() === 'true') {
    providers.push({
        id: process.env.ONYXMD_GENERIC_AUTH_ID,
        name: process.env.ONYXMD_GENERIC_AUTH_NAME,
        type: process.env.ONYXMD_GENERIC_AUTH_TYPE,
        scope: process.env.ONYXMD_GENERIC_AUTH_SCOPE,
        accessTokenUrl: process.env.ONYXMD_GENERIC_AUTH_ACCESS_TOKEN_URL,
        authorizationUrl: process.env.ONYXMD_GENERIC_AUTH_AUTHORIZATION_URL,
        profileUrl: process.env.ONYXMD_GENERIC_AUTH_PROFILE_URL,
        profile(profile) {
            return {
                id: profile[process.env.ONYXMD_GENERIC_AUTH_KEY_ID],
                name: profile[process.env.ONYXMD_GENERIC_AUTH_KEY_NAME],
                email: profile[process.env.ONYXMD_GENERIC_AUTH_KEY_EMAIL],
                image: profile[process.env.ONYXMD_GENERIC_AUTH_KEY_IMAGE],
            }
        }
    })
}

export default NextAuth({providers})
