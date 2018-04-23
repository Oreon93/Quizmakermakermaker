// Sets up the Quiz
function Quiz(quizname) {
  this.name = quizname;
  this.questions = new Array();
  this.questionOrder = new Array();
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
  /* Key gloabl varaiables */
  var localStorageUsers = JSON.parse(localStorage.users);
  var currentUser = "";
  var currentQuizIndex = "";
  var theInterface = document.getElementById("interface");

  /* Menu items */
  document.getElementById("logo").addEventListener("click", quizView);
  document.getElementById("manage-questions").addEventListener("click", displayQuestionList);
  document.getElementById("add-question").addEventListener("click", displayAddQuestionForm);
  document.getElementById("play-quiz").addEventListener("click", playQuiz);

  /* Buttons */
  theInterface.addEventListener("click", function(event) {
    if (event.target && event.target.id == "register-link") {registerLink();}
    if (event.target && event.target.id == "login-btn") {loginBtn();}
    if (event.target && event.target.classList.contains("submit-question")) {submitQuestion(event);}
    if (event.target && event.target.id == "add-answer") {addAnswer();}
    if (event.target && event.target.classList.contains("quiz-answer")) {toggleChecked();}
    if (event.target && event.target.id == "add-new-quiz") { nameQuiz(); };
    if (event.target && event.target.classList.contains("play-quiz")) { playQuizOption(); };
    if (event.target && event.target.classList.contains("edit-quiz")) { editQuiz(); };
    if (event.target && event.target.classList.contains("delete-quiz")) { deleteQuiz(); };
    if (event.target && event.target.id == "back-to-quiz-list") { quizView(); };
  });

  document.body.addEventListener("click", function(event) {
    if (event.target && event.target.id == "confirm-delete-quiz") { deleteConfirm(); };
    if (event.target && event.target.id == "cancel-delete-quiz") { deleteModal(); };
    if (event.target && event.target.id == "create-quiz") {createQuiz();}
  });

  /* REGISTRATION AND LOGIN FUNCTIONALITY
  - Creates registration form
  - Stores data in local storage
  - Checks against local storage for login form then loads quiz manager view
  */

  function loginBtn() {
    var username = document.getElementById("username").value, pass = document.getElementById("password").value;
    var user = localStorageUsers.filter(function(user) {
      return user.username == username;
    });
    if (user.length == 1 && user[0].password == pass) {
      currentUser = user[0];
      console.log(currentUser.quizzes.length);
      smoothFade(quizView);
    }
    else {
      // Account not found message
      var existingMessage = document.getElementById("not-found");
      if (!existingMessage) {
        var notFound = document.createElement("p");
        var form = document.getElementById("login-form");
        notFound.id = "not-found";
        notFound.innerHTML = "Sorry, there is no account with those details";
        form.appendChild(notFound);
      }
    }
  }
  function registerLink() {
    var passConf = document.createElement("input"), createAct = document.createElement("button");
    var form = document.getElementById("login-form");
    form.removeChild(document.getElementById("login-btn"));
    var notFoundMsg = document.getElementById("not-found");
    if (notFoundMsg) {
      form.removeChild(notFoundMsg);
    }

    passConf.type = "password";
    passConf.id = "password-confirm";
    passConf.placeholder = "Confirm password";
    form.appendChild(passConf);

    createAct.type = "button";
    createAct.id = "create-account";
    createAct.classList.add("btn", "btn-lg", "btn-primary", "full-width-btn");
    createAct.innerHTML = "Create account";
    form.appendChild(createAct);

    // Event listener and function for account creation
    document.body.addEventListener("click", function(event) {
      if (event.target && event.target.id == "create-account") {
        var pass = document.getElementById("password");
        var username = document.getElementById("username");

        //Check if passwords match
        if (pass.value == passConf.value) {
          // Remove error class from password fields
          passConf.classList.remove("input-error");
          pass.classList.remove("input-error");

          var newUser = {
            username: username.value,
            password: pass.value,
            quizzes: []
          }
          // Check the account doesn't already exist
          var existingAccount = localStorageUsers.filter(function(user) {
            return user.username == username.value;
          });
          if (existingAccount.length ==  1) {
            var actmsg = document.createElement("p");
            actmsg.classList.add("error-message");
            actmsg.innerHTML = "Sorry, there is already an account with that e-mail address."
            form.insertBefore(actmsg, username);
          }
          // Everything is fine
          else {
            if (localStorageUsers.length == 0) {
              localStorageUsers = [];
            }
            localStorageUsers.push(newUser);
            localStorage.users = JSON.stringify(localStorageUsers);
            currentUser = newUser;
            smoothFade(quizView);
          }
        }
        else {
          passConf.classList.add("input-error");
          pass.classList.add("input-error");
          passConf.value = "";
          pass.value = "";

          // Display error messaage
          var msg = document.createElement("p");
          msg.classList.add("error-message");
          msg.innerHTML = "*Passwords must match."
          form.insertBefore(msg, username);
        }
      }
    });
  }

  /* Handles the quiz manager view */
  function quizView() {
    /* Check if user is logged in first */
    if (currentUser) {
    /* Hide menu */
      document.getElementById("menu").classList.add("hidden");

      clearInterface(theInterface);

      var welcomeMsg = document.createElement("p");
      welcomeMsg.classList.add("welcome-text");
      welcomeMsg.id="welcome-message";
      welcomeMsg.innerHTML = "Welcome, " + currentUser.username;
      theInterface.appendChild(welcomeMsg);

      var quizlisttitle = document.createElement("h2");
      quizlisttitle.innerHTML = "Your quizzes";
      theInterface.appendChild(quizlisttitle);
      if (currentUser.quizzes.length == 0) {generateEmptyList();}
      else {generateQuizList()};
    }
  }
  function generateEmptyList() {
    // Create and define elements
    var emptyBox = document.createElement("div"), emptyLogo = document.createElement("img"), emptyText = document.createElement("p"), createQuizBtn = document.createElement("button");
    emptyBox.classList.add("empty-box");
    emptyLogo.src = "empty-logo.png";
    emptyLogo.classList.add("empty-logo");
    emptyText.innerHTML = "You have no quizzes yet!";
    createQuizBtn.type = "button";
    createQuizBtn.id = "add-new-quiz";
    createQuizBtn.classList.add("btn", "btn-lg", "btn-primary");
    createQuizBtn.innerHTML = "Create your first quiz!";

    emptyBox.appendChild(emptyLogo);
    emptyBox.appendChild(emptyText);
    emptyBox.appendChild(createQuizBtn);
    theInterface.appendChild(emptyBox);
  }
  function generateQuizList() {
    var list = document.createElement("ul");


    var createQuizBtn = document.createElement("button");

    list.classList.add("question-list");
    list.id = "quiz-list";
    createQuizBtn.type = "button";
    createQuizBtn.id = "add-new-quiz";
    createQuizBtn.classList.add("btn", "btn-lg", "btn-primary");
    createQuizBtn.innerHTML = "Create new quiz";
    for (var i=0; i<currentUser.quizzes.length; i++) {
      var row = document.createElement("li");
      var quizText = document.createElement("p");
      var buttons = document.createElement("p");
      buttons.innerHTML = "<i class='fas fa-gamepad play-quiz item-action' title='Play quiz'></i><i class='far fa-edit edit-quiz item-action'  title='Edit quiz'></i><i class='fas fa-trash delete-quiz item-action'  title='Delete quiz'></i>";
      buttons.classList.add("question-text", "list-buttons");
      quizText.classList.add('question-text');
      quizText.innerHTML = currentUser.quizzes[i].name;
      row.appendChild(quizText);
      row.appendChild(buttons);
      list.appendChild(row);
    }
    theInterface.appendChild(list);
    theInterface.appendChild(createQuizBtn);

    // Add button funcionality
  }

  /* Shows a modal window for naming your quiz then the confirm button creates the quiz */
  function nameQuiz() {
    // Create and define elements
    var modal = document.createElement("div"), modalwindow = document.createElement("div"), modaltext = document.createElement("p"), quizInput = document.createElement("input"), confirmButton = document.createElement("button");
    modal.classList.add("modal-background");
    modal.id = "modal";
    modalwindow.classList.add("modal-window");
    modalwindow.id = "modal-window";
    modaltext.classList.add("welcome-text");
    modaltext.innerHTML = "Enter your quiz name:";
    quizInput.type = "text";
    quizInput.id = "quiz-name";
    confirmButton.classList.add("btn", "btn-lg", "btn-primary", "full-width-btn");
    confirmButton.id = "create-quiz";
    confirmButton.innerHTML = "Create quiz";

    modalwindow.appendChild(modaltext);
    modalwindow.appendChild(quizInput);
    modalwindow.appendChild(confirmButton);
    document.body.appendChild(modal);
    document.body.appendChild(modalwindow);

  }
  function createQuiz() {
    // Save quiz
    var quizname = document.getElementById("quiz-name").value
    var newQuiz = new Quiz(quizname);
    currentUser.quizzes.push(newQuiz);
    saveToLocalStorage();

    currentQuizIndex = currentUser.quizzes.length - 1;
    deleteModal();
    document.getElementById("quizname").innerHTML = newQuiz.name;
    displayAddQuestionForm();
  }

  /* Simply play quiz functionality *from* the quiz list view */
  function playQuizOption() {
    var quizRow = event.target.parentElement.parentElement;
    var quizList = quizRow.parentElement;
    currentQuizIndex = Array.prototype.indexOf.call(quizList.children, quizRow);
    smoothFade(playQuiz);
  }

  /* Simple edit functionality taking you to question list view */
  function editQuiz() {
    var quizRow = event.target.parentElement.parentElement;
    var quizList = quizRow.parentElement;
    currentQuizIndex = Array.prototype.indexOf.call(quizList.children, quizRow);
    showMenu();
    displayQuestionList();
  }

  /* Handles delete functionnality with confirm button */
  function deleteQuiz() {
    var quizRow = event.target.parentElement.parentElement;
    var quizList = quizRow.parentElement;

    currentQuizIndex = Array.prototype.indexOf.call(quizList.children, quizRow);
    var modalWindow = createModal();
    var modalText = document.createElement("p"), confirmButton = document.createElement("button"), cancelButton = document.createElement("button");
    modalText.innerHTML = "Are you sure you want to delete the quiz?";
    confirmButton.type = "button";
    confirmButton.id = "confirm-delete-quiz";
    confirmButton.classList.add("btn", "btn-lg", "btn-danger", "full-width-btn");
    confirmButton.innerHTML = "Yes, delete";
    cancelButton.type = "button";
    cancelButton.id = "cancel-delete-quiz";
    cancelButton.classList.add("btn", "btn-lg", "btn-secondary", "full-width-btn");
    cancelButton.innerHTML = "Cancel";
    modalWindow.appendChild(modalText);
    modalWindow.appendChild(confirmButton);
    modalWindow.appendChild(cancelButton);
  }
  function deleteConfirm() {
    currentUser.quizzes.splice(currentQuizIndex, 1);
    var quizList = document.getElementById("quiz-list")
    quizList.removeChild(quizList.childNodes[currentQuizIndex]);
    deleteModal();
    saveToLocalStorage();
  }


  /* This function displays the add question form interface */
  function displayAddQuestionForm() {
    /* Show menu */
    document.getElementById("menu").classList.remove("hidden");


    /* Clear interface */
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
    submitButton.classList.add("btn", "btn-lg", "btn-success", "submit", "submit-question");
    submitButton.id = "submit-question";
    submitButton.innerHTML = "Submit";

    /* Add the "Submit and add another" button */
    var submitAddAnotherButton = document.createElement("button");
    submitAddAnotherButton.type = "button";
    submitAddAnotherButton.classList.add("btn", "btn-lg", "btn-secondary", "submit",  "submit-question");
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
  function submitQuestion(event) {

    /* Add the quiz to the user */
    var questiontext = document.getElementById("question-field").value;
    var answers = document.getElementsByTagName("input");
    var answersNumber = answers.length;
    var correctAnswerValue = Math.floor(Math.random()*answersNumber);
    var answersArray = [];
    for (i=1; i<answersNumber; i++) {
      answersArray.push(answers[i].value);
    }
    answersArray.splice(correctAnswerValue, 0, answers[0].value);
    var currentQuiz = currentUser.quizzes[currentQuizIndex];
    currentQuiz.addQuestion(questiontext, correctAnswerValue, answersArray);


    /* Update the question order */
    var questionOrderItem = [currentQuiz.questionOrder.length + 1, questiontext];
    currentQuiz.questionOrder.push(questionOrderItem);

    console.log(currentUser);
    saveToLocalStorage();

    if (event.target.id == "submit-question") {
      displayQuestionList();
    }
    else if (event.target.id == "submit-add-another") {
      displayQuestionCounter();
      addAnother(answers);
    }
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


  /* -- Clear */
  function addAnother(answers) {
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
    var currentQuiz = currentUser.quizzes[currentQuizIndex];
    console.log(currentQuiz);
    if (currentQuiz.questions.length == 1) {
      counter.innerHTML = "This quiz has " + currentQuiz.questions.length + " question.";
    }
    else {
    counter.innerHTML = "This quiz has " + currentQuiz.questions.length + " questions.";
    }
  }



  /* This section handles the Question List view */

  function displayQuestionList() {
    /* Clear interface */
    clearInterface(theInterface);
    var menuItems = document.getElementsByClassName("menu-item");
    var questionOrder = currentUser.quizzes[currentQuizIndex].questionOrder;
    for (var i = 0; i<menuItems.length; i++) {
      console.log(menuItems[i]);
      if (menuItems[i].parentElement.id == "manage-questions") {
        menuItems[i].classList.add("menu-item-active");
      }
      else {
        menuItems[i].classList.remove("menu-item-active");
      }
    }
    var list = document.createElement("ul");
    list.classList.add("question-list");
    for (i=0; i<questionOrder.length; i++) {

      var row = document.createElement("li");
      row.classList.add("draggable");
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
    /* Hide menu */
    document.getElementById("menu").classList.add("hidden");

    /* Clear interface */
    clearInterface(theInterface);
    var menuItems = document.getElementsByClassName("menu-item");
    for (var i = 0; i<menuItems.length; i++) {
        menuItems[i].classList.remove("menu-item-active");
      }

    /* Get the quiz */
    var quiz = currentUser.quizzes[currentQuizIndex];
    var quizTitle = document.createElement("h2");
    quizTitle.innerHTML = quiz.name;

    /* Get the order of questions */
    var questionOrder = quiz.questionOrder;

    /* Display first question */
    var questionNumber = 0;
    var questionNumberText = document.createElement("p");
    questionNumberText.innerHTML = "Question 1";
    questionNumberText.classList.add("quiz-question-number");
    questionNumberText.id = "quiz-question-number";

    var question = document.createElement("p");
    question.classList.add("quiz-question");
    question.id = "quiz-question";
    question.innerHTML = questionOrder[0][1];



    theInterface.appendChild(quizTitle);
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
        recordAnswer(questionNumber, questionOrder);
        questionOrder = JSON.parse(localStorage.questionOrder);
        questionNumber++;
        displayNextQuestion(questionNumber, questionOrder, quiz, theInterface);
        questionNumberText.classList.add("faded-out");
        question.classList.add("faded-out");
        /* Delete the answers */
        setTimeout(function() {
          while (answersContainer.firstChild) {
            answersContainer.removeChild(answersContainer.firstChild);
          }
          loadQuestion(questionNumber, questionOrder);
          loadAnswers(questionNumber, questionOrder, quiz, theInterface, answersContainer, true);
          loadQuizControl(questionNumber, questionOrder, "next");
          if (questionOrder[questionNumber][2] != null) {
            toggleChecked(questionOrder[questionNumber][2]);
          }
        }, 1000);
      }

      if (event.target && event.target.id == "previous-button") {
        recordAnswer(questionNumber, questionOrder);
        questionOrder = JSON.parse(localStorage.questionOrder);
        questionNumber--;
        displayPreviousQuestion(questionNumber, questionOrder, quiz, theInterface);
        questionNumberText.classList.add("faded-out");
        question.classList.add("faded-out");
        /* Delete the answers */
        setTimeout(function() {
          while (answersContainer.firstChild) {
            answersContainer.removeChild(answersContainer.firstChild);
          }
          loadQuestion(questionNumber, questionOrder);
          loadAnswers(questionNumber, questionOrder, quiz, theInterface, answersContainer, true);
          loadQuizControl(questionNumber, questionOrder, "previous");
          if (questionOrder[questionNumber][2] != null) {
            toggleChecked(questionOrder[questionNumber][2]);
          }
        }, 1000);
      }

      if (event.target && event.target.id == "see-results") {
        recordAnswer(questionNumber, questionOrder);
        questionOrder = JSON.parse(localStorage.questionOrder);
        smoothFade(function() {
          seeQuizResults(questionOrder, quiz);
        });
      }

    });
  }

  function loadQuestion(questionNumber, questionOrder) {
    var questionNumberText = document.getElementById("quiz-question-number");
    questionNumberText.innerHTML = "Question " + (questionNumber + 1);
    questionNumberText.classList.remove("faded-out");


    var questionText = document.getElementById("quiz-question");
    questionText.innerHTML = questionOrder[questionNumber][1];
    questionText.classList.remove("faded-out");
  }


  function loadQuizControl(questionNumber, questionlist, direction) {
    var quizControl = document.getElementById("quiz-control");
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
    if (direction == "previous" && questionNumber == questionlist.length - 2) {
      /* Add "next" */
      var nextButton = document.createElement("button");
      var seeResults = document.getElementById("see-results");
      nextButton.type = "button";
      nextButton.classList.add("btn", "btn-primary", "btn-large");
      nextButton.innerHTML = "Next question >";
      nextButton.id = "next-button"
      quizControl.appendChild(nextButton);
      quizControl.removeChild(seeResults);
    }
    if (direction == "next" && questionNumber == questionlist.length-1) {
      /* Remove "next" */
      var nextButton = document.getElementById("next-button");
      nextButton.parentElement.removeChild(nextButton);

      /* Add "See results!" */
      var seeResults = document.createElement("button");
      seeResults.type="button";
      seeResults.classList.add("btn", "btn-secondary", "btn-large");
      seeResults.innerHTML = "See your score!";
      seeResults.id = "see-results";
      quizControl.appendChild(seeResults);
    }

    if (direction == "previous" && questionNumber == 0) {
      /* Remove "previous" */
      var previousButton = document.getElementById("previous-button");
      quizControl.removeChild(previousButton);
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

  function toggleChecked(preChecked) {

    var options = document.getElementsByClassName("answer-label");
    console.log(preChecked);
    /* Handles previously selected answers */
    if (preChecked != null) {
        options[preChecked].firstChild.checked == true;
        options[preChecked].classList.add("selected-answer");
    }
    /* This is the first time the question has been displayed */
    else {
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
  }

  function recordAnswer(questionNumber, questionlist) {
    var options = document.getElementsByClassName("answer-label");
    for (i=0; i< options.length; i++) {
      if (options[i].firstChild.checked == true) {
        questionlist[questionNumber][2] = i;

      }
    }
    localStorage.questionOrder = JSON.stringify(questionlist);
    console.log(questionlist);
  }

  function displayNextQuestion() {
    var answers = document.getElementsByClassName("answer-label");
    /* Animate flyout of answers */
    for (i=0; i<answers.length; i++) {
      answers[i].classList.add("fly-out-left");
    }
  }

  function displayPreviousQuestion() {
    var answers = document.getElementsByClassName("answer-label");
    /* Animate flyout of answers */
    for (i=0; i<answers.length; i++) {
      answers[i].classList.add("fly-out-right");
    }
  }

  function seeQuizResults(questionlist, quiz) {

    /* Clear interface */
    clearInterface(theInterface);


    /* Check answers and create array of corrections */
    var score = 0;
    var corrections = [];
    for (i=0; i<questionlist.length; i++) {
      var quizQuestion = quiz.questions.filter(function (question) {
        return question.question == questionlist[i][1];});
      if (questionlist[i][2] == quizQuestion[0].correctAnswer) {
        score++
      }
      else {
        var theQuestion = questionlist[i][1];
        var whatTheyAnswered = quizQuestion[0].answers[questionlist[i][2]];
        var correctAnswer = quizQuestion[0].answers[quizQuestion[0].correctAnswer];
        var newCorrection = [theQuestion, whatTheyAnswered, correctAnswer];
        corrections.push(newCorrection);
      }
      console.log("Question " + i + " was " + quizQuestion[0].question);
    }
    console.log("The final score is " + score);
    /* Calculate percentage */
    var percentage = score / questionlist.length;
    var percentageRounded = Math.round(percentage*100);

    /* Display the quiz, score and commentary */
    var quizTitle = document.createElement("h2");
    quizTitle.innerHTML = quiz.name + ": Your score";
    var scoreDisplay = document.createElement("p");
    scoreDisplay.classList.add("quiz-question-number");
    scoreDisplay.innerHTML = "You scored " + score + " out of " + questionlist.length + ", or " + percentageRounded + "%"

    var commentary = document.createElement("p");
    commentary.classList.add("quiz-question");
    switch(true) {
        case (percentage >= 0.9):
          commentary.innerHTML = "Amazing!";
          break;
        case (percentage >= 0.7):
          commentary.innerHTML = "Nice work!";
          break;
        case (percentage >= 0.5):
          commentary.innerHTML = "Not bad, I suppose...";
          break;
        case (percentage >= 0):
          commentary.innerHTML = "That was awful.";
          break;
    }

    theInterface.appendChild(quizTitle);
    theInterface.appendChild(commentary);
    theInterface.appendChild(scoreDisplay);



    if (corrections.length > 0) {
      var correctionsDisplay = document.createElement("p");
      correctionsDisplay.innerHTML = "Here is what you got wrong: <br><br>"
      for (i=0; i<corrections.length; i++) {
        correctionsDisplay.innerHTML += "The question was: \'" + corrections[i][0] + "\' <br>";
        correctionsDisplay.innerHTML += "You answered: <b>" + corrections[i][1] + "</b> <br>";
        correctionsDisplay.innerHTML += "The correct answer was: <b>" + corrections[i][2] + "</b> <br><br>";
      }
      theInterface.appendChild(correctionsDisplay);
    }

    /* Display back button */
    var quizControl = document.createElement("div");
    quizControl.classList.add("quiz-control");
    quizControl.id = "quiz-control";
    var backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.id = "back-to-quiz-list";
    backBtn.classList.add("btn", "btn-lg", "btn-primary");
    backBtn.innerHTML = "< Back to my quizzes";
    quizControl.appendChild(backBtn);
    theInterface.appendChild(quizControl);
  }


  /* This function just saves the user's details to local storage */
  function saveToLocalStorage() {
    var userPosition = localStorageUsers.findIndex(function(user) {
      return user.username == currentUser.username;
    });
    localStorageUsers[userPosition] = currentUser;
    localStorage.users = JSON.stringify(localStorageUsers);
  }

  /* This function fades out the interface before loading the next one */
  function smoothFade(callback) {
    theInterface.classList.add("faded-out");
    setTimeout(function() {
      callback();
      theInterface.classList.remove("faded-out");
    }, 1000);
  }

  /* This function clears the view whenever a menu button is clicked */
  function clearInterface(interface) {
    while (interface.firstChild) {interface.removeChild(interface.firstChild)}
  }

  /* This function just creates a modal window */
  function createModal() {
    // Create and define elements
    var modal = document.createElement("div"), modalwindow = document.createElement("div");
    modal.classList.add("modal-background");
    modal.id = "modal";
    modalwindow.classList.add("modal-window");
    modalwindow.id = "modal-window";
    document.body.appendChild(modal);
    document.body.appendChild(modalwindow);
    return modalwindow;
  }

  function deleteModal() {
    var modal = document.getElementById("modal");
    var modalwindow = document.getElementById("modal-window");
    document.body.removeChild(modal);
    document.body.removeChild(modalwindow);
  }

  function showMenu() {
    /* Show menu */
    document.getElementById("menu").classList.remove("hidden");
    document.getElementById("quizname").innerHTML = currentUser.quizzes[currentQuizIndex].name;
  }


  function transitionEndEventName () {
      var i,
          undefined,
          el = document.createElement('div'),
          transitions = {
              'transition':'transitionend',
              'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
              'MozTransition':'transitionend',
              'WebkitTransition':'webkitTransitionEnd'
          };

      for (i in transitions) {
          if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
              return transitions[i];
          }
      }

      //TODO: throw 'TransitionEnd event is not supported in this browser';
  }
}
