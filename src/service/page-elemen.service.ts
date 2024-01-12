export type ElementType = HTMLDivElement;
export type RunFunction = () => void;

export interface IElementAction {
	error: boolean;
	content: string;
}

export interface IСhecked {
	error: boolean;
	content: boolean | string;
}

export interface IPageElement extends IElementAction {
	element?: ElementType;
}

export class PageElementService {
	constructor(public selector: string) {
		this.node = this.getElement();
	}

	node: IPageElement;

	getElement = (): IPageElement => {
		try {
			const element = document.querySelector(this.selector) as ElementType;
			if (!element) {
				throw new Error(`Элемент ${this.selector} не найден`);
			} else {
				return { element: element, content: 'Элемент получен', error: false };
			}
		} catch (error) {
			return { error: true, content: `${error}` };
		}
	};

	public getTextContent = (): IElementAction => {
		try {
			if (this.node.error) throw new Error(this.node.content);
			let textContent: string = '';
			if (this.node.element && this.node.element.textContent) {
				textContent = this.node.element.textContent;
			}
			return { error: false, content: textContent };
		} catch (error) {
			return { error: true, content: `${error}` };
		}
	};

	public setTextContent(value: string | number): IElementAction {
		try {
			if (this.node.error && !this.node.element) throw new Error(this.node.content);
			if (!this.node.element) throw new Error(this.node.content);
			this.node.element.textContent = String(value);
			return { error: false, content: `Значение: ${value} - записано` };
		} catch (error) {
			return { error: true, content: `${error}` };
		}
	}

	addEvent(runFunction: RunFunction, typeEvent?: 'click' | 'focus' | 'input'| 'blur') {
		try {
			if (this.node.error) throw new Error(this.node.content);
			if (!this.node.element) throw new Error(this.node.content);
			this.node.element.addEventListener(typeEvent || 'click', () => {
				runFunction();
			});
			return { error: false, content: `Событие добалено` };
		} catch (error) {
			return { error: true, content: `${error}` };
		}
	}

	public hide(hideStatus: boolean, display: '' | 'grid' | 'flex' = '') {
		try {
			if (this.node.error) throw new Error(this.node.content);
			if (!this.node.element) throw new Error(this.node.content);
			const status = hideStatus ? 'none' : display;
			this.node.element.style.display = status;
			return { error: false, content: `Элемент срыт: ${hideStatus}` };
		} catch (error) {
			return { error: true, content: `${error}` };
		}
	}

	public addHTML(html: string, rewrite?: boolean) {
		try {
			console.log(this.node);
			if (this.node.error) throw new Error(this.node.content);
			if (!this.node.element) throw new Error(this.node.content);

			if (!rewrite) this.node.element.innerHTML += html;
			if (rewrite) this.node.element.innerHTML = html;

			return { error: false, content: `Добавлен HTML: ${html.slice(0, 10)}...` };
		} catch (error) {
			return { error: true, content: `${error}` };
		}
	}

	public getValue = (): IElementAction => {
		try {
			if (this.node.error) throw new Error(this.node.content);
			let textContent: string = '';
			const el = this.node.element;

			if (el && 'value' in el && typeof el.value === 'string' && el.value.length > 0) {
				textContent = el.value;
			} else {
				throw new Error('Значение value не заданно');
			}
			return { error: false, content: textContent };
		} catch (error) {
			return { error: true, content: `${error}` };
		}
	};

	public setValue = (content: string): IElementAction => {
		try {
			if (this.node.error) throw new Error(this.node.content);
			const el = this.node.element;

			if (el && 'value' in el && typeof el.value === 'string') {
				el.value = content;
			} else {
				throw new Error('Значение value не заданно');
			}
			return { error: false, content: `Значение value: ${content} заданно` };
		} catch (error) {
			return { error: true, content: `${error}` };
		}
	};

	public isChecked = (): IСhecked => {
		try {
			if (this.node.error) throw new Error(this.node.content);

			const el = this.node.element;
			let isChecked;

			if (el && 'checked' in el && typeof el.checked === 'boolean') {
				isChecked = el.checked;
			} else {
				throw new Error('Значение value не заданно');
			}
			return { error: false, content: isChecked };
		} catch (error) {
			return { error: true, content: `${error}` };
		}
	};
}
