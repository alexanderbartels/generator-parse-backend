
import Request from 'superagent';

export default class ParseApp {

  constructor(migrationVersionTable, applicationId, masterKey) {
    this.migrationVersionTable = migrationVersionTable;
    this.applicationId = applicationId;
    this.masterKey = masterKey;
  }

  getMasterKey() {

  }

  getApplicationId() {

  }

  getAppName() {

  }

  /**
   * fetch the current/latest migration version from this parse app
   *
   * @return Promise resolve(version || undefined), reject(error)
   */
  getCurrentVersion() {
    let request = this._get('/classes/' + this.migrationVersionTable);
    return new Promise(function(resolve, reject) {
      request.query({ order: '-updatedAt' })
        .query({ limit: 1 })
        .end(function(err, res){
          if (res.ok) {
            let results = res['body'].results;
            // check if a version is available -> else set version to undefined
            let version = results.length > 0 ? results[0] : undefined;
            resolve(version);
          } else {
            reject(new Error('API Request failed: ' + res.body.error));
          }
        });
    });
  }

  /**
  * prepares a GET Request through this parse app's backend
  */
  _get(resource) {
    return this._request(Request.get('https://api.parse.com/1/' + resource));
  }

  /**
   *  Preparse the common request headers
   *
   * @param request the request to prepare
   *
   * @return prepared request
   */
  _request(request) {
    return request
      .set('X-Parse-Application-Id', this.applicationId)
      .set('X-Parse-Master-Key', this.masterKey)
      .set('Accept', 'application/json');
  }
}
