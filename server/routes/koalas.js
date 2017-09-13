var router = require('express').Router();
var pool = require('./pool');

router.get('/', function(req, res) {
    console.log('in get koalas route');
    pool.connect(function(connectionError, client, done) { //when the connection completes, the pg package is going to call this, and it is going to pass back the local variables for us
        //connectionError is if an error occurs, connect to the db
        //client is our worker to run our query
        //done is a function we will call to release the client
        if(connectionError) {
            console.log("here we are", connectionError);
            res.sendStatus(500); //hey client, something broke
        } else {
            //ask client to run our query
            //parameter 1 - the query itself, 2 is the callback
            client.query('SELECT * FROM koalaholla', function(queryError, resultObject) {
                done();
                //resultOject is the response object from the database via pg, contains more than the result set
                if(queryError) {
                    console.log("or here?", connectionError);
                    res.sendStatus(500);}
                    else{
                        console.log('resultObject -->', resultObject);
                        //resultObject.rows contains the results as a set of object
                        res.send(resultObject.rows)
                    }
                })
                
            }
        });
});

router.post('/', function(req, res) {
   var koala = req.body.newKoala;    
   console.log('in post koalas route', koala);
    pool.connect(function(connectionError, koala, done) {
        if(connectionError) {
            console.log(connectionError);
            res.sendStatus(500); //hey cleint, something broke
        } else {
            //ask client to run our query
            //parameter 1 - the query itself, 2 is the callback

            //parameterized queries require the $ per column item
            var queryString = 'INSERT INTO koalaholla (name, age, gender, ready_to_transfer, notes) VALUES ($1, $2, $3, $4, $5);';
            var values = [koala];
            client.query(queryString, values, function(queryError, resultObject) {
                //queries string, values to insert into the query string, callback function 
                done(); 
                //resultOject is the response object from the database via pg, contains more than the result set
                if(queryError) {
                    console.log(connectionError);
                    res.sendStatus(500);}
                    else{
                        console.log('resultObject -->', resultObject);
                        //resultObject.rows contains the results as a set of object
                        res.sendStatus(201);
                    }
                })
            }
        });
});

module.exports = router;