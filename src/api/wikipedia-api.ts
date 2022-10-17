import { RESTDataSource } from '@apollo/datasource-rest';
import type { KeyValueCache } from '@apollo/utils.keyvaluecache';

class wikiApi extends RESTDataSource { // highlight-line
    override baseURL = 'https://api.pandascore.co/';
  
    constructor(options: { cache: KeyValueCache }) {
      super(options); 
      
    }


    // This endopoint is not yet implemented properly
    async getVideoGame(wikiGameId)  {
  
      const result = await this.get(`videogames/${encodeURIComponent(wikiGameId)}`);
      return result;
    }
  }

  export default wikiApi;