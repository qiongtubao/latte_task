"use strict";
exports.__esModule = true;
// import * as latte_db from "latte_db"
// let config = require("./config/db.json");
// latte_db.default.redis.bindDB("test", config);
// let c = latte_db.default.redis.createClass({
//     type: "list",
//     key: "test",
//     verify: {
//         type: "object",
//         properties: {
//             type: {
//                 type: "string"
//             },
//             data: {
//                 type: "array"
//             },
//             time: {
//                 type: "date"
//             }
//         }
//     }
// });
var execTask = function (task, callback) {
    console.log('exec', task);
    callback(null, 1);
    // let d = c.create(task)
    // latte_db.default.redis.getConnect((err, connect) => {
    //     if (err) {
    //         return callback(err);
    //     }
    //     c.push(d)(connect, (err) => {
    //         if (err) {
    //             return callback(err);
    //         }
    //         callback(null, "ok");
    //     });
    // });
};
exports.execTask = execTask;
