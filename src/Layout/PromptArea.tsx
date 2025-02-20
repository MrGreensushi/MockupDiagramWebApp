import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RichTextarea, RichTextareaHandle } from "rich-textarea"
import PromptAreaMenu from "./PromptAreaMenu.tsx";
import Story from "../StoryElements/Story.ts";
import { StoryElementEnum, StoryElementEnumString } from "../StoryElements/StoryElement.ts";

type Position = {
	top: number;
	left: number;
	caret: number;
};

const MENTION_REGEX = /\B@([\-+\w]*)$/;

const MAX_LIST_LENGTH = 10;

function PromptArea(props: {
	initialText?: string,
	story: Story,
	setBlocks: (blocks: [string, StoryElementEnum | null][]) => void,
	onBlur?: () => void
}) {
	const ref = useRef<RichTextareaHandle>(null);
	const refApp = useRef(document.getElementsByClassName("App").item(0));
	const [text, setText] = useState(props.initialText ?? "");
	const [pos, setPos] = useState<Position | null>(null);
	const [index, setIndex] = useState<number>(0);

	const targetText = pos ? text.slice(0, pos.caret) : text;
	const match = pos && targetText.match(MENTION_REGEX);
	const name = match?.[1] ?? "";
	
	const elements = useMemo(() => props.story.getAll(), [props.story]);
	
	const filtered = useMemo(() =>
		elements
			.filter(element =>
				element[0].name.toLowerCase()
					.startsWith(name.toLowerCase()))
					.slice(0, MAX_LIST_LENGTH)
			.map(element => element[0].name)
		, [elements, name]);
	const filteredMap = useMemo(() =>
		elements
			.filter(element =>
				element[0].name.toLowerCase()
					.startsWith(name.toLowerCase()))
					.slice(0, MAX_LIST_LENGTH)
		, [elements, name]);
	
	const highlight_all = useMemo(() => {
		if (elements.length === 0) return /^$/;
		else return new RegExp("(" + elements.map(element => `@${element[0].name}`).join("|") + ")", "g")
	}, [elements]);
	
	const highlight_characters = useMemo(() => new RegExp(
		`(^${elements.filter(element => element[1] === StoryElementEnum.character)
			.map(element => `@${element[0].name}`)
			.join("|")}$)`
	), [elements])
	const highlight_objects = useMemo(() => new RegExp(
		`(^${elements.filter(element => element[1] === StoryElementEnum.object)
			.map(element => `@${element[0].name}`)
			.join("|")}$)`
	), [elements])
	const highlight_locations = useMemo(() => new RegExp(
		`(^${elements.filter(element => element[1] === StoryElementEnum.location)
			.map(element => `@${element[0].name}`)
			.join("|")}$)`
	), [elements])

	useEffect(() => setText(props.initialText ?? ""), [props.initialText]);

	const complete = (index: number) => {
		if (!ref.current || !pos) return;
		const selected = filtered[index];
		ref.current.setRangeText(
			`@${selected}`,
			pos.caret - name.length - 1,
			pos.caret,
			"end");
		setPos(null);
		setIndex(0);
	};

	const textSplitter = useCallback((text: string, spaces: boolean) => {
		const split = elements.length > 0 ? text.split(highlight_all) : [text];
		let retArr: string[];
		if (!spaces) retArr = split;
		else {
			retArr = split
				.reduce((acc, spl) => {
					if (spl.match(highlight_all))
						return acc.concat(spl);
					else
						return acc.concat(spl.split(/(\s)/g));
				}, new Array<string>())
		}
		return retArr.filter(s => !s.match(/^$/));
	}, [elements, highlight_all]);

	const mentionMatcher = useCallback((mention: string) => {
		if (mention.match(highlight_characters)) return StoryElementEnum.character;
		if (mention.match(highlight_objects)) return StoryElementEnum.object;
		if (mention.match(highlight_locations)) return StoryElementEnum.location;
		return null;
	}, [highlight_characters, highlight_objects, highlight_locations]);

	const renderer = useCallback((text: string) => {
		return textSplitter(text, true)
			.map((word, idx) => {
				if (word.startsWith("@")) {
					const mentionType = mentionMatcher(word);
					const mentionClass = `${mentionType === null ? "no" : StoryElementEnumString[mentionType]}-mention`
					return <span key={idx} className={mentionClass} style={{borderRadius: "3px" }}>{word}</span>
				}
				return word;
			}
		);
	}, [textSplitter, mentionMatcher]);

	return (
		<div className="prompt-area w-100 h-25">
			<RichTextarea
				ref={ref}
				value={text}
				style={{width:"100%", height:"100%", left:"0px"}}
				onBlur={props.onBlur}
				onChange={e => {
					setText(e.target.value);
					props.setBlocks(
						textSplitter(e.target.value, false)
						.filter(s => !s.match(/^ +$/))
						.map(s => s.startsWith("@") && s.match(highlight_all) ? [s.slice(1), mentionMatcher(s)] : [s, null])
					);
				}}
				onKeyDown={e => {
					if (!pos || !filtered.length) return;
					switch (e.code) {
						case "ArrowUp":
							e.preventDefault();
							const nextIndex = index <= 0 ? filtered.length - 1 : index - 1;
							setIndex(nextIndex);
						break;
						case "ArrowDown":
							e.preventDefault();
							const prevIndex = index >= filtered.length - 1 ? 0 : index + 1;
							setIndex(prevIndex);
						break;
						case "Enter":
						case "Tab":
							e.preventDefault();
							complete(index);
						break;
						case "Escape":
							e.preventDefault();
							setPos(null);
							setIndex(0);
						break;
						default:
							break;
					}
				}}
				onSelectionChange={r => {
					if (r.focused && MENTION_REGEX.test(text.slice(0, r.selectionStart))) {
						setPos({
							top: r.top + r.height,
							left: r.left,
							caret: r.selectionStart
						});
						setIndex(0);
					} else {
						setPos(null);
						setIndex(0);
					}
				}}>
				{renderer}
			</RichTextarea>
			{pos && refApp.current &&
				createPortal(
					<PromptAreaMenu
						top={pos.top}
						left={pos.left}
						elements={filteredMap}
						noElements={elements.length === 0}
						index={index}
						setIndex={setIndex}
						complete={complete} />,
					refApp.current)
			}
		</div>
	);
}

export default PromptArea;