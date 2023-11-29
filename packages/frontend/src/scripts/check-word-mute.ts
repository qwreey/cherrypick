/*
 * SPDX-FileCopyrightText: syuilo and other misskey, cherrypick contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { type WordMute } from './migrate-muted-words.js';
export type CheckWordMuteState = { filtered: boolean, categories: Array<WordMute['categories'][0]> }
export function checkWordMute(note: Record<string, any>, me: Record<string, any> | null | undefined, mutedWords: WordMute): CheckWordMuteState {
	const result: CheckWordMuteState = {
		filtered: false,
		categories: [],
	};

	// 自分自身
	if (me && (note.userId === me.id)) return result;

	if (mutedWords.categories.length > 0) {
		const text = ((note.cw ?? '') + '\n' + (note.text ?? '')).trim();

		if (text === '') return result;

		for (const category of mutedWords.categories) {
			for (const filter of category.filters) {
				if (Array.isArray(filter)) {
					// Clean up
					const filteredFilter = filter.filter(keyword => keyword !== '');
					if (filteredFilter.length === 0) continue;

					if (filteredFilter.every(keyword => text.includes(keyword))) {
						result.filtered = true;
						if (!result.categories.includes(category)) {
							result.categories.push(category);
						}
					}
				} else {
					// represents RegExp
					const regexp = filter.match(/^\/(.+)\/(.*)$/);

					// This should never happen due to input sanitisation.
					if (!regexp) continue;

					try {
						if (new RegExp(regexp[1], regexp[2]).test(text)) {
							result.filtered = true;
							if (!result.categories.includes(category)) {
								result.categories.push(category);
							}
						}
						continue;
					} catch (err) {
						// This should never happen due to input sanitisation.
						continue;
					}
				}
			}
		}
	}

	return result;
}
