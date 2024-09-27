const QUESTIONS_KEY = 'discussionAppQuestions';

// Initialize questions array from localStorage or empty if not present
let questions = JSON.parse(localStorage.getItem(QUESTIONS_KEY)) || [];

// Select DOM elements
const questionList = document.getElementById('questionList');
const submitQuestionBtn = document.getElementById('submitQuestion');
const newQuestionBtn = document.getElementById('newQuestionBtn');
const questionForm = document.getElementById('questionForm');
const questionDetail = document.getElementById('questionDetail');
const resolveBtn = document.getElementById('resolveBtn');
const submitResponseBtn = document.getElementById('submitResponse');

// Function to render the list of questions
function renderQuestions() {
    questionList.innerHTML = '';
    questions.forEach((question, index) => {
        const questionBox = document.createElement('div');
        questionBox.classList.add('question-box');
        questionBox.innerHTML = `<strong>${question.title}</strong><p>${question.content}</p>`;
        questionBox.addEventListener('click', () => displayQuestion(index));
        questionList.appendChild(questionBox);
    });
}

// Function to add a new question
function addQuestion() {
    const title = document.getElementById('subject').value.trim();
    const content = document.getElementById('question').value.trim();

    // Check for mandatory fields
    if (!title || !content) {
        alert('Both fields are required.');
        return;
    }

    questions.push({ title, content, responses: [] });
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
    renderQuestions();
    document.getElementById('subject').value = '';
    document.getElementById('question').value = '';
    questionForm.classList.add('hidden');
}

// Function to display selected question details
function displayQuestion(index) {
    const selectedQuestion = questions[index];
    questionDetail.classList.remove('hidden');
    questionForm.classList.add('hidden');

    document.getElementById('questionTitle').innerText = selectedQuestion.title;
    document.getElementById('questionContent').innerText = selectedQuestion.content;

    const responsesDiv = document.getElementById('responses');
    responsesDiv.innerHTML = '';
    selectedQuestion.responses.forEach(response => {
        const responseDiv = document.createElement('div');
        responseDiv.innerHTML = `<strong>${response.name}</strong><p>${response.comment}</p>`;
        responsesDiv.appendChild(responseDiv);
    });

    // Remove any existing event listeners to avoid duplicates
    resolveBtn.replaceWith(resolveBtn.cloneNode(true));  // Clone and replace the button to remove old listeners
    submitResponseBtn.replaceWith(submitResponseBtn.cloneNode(true));  // Clone and replace the button

    const newResolveBtn = document.getElementById('resolveBtn');
    const newSubmitResponseBtn = document.getElementById('submitResponse');

    newResolveBtn.onclick = () => resolveQuestion(index);
    newSubmitResponseBtn.onclick = () => submitResponse(index);
}

// Function to add a response to a question
function submitResponse(index) {
    const name = document.getElementById('responseName').value.trim();
    const comment = document.getElementById('responseComment').value.trim();

    // Check for mandatory fields
    if (!name || !comment) {
        alert('Both fields are required.');
        return;
    }

    questions[index].responses.push({ name, comment });
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));

    displayQuestion(index);
    document.getElementById('responseName').value = '';
    document.getElementById('responseComment').value = '';
}

// Function to resolve a question and remove it from the list
function resolveQuestion(index) {
    questions.splice(index, 1);
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
    renderQuestions();
    questionDetail.classList.add('hidden');
    questionForm.classList.remove('hidden');
}

// Event listeners
submitQuestionBtn.addEventListener('click', addQuestion);
newQuestionBtn.addEventListener('click', () => questionForm.classList.toggle('hidden'));

// Initial render
renderQuestions();
