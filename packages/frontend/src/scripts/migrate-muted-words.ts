
export type WordMute = {
	version: number;
	categories: Array<{ name: string; filters: Array<string | string[]> }>;
};
const currentVersion = 1;

export function migrateMutedWords(
	wordMute: WordMute['categories'][0]['filters'] | WordMute,
): WordMute|null {
	let version = 0;
	if (typeof wordMute === 'object') {
		version = (wordMute as WordMute).version;
	}
	if (version === currentVersion) {
		return null;
	}

	const newData = {} as WordMute;
	if (version === 0) {
		newData.categories = [{
			name: 'Default',
			filters: wordMute as WordMute['categories'][0]['filters'],
		}];
		newData.version = 1;
	}
	return newData;
}
