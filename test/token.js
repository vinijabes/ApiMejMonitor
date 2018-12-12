var accessToken;

module.exports = {
    set: (token) => {
        accessToken = token;
    },

    get: () => {
        return accessToken;
    },

    bearer: () => {
        return `Bearer ${accessToken}`;
    }
}