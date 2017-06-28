/* eslint no-var: "off" */

window.onload = function() {
/**
 * An array describing the possible outcomes of each choice
 * Each line represents a user choice (in display order)
 * Each column represents a computer choice (in the same order)
 * The strings inside the array represents the outcome of each combination
 * Example odds[0][2] means the user picked 'rock' and
 * the computer picked 'paper' (computer wins, obviously !).
 */
  var odds = [
    // user choice is 'rock'
    ['draw', 'computer', 'user'],
    // user choice is 'paper'
    ['user', 'draw', 'computer'],
    // user choice is 'scissor'
    ['computer', 'user', 'draw'],
  ];

/**
 * Object to keep track of the game score
 */
  var score = {
    'computer': 0,
    'user': 0,
    'draws': 0,
    'games': 0,
  };
/**
 * Function that returns the list of a player choice html element
 * @return {HTMLCollection} - a collection of the chosen div 'li' elements
 * @param {string} player - the id of the parent element: 'computer' or 'user'.
 */
  var getChoices = function(player) {
    return document.getElementById(player)
                   .getElementsByTagName('li');
  };
/**
 * Function to remove the 'selected' CSS class from list elements
 * @return {undefined}
 * @param {HTMLCollection} choices - the collection of list elements
 */
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
/**
 * Function to add the 'selected' CSS class to a list element
 * @return {undefined}
 * @param {string} id - the id of the selected li element - ex. 'c2', 'u1'
 * First character of the id is the player initial, the second is the choice
 * index number (c = computer, u = user / 1 = rock, 2 = paper, 3 = scissor).
 */
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
/**
 * Function to update and display the score after each games
 * Updates the score object and score HTML elements
 * Makes the winner parent element bigger and shrinks the loser one
 * (but will prevent loser to fall under 20% of page height)
 * @return {undefined}
 * @param {string} winner - 'computer' or 'user'
 * @param {string} loser - 'user' or 'computer'
 * @param {boolean} draw - true if game is a draw (the 1st part is the skipped)
 */
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
/**
 * Function to find out who wins and who lose unless game is a draw.
 * Calls updateScore and showOff or shake functions accordingly.
 * @param {string} result - The string selected from the odds array depending
 * on user and computer choice.
 */
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

/**
 * A function to make add the 'draw' CSS class to the selected list elements
 * and make them shake (with CSS animation).
 * Then removes the 'draw' class after .5 seconds.
 */
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
  /**
   * A function to make add the 'winner' and 'loser' CSS classes
   * to the selected list elements and make them grow or shrinks
   * accordingly (with CSS animation).
   * Then removes the 'winner' and 'loser' classes after .5 seconds.
   * @param {string} winner - 'computer' or 'user'
   * @param {string} loser - 'user' or 'computer'
   */
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
/**
 * Function to extract the user choice index number from the selected element id
 * Add the 'selected' CSS class to the chosen list element.
 * @param {string} id - the selected element id
 * @return {number} - the index of the user choice in the odds array
 */
  var getUserChoice = function(id) {
    selectElement(id);
    return id.substr(1);
  };
/**
 * A function to make the computer choose an option randomly
 * Add the 'selected' CSS class to the chosen list element.
 * @return {string} - The id of the chosen option list element
 */
  var getComputerChoice = function() {
    var choice = parseInt(Math.random() * 2.9);
    selectElement('c' + choice);
    return choice;
  };
/**
 * Function to toggle the onclick and ontouchstart event callback
 * from the choice list elements.
 * @param {function} f - the play function
 */
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
/**
 * Function that is called when the user clicks or touches a list element,
 * launching a new game:
 * Gets the choice id;
 * remove the onclick callback during the game
 * remove all 'selected' CSS classes
 * add a timeout (the computer thinks a bit before picking...)
 * get the computer choice
 * get the result of the game
 * display the game result and updates the score
 * reset all 'selected' CSS classes
 * reattach the play function to the onclick and ontouchstart events
 */
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
