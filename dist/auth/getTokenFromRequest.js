function getTokenFromRequest(req) {
    const AuthHeader = req.headers.authorization || ''; //Bearer token
    if (AuthHeader) {
        const token = AuthHeader.split('Bearer')[1]; // token
        if (token) {
            try {
                return token; //return token
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
