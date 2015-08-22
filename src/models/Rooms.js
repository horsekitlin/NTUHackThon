import Collection from "../lib/MongoBase";
import Promise from "bluebird";
import _ from "lodash";
import {Schema} from "mongoose";
import { getError } from '../lib/util';

class RoomsClass extends Collection{

    constructor(name, schema){

        super(name, schema);

    }

    pushGB(id, type){
        return new Promise(function(resolve, reject){

            let result = this.show({"msg._id" : id});

            result.then(function(post){
                if(post === null){

                    reject(getError("文章不存在", 525));

                }else{

                    const index = _.findIndex(post.msg, function(item){

                        return item._id.toString() === id;

                    });

                    post.msg[index].push[type] += 1;

                    post.save(function(err){

                        if(err){

                            reject(getError("修改文章失敗", 526));

                        }else{

                            resolve(post);

                        }
                    });

                }
            },
            function(err){

                reject(err);

            });



        }.bind(this));
    }

}

const SubMessage = new Schema({

    uid : {type : Schema.Types.ObjectId},

    content : {type : String},

    created_time : {type : Number},

    push : {

        good : {

            type : Number,
            default : 0

        }
    },

    loc : {

        lng : {
            type : Number
        },
        lat : {
            type : Number
        }

    }

});

const Message = new Schema({

    uid : {type : Schema.Types.ObjectId},

    content : {type : String},

    created_time : {type : Number},

    msg : [SubMessage],

    push : {

        good : {

            type : Number,
            default : 0

        },
        bad : {

            type : Number,
            default : 0

        }
    },

    loc : {

        lng : {
            type : Number
        },
        lat : {
            type : Number
        }

    }

});

let Rooms = new RoomsClass("room", {

    poster : {

        uid : {type : Schema.Types.ObjectId},

    },

    content : {type : String},

    created_time : {
        type : Number
    },

    msg : [Message],

    loc : {

        lng : {type : Number},
        lat : {type : Number}

    }

});

export default Rooms;

