// Execute on document load
var init = function() {

  var odds = [
    // user choice is 'pierre'
    [
      'draw',
      'computer',
      'user'
    ],
    // user choice is 'feuille'
    [
      'user',
      'draw',
      'computer'
    ],
    // user choice is 'ciseaux'
    [
      'computer',
      'user',
      'draw'
    ]
  ];

  var score = {
    'computer': 0,
    'user': 0,
    'draws': 0,
    'games': 0
  };


  // helper functions

  var getChoices = function(player) {
    return document.getElementById(player).getElementsByTagName('li');
  };

  var resetSelection = function(choices) {
    var classes, i = 0;
    while (i < choices.length) {
      classes = choices[i].getAttribute('class');

      classes = classes.indexOf('selected') === -1 ? classes : classes.replace('selected', '');

      choices[i].setAttribute('class', classes);
      i++;
    }
  }

  var selectElement = function(id) {
    var choices = id[0] === 'c' ? getChoices('computer') : getChoices('user')

    var element = choices[id[1]];

    var classes = element.getAttribute('class');

    resetSelection(choices);

    classes = classes.indexOf('selected') === -1 ? classes + ' selected' : classes;

    element.setAttribute('class', classes);
  };

  var updateScore = function(winner, loser, draw) {
    if(!draw) {
      var winH = document.getElementById(winner).clientHeight,
        loseH = document.getElementById(loser).clientHeight,
        totH = winH + loseH,
        twoPercent = parseInt(totH * 0.02);

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
    document.getElementById(winner + 'Score').innerHTML = score[winner] + '<small>/' + score.games + '</small>';
    document.getElementById(loser + 'Score').innerHTML = score[loser] + '<small>/' + score.games + '</small>';

  }

  var updateStatus = function(result) {
    switch (result) {
      case "computer":
        updateScore('computer', 'user', false);
        showOff('computer', 'user');
        break;
      case "user":
        updateScore('user', 'computer', false);
        showOff('user', 'computer');
        break;
      case "draw":
        score.draws++;
        updateScore('user', 'computer', true);
        break;
    }
  };

  var showOff(winner, loser) {
    document.getElementById(winner)
            .getElementsByClassName('selected')
            .style.animation = 'win .5s ease-in-out';

    document.getElementById(loser)
            .getElementsByClassName('selected')
            .style.animation = 'lose .5s ease-in-out';

    setTimeout(function() {
      document.getElementById(winner)
              .getElementsByClassName('selected')
              .style.animation = '';

      document.getElementById(loser)
              .getElementsByClassName('selected')
              .style.animation = '';
    }, 500);
  }

  // game functions

  // getUserChoice function
  var getUserChoice = function(id) {
    selectElement(id);
    return id.substr(1);
  }

  // getComputerChoice function
  var getComputerChoice = function() {
    var choice = parseInt(Math.random() * 2.9);
    selectElement('c' + choice);
    return choice;
  }

  // update Status

  userChoices = getChoices('user');
  computerChoices = getChoices('computer');

  var activate = function(f) {
    for (c in userChoices) {
      userChoices[c].onclick = f;
    }
  };

  var play = function() {
    var id = this.getAttribute('id'),
      result;
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
        }, 1000);
      },
      1000
    );
  };

  activate(play);

};
