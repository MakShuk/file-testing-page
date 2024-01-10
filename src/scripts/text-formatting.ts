export function replaceFences(str: string) {
	const language = findAndWrap(str, ['javascript', 'typescript']);
	const splitStartCode = str.split('```' + language);
	const splitFinalArray: string[] = [];

	splitStartCode.forEach((e, i) => {
		if (i == 0 && !e.includes('```' + language)) {
			splitFinalArray.push(e);
		} else {
			const splitEndCode = e.split('```');
			const codeText = `<pre class="rounded-3 pt-0 pb-4"><code class="language-${language}" data-lang="html">${splitEndCode[0]}</code></pre>`;
			const codeTextAddLineBreaks = addLineBreaks(codeText, [';', '//']);
			splitFinalArray.push(codeTextAddLineBreaks);
			if (splitEndCode[1] && splitEndCode[1].length > 0) {
				splitFinalArray.push(`${splitEndCode[1]}`);
			}
		}
	});
	return splitFinalArray;
}

function addLineBreaks(code: string, symbols: string[]) {
	let formattedCode = '';

	for (let i = 0; i < code.length; i++) {
		formattedCode += code[i];

		if (symbols.includes(code[i] || '' + code[i + 1])) {
			formattedCode += '\n';
			i++;
		}
	}
	return formattedCode;
}

function findAndWrap(str: string, languages: string[]) {
	for (let lang of languages) {
		if (str.includes('```' + lang)) {
			return lang;
		}
	}
	return null;
}
