const AccessControl = require('accesscontrol');
const ac = new AccessControl();

exports.roles = (function() {
    ac.grant("User")
    .readOwn("feed")
    
    ac.grant("Admin")
    .extend("User")
    .readAny('User')
    .deleteAny('User')
    .updateAny('User')
    .createAny('User')
    .deleteOwn('feed')
    .updateOwn('feed')

    ac.grant('Super Admin')
    .extend('Admin')
    .deleteAny('Admin')
    .createAny('Admin')
    .updateAny('Admin')
    .createAny('feed')
    .updateAny('feed')
    .readAny('feed')
    .deleteAny('feed')
})();
