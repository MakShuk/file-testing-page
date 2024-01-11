import axios from 'axios';
import { ElementsSelector } from './enums/selector.enum';
import { requestToOpenAi } from './scripts/request-to-openai';
import { PageElementService } from './service/page-elemen.service';
import './style.scss';
export { OpenaiService } from './service/openai.service';

async function main() {
	const answerButton = new PageElementService(ElementsSelector.AnswerButton);

	answerButton.addEvent(async () => {
		answerButton.hide(true);
		const taskCode = await getFileContent();
		const tasks = getRequestParammetr();
		if (!taskCode) {
			answerButton.hide(false);
		} else {
			const massege = messegeConsructor(tasks, taskCode);
			console.log(massege);
			await requestToOpenAi(massege);
			answerButton.hide(false);
		}
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

function messegeConsructor(task: string, taskCode: string) {
	const persona = `Behave like an experienced programmer`;
	const context = ``;
	const format = `Answer in Russian`;
	const tone = `Answer in the style of a teacher`;

	return `[${format}] [${persona}] [${context}] ${task} :
	 "${taskCode}"
	  [${format}] [${tone}]`;
}

async function getFileContent() {
	const pathInput = new PageElementService(ElementsSelector.InputQuestion);
	const pathInputValue = pathInput.getValue();

	if (pathInputValue.error) return null;

	const fileCode = await axios(`http://localhost:3333/page/file?path=${pathInputValue.content}`);
	return `${fileCode.data}`;
}

main();
