import { IncomingMessage } from "http";

  function getTokenFromRequest(req: IncomingMessage) {
    //Bearer 8sCOL40JsUIUb5haQHaNFUrX-C3CqyLGnt8-u4KZby4OU8EvhO4
    const AuthHeader = req.headers.authorization || '';
    if(AuthHeader){
        const token = AuthHeader.split('Bearer')[1];
        if(token){
            try{    
                return token;
            }catch(err){
               throw new Error('Invalid/Expored token');
            }
        }
        throw new Error('Authentication token must be Bearer[token]');
    }
    throw new Error('Authentication header must be provided');
  };

  export default getTokenFromRequest;