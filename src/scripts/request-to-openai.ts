import { ElementsSelector } from '../enums/selector.enum';
import { PageElementService } from '../service/page-elemen.service';
import { replaceFences } from './text-formatting';
import { Stream } from 'openai/streaming';
import { OpenaiService } from '../service/openai.service';

export async function requestToOpenAi(question: string) {
	const GPT_KEY = process.env.API_KEY;
	if (!GPT_KEY) throw new Error(`Ключ OPEN_AI не найден`);
	const chatGpt = new OpenaiService(GPT_KEY);
	const statusArea = new PageElementService(ElementsSelector.StatusArea);

	if (statusArea.getTextContent().content !== 'OK') throw new Error('Запрос уже выполняется');

	statusArea.setTextContent('Ожидание ответа');

	const questionMessaege = [chatGpt.createUserMessage(question)];
	console.log(questionMessaege);

	const stream = await chatGpt.streamResponse(questionMessaege);

	const answerArea = new PageElementService(ElementsSelector.AnswerArea);
	answerArea.addHTML('', true);
	answerArea.hide(false);

	if (stream instanceof Stream) {
		for await (const part of stream) {
			const content = part.choices[0]?.delta?.content || '';
			answerArea.addHTML(content);
		}
	}
	const answerText = answerArea.getTextContent();
	answerArea.addHTML('', true);
	const fullContent = replaceFences(answerText.content);
	for (let str of fullContent) {
		answerArea.addHTML(str);
	}

	statusArea.setTextContent('Форматирование');
}
