const express = require('express');
const mysql = require('mysql');
const app = express();

//register view engine

app.set('view engine', 'ejs');

app.listen(8000);

app.use(express.static('public'));

app.get('/',(req,res)=>{

    // res.send('<p>Home Page</p>');
    res.render('index', {title: 'home'})
 });
 app.get('/secret',(req,res)=>{
    res.render('secret');
 });
 app.get('/about',(req,res)=>{
 
    // res.send('<p>About Page</p>');
    res.render('about', {title: 'About'});
 
 });
 
 app.get('/contact',(req,res)=>{
 
     //res.send('<p>Contact Page</p>');
     res.render('contact', {title: 'Contact'})
 
 });

global.last = 0;
global.logfile = [];
 app.get('/logfile',(req,res)=>{

    const dbSerever = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'Naveen99@',
        database: 'practice_project'
    })
    
    dbSerever.connect((err)=>{
        if(err){
            console.log(err);
        }
        else {
            console.log("Connected To Data Base");
        }
    });
    
    dbSerever.query('SELECT * FROM rawdata',(err,result)=>{
        if(err){throw err;}
        else{
            //console.log(result);
            for(var i =last;i<result.length;i++)
            {
                if(result[i].temperature > 60 || result[i].CarbonMonoxide > 110 || result[i].smoke_in_ppm > 67)
                {
                    let aValue = 
                    {
                        id: result[i].id,
                        location: result[i].location,
                        temperature: result[i].temperature,
                        CarbonMonoxide: result[i].CarbonMonoxide,
                        smoke_in_ppm: result[i].smoke_in_ppm,
                        _date: result[i]._date,
                    }
                    logfile.push(aValue);
                }
            }
            //last = result.length;
            res.render('logfile',{title: 'Logfile', logfile: logfile})
            console.log('done');
            last = result.length;
        }
    }); 
 });
 
 //404Error
 
 app.use((req,res)=>{
     res.status(404).render('404', {title: '404'});
 });