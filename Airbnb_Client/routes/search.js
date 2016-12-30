
var express = require('express');
var fecha = require('fecha');
var ejs = require("ejs");
var geocoder = require('geocoder');
var mq_client = require("../rpc/client.js");
/*var log = require("./log");*/
/*
 var mongo = require("./mongo");
 var config = require('./config.js');
 */


exports.loadSearchPg = function (req, res) {
    var sess = req.session;
    var lat;
    var long;
    var location = req.param("location");
    var viewport;
    geocoder.geocode(location,function(err,data){
        lat = data.results[0].geometry.location.lat;
        long = data.results[0].geometry.location.lng;
        viewport = JSON.stringify(data.results[0].geometry.viewport);
        var user_data ={
            "email" : sess.email,
            "isLoggedIn" : sess.isLoggedIn,
            "firstname" : sess.firstName,
            "lat":lat,
            "long":long,
            "viewport":viewport,
            "location":location,
            "userSSN": sess.userId,
            "lastName": sess.lastName,
            "userId": sess.userId,
            "isHost": sess.isHost,
            "profileImage":sess.profileImage
        };
        res.render('searchPage',user_data);
        // ejs.renderFile('../views/searchPage.ejs', user_data,function (err,result) {
        //     if(err){
        //
        //     } else {
        //
        //     }
        //     res.end(result);
        // });
    });
};

exports.search = function (req, res, next) {
    var location = req.param("location");
    var property_type = req.param("room_type");
    var checkin = req.param("checkin");
    var checkout = req.param("checkout");
    var guests = req.param("guests");

    var msg_payload = {
        location: location,
        property_type: property_type,
        checkin: checkin,
        checkout: checkout,
        guests: guests
    };


    mq_client.make_request('search_queue', msg_payload, function (err, result) {
        if (err) {
            console.log(err);
            var json_responses = {"statusCode": 401};
            res.send(json_responses);
        } else {
            // console.log(result);
            // var json_responses = {"statusCode": 200, "data": result};
            res.send(result);
            res.end();

        }
    });
};
