/* eslint no-var: "off" */
window.onload = function() {
  var odds = [
    // user choice is 'pierre'
    ['draw', 'computer', 'user'],
    // user choice is 'feuille'
    ['user', 'draw', 'computer'],
    // user choice is 'ciseaux'
    ['computer', 'user', 'draw'],
  ];

  var score = {
    'computer': 0,
    'user': 0,
    'draws': 0,
    'games': 0,
  };


  // helper functions

  var getChoices = function(player) {
    return document.getElementById(player)
                   .getElementsByTagName('li');
  };

  var resetSelection = function(choices) {
    var classes;
    var i = 0;
    while (i < choices.length) {
      classes = choices[i].getAttribute('class');

      classes = classes.indexOf('selected') === -1
                ? classes
                : classes.replace(' selected', '');

      choices[i].setAttribute('class', classes);
      i++;
    }
  };

  var selectElement = function(id) {
    var choices = id[0] === 'c'
                  ? getChoices('computer')
                  : getChoices('user');

    var element = choices[id[1]];

    var classes = element.getAttribute('class');

    resetSelection(choices);

    classes = classes.indexOf('selected') === -1
              ? classes + ' selected'
              : classes;

    element.setAttribute('class', classes);
  };

  var updateScore = function(winner, loser, draw) {
    if (!draw) {
      var winH = document.getElementById(winner).clientHeight;
      var loseH = document.getElementById(loser).clientHeight;
      var totH = winH + loseH;
      var twoPercent = parseInt(totH * 0.02);

      score[winner]++;

      if ((winH > totH / 5) && (loseH > totH / 5)) {
        winH += twoPercent;
        loseH -= twoPercent;

        winH = winH / totH * 100 + 'vh';
        loseH = loseH / totH * 100 + 'vh';

        document.getElementById(winner).style.height = winH;
        document.getElementById(loser).style.height = loseH;
      }
    }

    score.games++;

    document
        .getElementById(winner + 'Score')
        .innerHTML = score[winner]
                     + '<small>/'
                     + score.games
                     + '</small>';
    document
        .getElementById(loser + 'Score')
        .innerHTML = score[loser]
                     + '<small>/'
                     + score.games
                     + '</small>';
  };

  var updateStatus = function(result) {
    switch (result) {
      case 'computer':
        updateScore('computer', 'user', false);
        showOff('computer', 'user');
        break;
      case 'user':
        updateScore('user', 'computer', false);
        showOff('user', 'computer');
        break;
      case 'draw':
        score.draws++;
        updateScore('user', 'computer', true);
        shake();
        break;
    }
  };

  var shake = function() {
    document
        .getElementById('computer')
        .getElementsByClassName('selected')[0]
        .setAttribute('class', 'choice selected draw');

    document
        .getElementById('user')
        .getElementsByClassName('selected')[0]
        .setAttribute('class', 'choice selected draw');

    setTimeout(function() {
      document
          .getElementById('computer')
          .getElementsByClassName('selected')[0]
          .setAttribute('class', 'choice selected');

      document
          .getElementById('user')
          .getElementsByClassName('selected')[0]
          .setAttribute('class', 'choice selected');
    }, 500);
  };

  var showOff = function(winner, loser) {
    document
        .getElementById(winner)
        .getElementsByClassName('selected')[0]
        .setAttribute('class', 'choice selected winner');

    document
        .getElementById(loser)
        .getElementsByClassName('selected')[0]
        .setAttribute('class', 'choice selected loser');

    setTimeout(function() {
      document
          .getElementById(winner)
          .getElementsByClassName('selected')[0]
          .setAttribute('class', 'choice selected');

      document
          .getElementById(loser)
          .getElementsByClassName('selected')[0]
          .setAttribute('class', 'choice selected');
    }, 500);
  };

  // game functions

  // getUserChoice function
  var getUserChoice = function(id) {
    selectElement(id);
    return id.substr(1);
  };

  // getComputerChoice function
  var getComputerChoice = function() {
    var choice = parseInt(Math.random() * 2.9);
    selectElement('c' + choice);
    return choice;
  };

  var activate = function(f) {
    var userChoices = getChoices('user');
    var c = 0;
    for ( c in userChoices ) {
      if ( {}.hasOwnProperty.call(userChoices, c) ) {
        userChoices[c].onclick = f;
        userChoices[c].ontouchstart = f;
      }
    }
  };

  var play = function() {
    var id = this.getAttribute('id');
    var userChoice;
    var computerChoice;
    var result;
    activate('');
    resetSelection(getChoices('computer'));
    userChoice = getUserChoice(id);
    setTimeout(
      function() {
        computerChoice = getComputerChoice();
        result = odds[userChoice][computerChoice];
        updateStatus(result);
        setTimeout(function() {
          resetSelection(getChoices('computer'));
          resetSelection(getChoices('user'));
          activate(play);
        }, 750);
      },
      1000
    );
  };
  activate(play);
};
