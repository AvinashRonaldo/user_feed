
//A compare function to check roles
//returns true if curRole is superior
//to newRole
const compareRoles = (curRole,newRole)=> {
    const val = {
        "Super Admin" : 3,
        Admin : 2,
        User : 1
    }
    console.log(val[curRole]);
    console.log(val[newRole]);
    if(val[curRole]>val[newRole]){
        return true;
    }
    return false;
}

module.exports = compareRoles;