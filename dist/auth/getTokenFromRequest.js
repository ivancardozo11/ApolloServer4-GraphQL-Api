function getTokenFromRequest(req) {
    const AuthHeader = req.headers.authorization || '';
    if (AuthHeader) {
        const token = AuthHeader.split('Bearer')[1];
        if (token) {
            try {
                console.log(token);
                return token;
            }
            catch (err) {
                throw new Error('Invalid/Expored token');
            }
        }
        throw new Error('Authentication token must be Bearer[token]');
    }
    throw new Error('Authentication header must be provided');
}
;
export default getTokenFromRequest;
