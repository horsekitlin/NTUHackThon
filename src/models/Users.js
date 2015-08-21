import Collection from "../lib/MongoBase";
import Schema from "mongoose";

class UsersClass extends Collection{

    constructor(name, schema){

        super(name, schema);

    }

}

let Users = new UsersClass("user", {

    created_time : {
        type : Number
    },

    hash : {

        type : String

    },

    ios_token : {

        type : String,
        default : ""

    }

});

export default Users;

