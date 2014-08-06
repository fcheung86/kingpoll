var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model( 'user' );
var Poll = mongoose.model( 'poll' );
var Vote = mongoose.model( 'vote' );


exports.getOwnAccount = function(req, res) {
  if (req.user) {
    Vote.find({'u_id':req.user._id}, function (err, votes) {

      var longest = 0;
      var shortest = 999999;
      var average = 0;
      var total = 0;
      var votedisplay = new Array();

      if(votes.length > 0) {
        votes.forEach( function (vote){
          total = total + vote.s_vtime;
          if(longest < vote.s_vtime)
            longest = vote.s_vtime;
          if(shortest > vote.s_vtime)
            shortest = vote.s_vtime;
        });

        average = total / votes.length;
      } else {
        shortest = 0;
      }

      votedisplay['longest'] = (longest/1000).toFixed(2);
      votedisplay['shortest'] = (shortest/1000).toFixed(2);
      votedisplay['average'] = (average/1000).toFixed(2);
      votedisplay['total'] = (total/1000).toFixed(2);

      Poll.find({'u_id':req.user._id}, function (err, polls) {
        res.render('account', 
          { title: req.user.u_id + "'s Info", 
            user: req.user, 
            showbuttons: true,
            polls: polls, 
            pollslength: polls.length,
            voteslength: votes.length,
            votedisplay: votedisplay, 
            js_script:'/js/account.js' });
      });
    });
  } else {
    res.render('login', { error: true, title: "Kingpoll Login" });
  }
  
};

exports.getUserAccount = function(req, res) {
  User.findOne({'u_id':req.params.id}, function (err, user) {
    if (err) {
      return console.error(err);
    }
    if(user){
      Vote.find({'u_id':user._id}, function (err, votes) {

      var longest = 0;
      var shortest = 999999;
      var average = 0;
      var total = 0;
      var votedisplay = new Array();
      if(votes.length > 0) {
        console.log(votes);
        votes.forEach( function (vote){
          console.log(vote);
          total = total + vote.s_vtime;
          console.log(total);
          if(longest < vote.s_vtime)
            longest = vote.s_vtime;
          if(shortest > vote.s_vtime)
            shortest = vote.s_vtime;
        });

        average = total / votes.length;
      } else {
        shortest = 0;
      }

      votedisplay['longest'] = (longest/1000).toFixed(2);
      votedisplay['shortest'] = (shortest/1000).toFixed(2);
      votedisplay['average'] = (average/1000).toFixed(2);
      votedisplay['total'] = (total/1000).toFixed(2);

      Poll.find({'u_id':user._id}, function (err, polls) {
        res.render('account', 
          { title: user.u_id + "'s Info", 
            user: user, 
            showbuttons: false,
            createUpl: true,
            polls: polls, 
            pollslength: polls.length,
            voteslength: votes.length,
            votedisplay: votedisplay, 
            js_script:'/js/account.js' });
      });
    });
    } else {
      res.render('account', { title: "This user does not exist!"});
    }     
  });
};
