class UserApiResponse {
  constructor(body) {
    this._body = body;
    this.name = 'n/a';
    this.phone = 'n/a';

    this._parseBody();
  }

  _parseBody() {
    if (this._body && this._body.results && Array.isArray(this._body.results) && this._body.results.length > 0) {
      const firstResult = this._body.results[0];

      if (firstResult) {
        if (firstResult.phone) {
          this.phone = firstResult.phone;
        }

        if (firstResult.name) {
          const fname = firstResult.name.first ? firstResult.name.first : 'undefined';
          const lname = firstResult.name.last ? firstResult.name.last : 'undefined';

          this.name = `${lname}, ${fname}`;
        }
      }
    }
  }
}

module.exports = UserApiResponse;