const bodyParser = require('body-parser');
const express = require('express')
const { v4: uuidv4 } = require('uuid');
const app = express()
const port = 3000

//HTTP Basic
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const bcrypt = require('bcryptjs'); // MODULE NOT FOUND.. ffs. // nevermind. Works now.

app.use(bodyParser.json());

let items = [
    {
        id: "a05a7af7-9017-4ead-8cd6-96b085463586", // test Item id
        userId: "15c31ab9-7ee7-41c4-be7c-df40e9e3f95d", // test User id
        title: "item id test",
        description: "Hyvin palvellut kamera. Shutter count 99 000",
        category: "Valokuvaus",
        location: {
            street: "koskitie 3",
            county: "Lappi",
            postalCode: "95500",
            city: "Tornio"
        },
        price: 50,
        date: "10.10.2020",
        deliveryType: "Nouto"
    },
    {
        id: "df40e9e3f95d-15c31ab9-7ee7-41c4-be7c", //Only pre-existing items have premade ids, for sake of testing
        userId: "41c4-be7c-df40e9e3f95d-15c31ab9-7ee7", //someone elses item
        title: "Canon Eos 500D",
        description: "Hyvin palvellut kamera. Shutter count 99 000",
        category: "Valokuvaus",
        location: {
            street: "koskitie 3",
            county: "Lappi",
            postalCode: "95500",
            city: "Tornio"
        },
        price: 50,
        date: "10.10.2020",
        deliveryType: "Nouto"
    }
]

let users = [
    {
        id: uuidv4(),
        username: "userIdTesti",
        name: "Teemu Testaaja",
        phone: "040 1111111",
        email: "testimies@gmail.com",
        birthdate: '2020-16-09',
        password: 'password1',
        street: "urhonkuja 2",
        county: "Lappi",
        postalcode: 95500,
        city: "Tornio"
    },
    {   // Testikäyttäjä mocha testaukseen: Username = testi, Password = testi.
        id: "15c31ab9-7ee7-41c4-be7c-df40e9e3f95d",
        username: "testi",
        name: "XXXX XXXXXX",
        phone: "040 0000000",
        email: "testi@testi.com",
        birthdate: '2020-01-01',
        password: '$2a$06$Rk84zubU9kiaCGmf5Qs2jO7XL6E0sOl6K/sxTjm.Zy5D5q.Bqko9e', 
        street: "Katu",
        county: "Lääni",
        postalcode: 90000,
        city: "Kaupunki"
    },
    {
        id: uuidv4(),
        username: "Kappo",
        name: "Urho Kekkonen",
        phone: "040 1234567",
        email: "kekkonen@gmail.com",
        birthdate: '2020-16-09',
        password: 'password2',
        street: "urhonkuja 2",
        county: "Lappi",
        postalcode: 95500,
        city: "Tornio"
    }
]

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/items/', (req, res) => {
    res.json(items);
})

app.get('/items/:id', (req, res) => {

    const result = items.find(t => t.id == req.params.id);

    if(result !== undefined)
    {
        res.json(result);
    }
    else
    {
        res.sendStatus(404);
    }
})

app.get('/search?', (req, res) => {
    //SEARCH
    // http://localhost:3000/search?category=Valokuvaus
    // http://localhost:3000/search?date=10.10.2020
    // http://localhost:3000/search?location.city=Tornio

    const resultCategory = items.find(t => t.category == req.query.category);
    const resultDate = items.find(t => t.date == req.query.date);
    const resultCity = items.find(t => t.city == req.query.city);

    var resultArray = [];
    
    if(resultCategory !== undefined)
    {
        for (i in items) {
            if(items[i].category == req.query.category){
                resultArray.push(items[i]);
            }
        } 
        res.json(resultArray);  
    }
    
    else if(resultDate !== undefined)
    {
        for (i in items) {
            if(items[i].date == req.query.date){
                resultArray.push(items[i]);
            }
        } 
        res.json(resultArray);  
    }   
    else if(resultCity !== undefined)
    {
        for (i in items) {
            if(items[i].city == req.query.city){
                resultArray.push(items[i]);
            }
        } 
        res.json(resultArray);  
    }
    else
    {
        res.sendStatus(404);
    }
})

app.get('/users/', (req, res) => {
    res.json(users);
})

app.get('/users/:id', (req, res) => {

    const result = users.find(t => t.id === req.params.id);

    if(result !== undefined)
    {
        res.json(result);
    }
    else
    {
        res.sendStatus(404);
    }
})

//----------------------------------------//
passport.use(new BasicStrategy(
    function(username, password, done) {
  
      //const user = users.getUserByName(username);
      const user = users.find(t => t.username === username);
      if(user == undefined) {
        // Username not found
        console.log("HTTP Basic username not found");
        return done(null, false, { message: "HTTP Basic username not found" });
      }
  
      /* Verify password match */
      if(bcrypt.compareSync(password, user.password) == false) {
      //if(password !== user.password){
        // Password does not match
        console.log("HTTP Basic password not matching username");
        return done(null, false, { message: "HTTP Basic password not found" });
      }
      return done(null, user);
    }
  ));

    app.post('/items/', 
        passport.authenticate('basic', { session: false }),
        (req, res) => {
            
            if('title' in req.body == false ) {
                res.status(400);
                res.json({status: "Missing title from body"})
                return;
                }
            if('description' in req.body == false ) {
                res.status(400);
                res.json({status: "Missing description from body"})
                return;
                }
            if('category' in req.body == false ) {
                res.status(400);
                res.json({status: "Missing category from body"})
                return;
                }
            if('price' in req.body == false ) {
                res.status(400);
                res.json({status: "Missing price from body"})
                return;
                }

            const newItem = {
                id: uuidv4(),
                userId: req.user.id,
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                location: req.body.location,
                price: req.body.price,
                date: req.body.date,
                deliveryType: req.body.deliveryType
            }

        items.push(newItem);

        //console.log(req.body);
        //console.log(req.user.id);
        res.sendStatus(200);
        
        // JOS PAKOLLISIA TIETOJA PUUTTUU res.sendStatus(400); ---------------------------------------
    })

    app.put('/items/:id', 
        passport.authenticate('basic', { session: false }),
        (req, res) => {

        const result = items.find(t => t.id == req.params.id);
        
        if(result !== undefined)
        {
            if(result.userId !== req.user.id)
            {
                console.log(req.user.id);
                console.log(result.userId);
                res.sendStatus(401); // UNAUTHORIZED
            }

            else
            {
                for (const key in req.body) {
                    result[key] = req.body[key];
                }
                res.sendStatus(200);
            }

        }
        else
        {
            res.sendStatus(404);
        }
    })
    
    app.delete('/items/:id', 
        passport.authenticate('basic', { session: false }),
        (req, res) => {

        const result = items.findIndex(t => t.id == req.params.id);
        const resultForId = items.find(t => t.id == req.params.id);

        if(result !== -1){
            if(resultForId.userId !== req.user.id)
            {
                //console.log(req.user.id);
                //console.log("not matching")
                //console.log(resultForId.userId);
                res.sendStatus(401); // UNAUTHORIZED
            }
            else
            {
                items.splice(result, 1);
                res.sendStatus(200);
            }
        }
        else{
            res.sendStatus(404);
        }
    
    })
      
    app.post('/register/',
          (req, res) => {
  
        const duplicateCheck = users.find(t => t.username === req.body.username);

        if('username' in req.body == false ) {
        res.status(400);
        res.json({status: "Missing username from body"})
        return;
        }
        if(duplicateCheck !== undefined)
        {
            res.status(409);
            res.json({status: "Username taken."})
            return;
        }

        if('password' in req.body == false ) {
        res.status(400);
        res.json({status: "Missing password from body"})
        return;
        }
        if('email' in req.body == false ) {
        res.status(400);
        res.json({status: "Missing email from body"})
        return;
        }
    
        const hashedPassword = bcrypt.hashSync(req.body.password, 6);
        //console.log(hashedPassword);
        //users.addUser(req.body.username, req.body.email, hashedPassword);
        //users.addUser(req.body.username, req.body.email, req.body.password);
    
        const newUser = {
            id: uuidv4(),
            username: req.body.username,
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            birthdate: req.body.birthdate,
            password: hashedPassword,
            street: req.body.street,
            county: req.body.county,
            postalcode: req.body.postalcode,
            city: req.body.city
        }

        users.push(newUser);


        res.status(201).json({ status: "created" });
  });
//----------------------------------------//



let apiInstance = null;
exports.start = () => {
    apiInstance = app.listen(port, () => {
        //console.log(`Server running on port ${port}`)
    })
}

exports.stop = () => {
    apiInstance.close();
}

/*
app.get('/users/search?', (req, res) => {

    const result = users.find(t => t.username === req.query.username);
    var resultArray = [];
    //const result = users.findIndex(t => t.username === req.query.username);
    if(result !== undefined)
    {
        for (i in users) {
            if(users[i].username == req.query.username){
                resultArray.push(users[i]);
            }
        } 
        res.json(resultArray);  
    }
    else
    {
        res.sendStatus(404);
    }
})
*/