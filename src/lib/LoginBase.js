/**
 * Login Manager
 *
 * **/
import jwt from "jwt-simple";
import moment from "moment";
import Users from "../models/Users";
import { getError } from '../lib/util';
import _ from "lodash";

class LoginBase{

    constructor(secrcykey="fjsdfhksahfkshfjdskfwehodfhdasi"){

        this._secrcykey = secrcykey;

    }

    getFreshToken(json){

        json.expire = moment().unix();

        return jwt.encode(json, this._secrcykey);

    }

    checkPermision(req, res, next){
        var token = req.headers.token,
            now = moment().unix(),
            user, err;

        console.log(token);
        if(_.isEmpty(token)
                || _.isUndefined(token)){
            req.error = getError("Token 不可為空", 520);
            next();
        }else{

            try{

                let query = jwt.decode(token, LoginManager._secrcykey);

            }catch(err){

                req.error = err.toString();
                next();

            }

            let userrs = Users.showById(query._id);
            userrs.then(function(user){
                req._login_required = user;
                next();
            });
        }

    }
}

const LoginManager = new LoginBase();

export default LoginManager;

