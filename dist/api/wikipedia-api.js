import { RESTDataSource } from '@apollo/datasource-rest';
class wikiApi extends RESTDataSource {
    constructor(options) {
        super(options);
        this.baseURL = 'https://api.pandascore.co/';
    }
    // This endopoint is not yet implemented properly
    async getVideoGame(wikiGameId) {
        const result = await this.get(`videogames/${encodeURIComponent(wikiGameId)}`);
        return result;
    }
}
export default wikiApi;
