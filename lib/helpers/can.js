/**
 * Created by amitava on 02/05/16.
 */
module.exports = {
  createProvider: function (user) {
        return user.role === 'PROVIDER' || user.role === 'ADMIN';
  }

};