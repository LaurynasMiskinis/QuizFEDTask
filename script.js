stage = 1
api = 'https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple'

function randomiseOptions() {
	optionIds = ['option1', 'option2', 'option3'];
    correctIndex = Math.floor(Math.random() * optionIds.length);
    counterLabel = document.getElementById('counter').innerText.split('/');
    document.getElementById("optionLabel").innerText = questions[counterLabel[0] - 1]["question"]
    let incorrectCnt = 0
    optionIds.forEach((id, idx) => {
        const el = document.getElementById(id);
        if (idx === correctIndex) {
            el.onclick = correct;
            el.innerText = questions[counterLabel[0] - 1]["correct_answer"]
        } else {
            el.onclick = incorrect;
            el.innerText = questions[counterLabel[0] - 1]["incorrect_answers"][incorrectCnt]
            incorrectCnt = incorrectCnt + 1
        }
    });
};
async function getQuestions() {
    while (true) {
        const response = await fetch(api);
        if (response.status === 429) {
            alert('Error 429. Rate limit exceeded. Please slow down.');
            continue;
        }
        const data = await response.json();
        return data;
    }
}
questions = {}
getQuestions().then(data => {
    questions = data.results
    randomiseOptions();
});
correct = function() {
    if (!questions) {
        return;
    }
    counterLabel = document.getElementById('counter').innerText.split('/');
    if (counterLabel[0] < counterLabel[1]) {
        document.getElementById('counter').innerText = (parseInt(counterLabel[0]) + 1) + '/' + 5;
        stage = stage + 1;
        randomiseOptions();
    } else {
        document.getElementById('result').innerText = ('You Answered ' + (stage) + '/5 correctly');
        document.getElementById('main').style.height = '0vh';
        document.getElementById('main').style.visibility = 'hidden'
        document.getElementById('end').style.height = 'auto';
        document.getElementById('end').style.visibility = 'visible'
    }
};
incorrect = function() {
    if (!questions) {
        return;
    }
    counterLabel = document.getElementById('counter').innerText.split('/');
    if (counterLabel[0] < counterLabel[1]) {
        document.getElementById('counter').innerText = (parseInt(counterLabel[0]) + 1) + '/' + 5;
        randomiseOptions();
    } else {
        document.getElementById('result').innerText = ('You Answered ' + (stage - 1) + '/5 correctly');
        document.getElementById('main').style.height = '0vh';
        document.getElementById('main').style.visibility = 'hidden'
        document.getElementById('end').style.height = 'auto';
        document.getElementById('end').style.visibility = 'visible'
    }
};
restart = function() {
	counterLabel = document.getElementById('counter').innerText.split('/');
	if (counterLabel[0] < counterLabel[1]) {
		document.getElementById('counter').innerText = (parseInt(counterLabel[0]) + 1) + '/' + 5;
	} else {
		getQuestions().then(data => {
			questions = data.results
			document.getElementById('main').style.height = 'auto';
			document.getElementById('main').style.visibility = 'visible'
			document.getElementById('end').style.height = '0vh';
			document.getElementById('end').style.visibility = 'hidden'
			document.getElementById('counter').innerText = '1/5';
			stage = 1;
			randomiseOptions();
		});
	}
};