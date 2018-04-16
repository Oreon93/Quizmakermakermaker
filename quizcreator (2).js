function Quiz(quizname) {
  this.name = quizname;
  this.questions = new Array();
}

Quiz.prototype.addQuestion = function(question, correctAnswer, answers) {
  this.questions[this.questions.length] = new QuizQuestion(question, correctAnswer, answers);
}

function QuizQuestion(question, correctAnswer, answers) {
  this.question = question;
  this.correctAnswer = correctAnswer;
  this.answers = answers;
}



window.onload = function() {
  localStorage.quiz = "";
  localStorage.questionOrder = JSON.stringify([]);

  questionField = document.getElementById("question-field");

  /* Menu items */
  document.getElementById("manage-questions").addEventListener("click", displayQuestionList);
  document.getElementById("add-question").addEventListener("click", displayAddQuestionForm);
  document.getElementById("play-quiz").addEventListener("click", playQuiz);


  document.body.addEventListener("click", function(event) {
    if (event.target && event.target.id == "submit-question") {
      submitButton();
    }

    if (event.target && event.target.id == "submit-add-another") {
      submitAddAnother();
    }

    if (event.target && event.target.id == "add-answer") {
      addAnswer();
    }

    if (event.target && event.target.id == "create-quiz") {
      createQuiz();
    }

    if (event.target && event.target.classList.contains("quiz-answer")) {
      toggleChecked(event.target);
    }
  });



}

/* This function creates the quiz and takes you to the add question page */

function createQuiz() {
  var quizname = document.getElementById("quiz-name-field").value;
  quiz = new Quiz(quizname);
  displayAddQuestionForm();
}


/* This function clears the view whenever a menu button is clicked */
function clearInterface(interface) {
  while (interface.firstChild) {
    interface.removeChild(interface.firstChild);
  }
}

/* This function displays the add question form interface */
function displayAddQuestionForm() {
  /* Show menu */
  document.getElementById("menu").classList.remove("hidden");


  /* Clear interface */
  var theInterface = document.getElementById("interface");
  clearInterface(theInterface);

  /* Focus on correct menu item */
  var menuItems = document.getElementsByClassName("menu-item");
  for (var i = 0; i<menuItems.length; i++) {
    console.log(menuItems[i]);
    if (menuItems[i].parentElement.id == "add-question") {
      menuItems[i].classList.add("menu-item-active");
    }
    else {
      menuItems[i].classList.remove("menu-item-active");
    }
  }



  /* Create the form */
  var form = document.createElement("form");
  form.id = "add-question-form";

  /* Create the question counter */
  var questionCounter = document.createElement("p");
  questionCounter.id = "question-counter";
  questionCounter.classList.add("info-text");

  /* Create the help texts */
  var firstHelpText = document.createElement("p");
  firstHelpText.innerHTML = "1) Write your question:";
  firstHelpText.classList.add("help-text");

  var secondHelpText = document.createElement("p");
  secondHelpText.innerHTML = "2) Write the correct answer:";
  secondHelpText.classList.add("help-text");

  var thirdHelpText = document.createElement("p");
  thirdHelpText.innerHTML = "3) Add some incorrect answers: ";
  thirdHelpText.classList.add("help-text");

  /* Create question textarea */
  var questionField = document.createElement("textarea");
  questionField.id = "question-field";
  questionField.name = "question";
  questionField.tabIndex = 1;

  /* Create the "correct answer" field */
  var correctAnswerField = document.createElement("input");
  correctAnswerField.type = "text";
  correctAnswerField.name = "correct-answer";
  correctAnswerField.tabIndex = 2;

  /* Create the "wrong answer" field */
  var wrongAnswerField = document.createElement("input");
  wrongAnswerField.type = "text";
  wrongAnswerField.name = "answer1";
  wrongAnswerField.tabIndex = 3;

  /* Create the "add answer" button */
  var addAnswerButton = document.createElement("button");
  addAnswerButton.type = "button";
  addAnswerButton.classList.add("btn", "btn-primary");
  addAnswerButton.id = "add-answer";
  addAnswerButton.innerHTML = "+ Add another answer";

  /* Add the "Submit" button */
  var submitButton = document.createElement("button");
  submitButton.type = "button";
  submitButton.classList.add("btn", "btn-lg", "btn-success", "submit");
  submitButton.id = "submit-question";
  submitButton.innerHTML = "Submit";

  /* Add the "Submit and add another" button */
  var submitAddAnotherButton = document.createElement("button");
  submitAddAnotherButton.type = "button";
  submitAddAnotherButton.classList.add("btn", "btn-lg", "btn-secondary", "submit");
  submitAddAnotherButton.id = "submit-add-another";
  submitAddAnotherButton.innerHTML = "Submit and add another";

  /* Add the success message placeholder */
  var successMessage = document.createElement("p");
  successMessage.classList.add("submit", "info-text");
  successMessage.id = "submit-success";

  /* Append everything */
  form.appendChild(questionCounter);
  form.appendChild(firstHelpText);
  form.appendChild(questionField);
  form.appendChild(secondHelpText);
  form.appendChild(correctAnswerField);
  thirdHelpText.appendChild(addAnswerButton);
  form.appendChild(thirdHelpText);
  form.appendChild(wrongAnswerField);
  form.appendChild(submitButton);
  form.appendChild(submitAddAnotherButton);
  form.appendChild(successMessage);
  theInterface.appendChild(form);

  displayQuestionCounter();
}



/* This section handles various events on the Quiz creator form.
- The first event is the user adding another possible answer via a button. */
function addAnswer() {
  var answerForm = document.getElementById("add-question-form");
  var AnswerLength = document.getElementsByTagName("input").length;
  var newAnswerRow = document.createElement("div");
  var newAnswer = document.createElement("input");
  var deleteButton = document.createElement("button");
  newAnswerRow.className = "new-answer-row";
  newAnswerRow.id = "row" + AnswerLength;

  deleteButton.className = "delete";
  deleteButton.type = "button";
  deleteButton.innerHTML = "X";
  deleteButton.name = "delete";
  deleteButton.value = AnswerLength;
  newAnswer.name = "answer" + AnswerLength;
  newAnswer.type = "text";
  newAnswer.tabIndex = AnswerLength + 2;
  newAnswerRow.append(newAnswer);
  newAnswerRow.append(deleteButton);
  answerForm.insertBefore(newAnswerRow, document.getElementById("submit-question"));
  newAnswer.focus();

  newAnswerRow.addEventListener("mouseover", function() {this.querySelector(".delete").classList.add("show");})
  newAnswerRow.addEventListener("mouseout", function() {this.querySelector(".delete").classList.remove("show");})
  deleteButton.addEventListener("click", deleteAnswer);
}

/* The second event is the user deleting a possible answer. Note that a user cannot have fewer than two possible answers - it's multiple choice! */
function deleteAnswer() {
  var answerForm = document.getElementById("add-question-form");
  var rownumber = this.value;
  var row = document.getElementById("row"+rownumber);
  answerForm.removeChild(row);
}
/* The third event is the user submitting a question. When this happens we need to parse the information in the form, which could contain any number of answers. */

function submitAddAnother() {
  var questionField = document.getElementById("question-field");
  var answers = document.getElementsByTagName("input");
  submitQuestion(questionField, answers);
  displayQuestionCounter();
  addAnother(questionField, answers);
}

function submitButton() {
  var questionField = document.getElementById("question-field");
  var answers = document.getElementsByTagName("input");
  submitQuestion(questionField, answers);
  displayQuestionList();
}

/*
The steps are:
-- Validation
--- Is the question field filled in?
--- Is exactly one radio button checked to identify the correct answer?  - N/A
--- Do all answers have answer text?

/*
-- Parse
--- Create temporary array for the answers. Parse their text and values.
--- Create a new QuizQuestion with the following parameters: "question" = the form's question field value; "correctAnswer" = the value of the checked box; "answers" = the temporary array.
*/
function submitQuestion(questionField, answers) {
  var questiontext = questionField.value;
  var answersNumber = answers.length;
  var correctAnswerValue = Math.floor(Math.random()*answersNumber);
  var answersArray = [];
  for (i=1; i<answers.length; i++) {
    answersArray.push(answers[i].value);
  }
  answersArray.splice(correctAnswerValue, 0, answers[0].value);
  quiz.addQuestion(questiontext, correctAnswerValue, answersArray);
  localStorage.quiz = JSON.stringify(quiz);

  /* Update the question order */
  var questionOrderArray = JSON.parse(localStorage.questionOrder);
  var questionOrderItem = [questionOrderArray.length + 1, questiontext];
  console.log(questionOrderArray);
  questionOrderArray.push(questionOrderItem);
  localStorage.questionOrder = JSON.stringify(questionOrderArray);
  console.log(localStorage.quiz);
  console.log(localStorage.questionOrder);
}




/* -- Clear */
function addAnother(questionField, answers) {
  var answerForm = document.getElementById("add-question-form");
  var questionField = document.getElementById("question-field");
  submitSuccess();
  /* --- Clear all form fields */
  for (var answer of answers) {
    answer.value = "";
  }
  var extraAnswers = document.getElementsByClassName("new-answer-row");
  for (var answer = extraAnswers.length - 1; answer >= 0; answer--) {
    answerForm.removeChild(extraAnswers[answer]);
  }
  questionField.value = "";
}

/*
--- Optionally add a brief "Question submitted!" message
*/
function submitSuccess() {
  var successMessage = document.getElementById("submit-success");
  successMessage.innerHTML = "Question submitted!";
  successMessage.classList.add("hide");
  setTimeout(function() {clearElement(successMessage)}, 2500);
}

function clearElement(element) {
  element.innerHTML = "";
  element.classList.remove("hide");
}

/*
--- Optionally update the total number of questions in the quiz at the top of the page
*/
function displayQuestionCounter() {
  var counter = document.getElementById("question-counter");
  if (quiz.questions.length == 1) {
    counter.innerHTML = "This quiz has " + quiz.questions.length + " question.";
  }
  else {
  counter.innerHTML = "This quiz has " + quiz.questions.length + " questions.";
  }
}



/* This section handles the Question List view */

function displayQuestionList() {
  /* Show menu */
  document.getElementById("menu").classList.remove("hidden");

  /* Clear interface */
  var theInterface = document.getElementById("interface");
  clearInterface(theInterface);
  var menuItems = document.getElementsByClassName("menu-item");
  for (var i = 0; i<menuItems.length; i++) {
    console.log(menuItems[i]);
    if (menuItems[i].parentElement.id == "manage-questions") {
      menuItems[i].classList.add("menu-item-active");
    }
    else {
      menuItems[i].classList.remove("menu-item-active");
    }
  }

  if (localStorage.questionOrder) {
  var questionOrder = JSON.parse(localStorage.questionOrder);
  var list = document.createElement("ul");
  list.classList.add("question-list");
  for (i=0; i<questionOrder.length; i++) {

    var row = document.createElement("li");
    var questionNumber = document.createElement("p");
    questionNumber.classList.add("question-number");
    questionNumber.innerHTML = parseInt(i) + 1;
    var questionText = document.createElement("p");
    questionText.setAttribute('draggable', true);
    questionText.classList.add('question-text');
    questionText.innerHTML = questionOrder[i][1];
    row.appendChild(questionNumber);
    row.appendChild(questionText);
    list.appendChild(row);
    theInterface.appendChild(list);

    /* Make it sortable */
    $(".question-list").sortable({update: function( event, ui ) {renumberList()}});
  }
  }
}

function renumberList() {
  var list = document.getElementsByClassName("question-number");
  var questionOrderArray = [];
  for (i=0; i<list.length; i++) {
    list[i].innerHTML = i + 1;
    questionOrderArray[i] = [i+1, list[i].nextSibling.innerHTML];
  }
  localStorage.questionOrder = JSON.stringify(questionOrderArray);
  console.log(localStorage.questionOrder);
}

/* This section handles the actual quiz */

function playQuiz() {
  if (localStorage.quiz) {
  /* Hide menu */
  document.getElementById("menu").classList.add("hidden");

  /* Clear interface */
  var theInterface = document.getElementById("interface");
  clearInterface(theInterface);
  var menuItems = document.getElementsByClassName("menu-item");
  for (var i = 0; i<menuItems.length; i++) {
      menuItems[i].classList.remove("menu-item-active");
    }

  /* Get the quiz */
  var quiz = JSON.parse(localStorage.quiz);

  /* Get the order of questions */
  var questionOrder = JSON.parse(localStorage.questionOrder);

  /* Display first question */
  var questionNumber = 0;
  var questionNumberText = document.createElement("p");
  questionNumberText.innerHTML = "Question 1";
  questionNumberText.classList.add("quiz-question-number");

  var question = document.createElement("p");
  question.classList.add("quiz-question");
  question.innerHTML = questionOrder[0][1];




  theInterface.appendChild(questionNumberText);
  theInterface.appendChild(question);

  /* Answers container */
  var answersContainer = document.createElement("div");
  answersContainer.id = "answers-container";
  theInterface.appendChild(answersContainer);

  /* Quiz control contaiiner */
  var quizControl = document.createElement("div");
  quizControl.classList.add("quiz-control");
  quizControl.id = "quiz-control";
  /* Next button */
  var nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.classList.add("btn", "btn-primary", "btn-large");
  nextButton.innerHTML = "Next question >";
  nextButton.id = "next-button"
  quizControl.appendChild(nextButton);
  theInterface.appendChild(quizControl);



  /* Load answers */
  loadAnswers(0, questionOrder, quiz, theInterface, answersContainer);


  /* Add event listeners */
  document.body.addEventListener("click", function(event) {
    if (event.target && event.target.id == "next-button") {
      questionNumber++;
      displayNextQuestion(questionNumber, questionOrder, quiz, theInterface);
      loadAnswers(questionNumber, questionOrder, quiz, theInterface, answersContainer, true);
      loadQuizControl(questionNumber, questionOrder, "next");
    }
  });
  }

  else {};
}

function loadQuizControl(questionNumber, questionlist, direction) {
  if (direction == "next" && questionNumber == 1) {
    /* Add "previous" */
    var nextButton = document.getElementById("next-button");
    var previousButton = document.createElement("button");
    previousButton.type = "button";
    previousButton.classList.add("btn", "btn-primary", "btn-large");
    previousButton.innerHTML = "< Previous question";
    previousButton.id = "previous-button";
    var thequizControl = nextButton.parentNode;
    thequizControl.insertBefore(previousButton, nextButton);
  }
  if (direction == "next" && questionNumber == questionlist.length-1) {
    /* Remove "next" */
    var nextButton = document.getElementById("next-button");
    nextButton.parentElement.removeChild(nextButton);
  }
  if (direction == "previous" && questionNumber == questionlist.length - 2) {
    /* Add "next" */
    var nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.classList.add("btn", "btn-primary", "btn-large");
    nextButton.innerHTML = "Next question >";
    nextButton.id = "next-button"
    quizControl.appendChild(nextButton);
  }
  if (direction == "previous" && questionNumber == 0) {
    /* Remove "previous" */
    var previousButton = document.getElementById("previous-button");
    previousButton.parentElement.removeChild(previousButton);
  }
}

function loadAnswers(questionNumber, questionlist, quiz, theInterface, answersContainer, animate) {
  var questiontext = questionlist[questionNumber][1];

  var questions = quiz.questions;
  for (i=0; i<questions.length; i++) {
    if (questions[i].question == questiontext) {
      for (answer in questions[i].answers) {
        var label = document.createElement("label");
        var option = document.createElement("input");
        option.id = questions[i].answers[answer];
        label.classList.add("answer-label");
        label.htmlFor = option.id;
        option.type = "radio";
        option.name = "answer";
        option.classList.add("quiz-answer");
        option.innerHYML = questions[i].answers[answer];
        option.value = questions[i].answers[answer];
        label.appendChild(option);
        label.innerHTML += questions[i].answers[answer];
        answersContainer.appendChild(label);
      }
    }
  }

}

function toggleChecked(target) {
  var options = document.getElementsByClassName("answer-label");
  console.log(options + "hello!");
  for (i = 0; i< options.length; i++) {
    console.log(options[i].firstChild);
    if (options[i].firstChild.checked == true) {
      options[i].classList.add("selected-answer");
    }
    else {
      options[i].classList.remove("selected-answer");
    }
  }



}

function displayNextQuestion() {
  var answers = document.getElementsByClassName("answer-label");
  var answersContainer = document.getElementById("answers-container");

  /* Animate flyout of answers */
  for (i=0; i<answers.length; i++) {
    answers[i].classList.add("fly-out-left");
  }

  /* Delete the answers */
  while (answersContainer.firstChild) {
    answersContainer.removeChild(answersContainer.firstChild);
  }

}
