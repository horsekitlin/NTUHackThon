import _ from 'lodash';
import moment from 'moment';
import Promise from "bluebird";
import LoginManager from '../lib/LoginBase';
import { Router } from 'express';
import { Users, Rooms } from '../models';
import { getError } from '../lib/util';

let router = Router();

router.route("/push/goodorbad/")
    .post(LoginManager.checkPermision, function(req, res, next){
    /**
     * @params post_id留言的Id
     * @params type : good or bad
     *
     * **/

        const uid = req._login_required.id;

        const type = req.body.type;

        let data = {};

        let result = Rooms.pushGB(req.body.post_id, type);

        result.then(function(post){

            data.post = post;
            return Users.pushGB(uid, post._id, type);

        }, function(err){

            req.error = err;
            req.message = "修改文章失敗";
            next();

        }).then(function(user){

            req.result = data.post;
            req.message = "修改成功";
            next();

        });
    });

router.route("/push/submsg/")
    .post(LoginManager.checkPermision, function(req, res, next){
        /**
         * @params _id room.msg[0]._id
         * @params content 留言內容
         * @params loc 經緯度
         *      @params lng : 經度
         *      @params lat : 緯度
         * **/
        var query = _.pick(req.body
                , "content", "loc");

        if(_.isEmpty(req.body._id)
                || _.isEmpty(query.content)){

            req.error = getError("留言內容與房間ID不可為空", 522);
            next();

        }else{

            var result = Rooms
                .show({"msg._id" : req.body._id});

            result.then(function(room){
                if(_.isNull(room)){

                    req.error = getError("房間不存在", 524);
                    next();

                }else{

                    query.created_time = moment().unix();
                    const index = _.findIndex(room.msg, function(item){

                        return item._id.toString === req.body._id;

                    });

                    room.msg[index].msg.push(query);

                    room.save(function(err){

                        if(err){

                            req.error = getError("儲存失敗", 524);
                            next();

                        }else{

                            req.result = room;
                            next();

                        }
                    });
                }
            }, function(err){

                req.error = getError("搜尋失敗", 524);
                next();
            });
        }

    });

router.route("/push/msg/")
    .post(LoginManager.checkPermision, function(req, res, next){

        /**
         * @params _id room._id
         * @params content 留言內容
         * @params loc 經緯度
         *      @params lng : 經度
         *      @params lat : 緯度
         * **/
        var query = _.pick(req.body
                , "loc", "content");

        if(_.isEmpty(req.body._id)
                || _.isEmpty(query.content)){

            req.error = getError("留言內容與房間ID不可為空", 522);
            next();

        }else{

            query.created_time = moment().unix();

            let result = Rooms.showById(req.body._id);

            result.then(function(room){

                if(_.isNull(room)){

                    req.error = getError("房間不存在", 524);
                    next();

                }else{

                    room.msg.push(query);
                    room.save(function(err){

                        if(err){

                            req.error = getError("儲存失敗", 525);
                            next();

                        }else{

                            req.result = room;
                            req.message = "搜尋成功";
                            next();

                        }
                    });

                }

            });
        }
    });

router.route("/created/")
    .post(LoginManager.checkPermision, function(req, res, next){

        /**
         *  @params loc : 經緯度
         *      @params lng : 經度
         *      @params lat : 緯度
         *  @params content : 建立的內容或原因敘述
         *
         * **/
        let query = _.pick(req.body
                , "loc", "content");

        query.created_time = moment().unix();

        query.poster = req._login_required._id;

        let result = Rooms
        .created(query)
        .then(
        function(rooms){

            req.result = rooms;
            req.message = "留言成功";
            next();

        }, function(err){

            req.error = err.toString();
            req.message = "寫入資料庫失敗";
            next();

        });
    });

export default router;
