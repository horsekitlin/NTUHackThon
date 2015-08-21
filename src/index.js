import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './db';
import { toRes } from "./lib/util";
import middleware from './middleware';
import { users } from "./api";
import multipartMiddleware from 'connect-multiparty';

var app = express();
app.server = http.createServer(app);

// 3rd party middleware
app.use(cors({
	exposedHeaders: ['Link']
}));

app.use(bodyParser.json({
	limit : '100kb'
}));

// connect to db
db( λ => {

	// internal middleware
	app.use(middleware());
	app.use(multipartMiddleware());

	// api router
	//app.use('/api', api());

    app.use("/users", users, toRes);
	app.server.listen(process.env.PORT || 8080);

	console.log(`Started on port ${app.server.address().port}`);
});

export default app;
