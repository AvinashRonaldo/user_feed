const accesscontrol = require('accesscontrol');
const {roles} = require('../helpers/role');

function checkAccess(action,resource){
    return async (req, res, next) => {
    try {
        const permission = roles.can(req.user.role)[action](resource);
        if (!permission.granted) {
            return res.status(401).json({
                error: "You don't have enough permission to perform this action"
        });
    }
    next();
    } catch (err) {
        console.log(err);
        return res.status(400).json({error:err})
    }
}
}
module.exports = checkAccess;