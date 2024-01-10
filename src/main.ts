import { ElementsSelector } from './enums/selector.enum';
import { requestToOpenAi } from './scripts/request-to-openai';
import { PageElementService } from './service/page-elemen.service';
import './style.scss';
export { OpenaiService } from './service/openai.service';

async function main() {
	const answerButton = new PageElementService(ElementsSelector.answerButton);

	answerButton.addEvent(async () => {
		answerButton.hide(true);
		const tasks = getRequestParammetr();
		const massege = messegeConsructor(tasks);
		console.log(massege);
		await requestToOpenAi(massege);
		answerButton.hide(false);
	});
}

function getRequestParammetr() {
	const questionsArea = new PageElementService('#questionsArea');

	const counter = questionsArea.node.element?.childNodes.length || 0;
	let tasks = '';

	for (let i = 1; i < counter + 1; i++) {
		const questionsInput = new PageElementService(`#questions-${i}`);

		if (questionsInput.isChecked().content === true) {
			tasks += questionsInput.getValue().content;
		}
	}
	console.log(tasks);
	return tasks;
}

function messegeConsructor(task: string) {
	const persona = `Are you an experienced programmer`;
	const context = `you write code in typescript`;
	const taskCode = `constructor(key: string) {
		this.openai = new OpenAI({
			apiKey: key,
			dangerouslyAllowBrowser: true,
		});
	}`;
	const format = `Answer in Russian, be sure to add markup for formatting the stake`;
	const tone = `Answer in a non-normative tone`;

	return `[${persona}] [${context}] ${task} : ${taskCode}] [${format}] [${tone}]`;
}

main();
