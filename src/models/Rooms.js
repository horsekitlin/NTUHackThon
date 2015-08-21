import Collection from "../lib/MongoBase";
import {Schema} from "mongoose";

class RoomsClass extends Collection{

    constructor(name, schema){

        super(name, schema);

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

