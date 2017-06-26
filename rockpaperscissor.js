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

  var vSwitch = function(sw) {
    var classes = document.getElementById('status').getAttribute('class');

    classes = sw === 1 ? 'visible' : classes.replace(' visible', '');

    document.getElementById('status').setAttribute('class', classes);
    console.log('c', document.getElementById('status').getAttribute('class'));
  };

  var updateScore = function(winner, loser) {
    var winH = document.getElementById(winner).clientHeight,
      loseH = document.getElementById(loser).clientHeight,
      totH = winH + loseH,
      twoPercent = parseInt(totH * 0.02);

    score[winner]++;

    document.getElementById(winner + 'Score').innerText = score[winner];

    if ((winH > totH / 5) && (loseH > totH / 5)) {
      winH += twoPercent;
      loseH -= twoPercent;

      winH = winH / totH * 100 + 'vh';
      loseH = loseH / totH * 100 + 'vh';

      document.getElementById(winner).style.height = winH;
      document.getElementById(loser).style.height = loseH;
    }

  }

  var updateStatus = function(result) {
    vSwitch(0);
    switch (result) {
      case "waiting":
        vSwitch(1);
        document.getElementById('status').innerHTML = '';
        document.getElementById('status').style.backgroundImage = 'url("https://s3.postimg.org/5bdmnf82b/dots.gif")';
        score.games++;
        document.getElementById('games').innerText = score.games;
        vSwitch(0);
        break;
      case "computer":
        document.getElementById('status').innerText = 'l\'ordinateur gagne !';
        document.getElementById('status').style.backgroundImage = 'none';
        updateScore('computer', 'user');
        break;
      case "user":
        document.getElementById('status').innerText = 'vous gagnez !';
        document.getElementById('status').style.backgroundImage = 'none';
        updateScore('user', 'computer');
        break;
      case "draw":
        document.getElementById('status').innerText = 'personne ne gagne...';
        document.getElementById('status').style.backgroundImage = 'none';
        score.draws++;
        break;
    }
    vSwitch(1);
  };

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
    updateStatus('waiting');
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
