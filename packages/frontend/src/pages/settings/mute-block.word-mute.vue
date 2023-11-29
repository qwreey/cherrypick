<!--
SPDX-FileCopyrightText: syuilo and other misskey, cherrypick contributors
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div class="_gaps_m">
	<div v-for="category in $i!.mutedWords.categories">
		<div :class="$style.itemMain">
			<!-- :to="userPage(item.mutee)" -->
			<div>{{ category.name }}</div>
			<button class="_button" :class="$style.editToggle" @click="toggleMuteItem(item)"><i :class="$style.chevron" class="ti ti-edit"></i></button>
			<button class="_button" :class="$style.remove" @click="remove(categories)"><i class="ti ti-x"></i></button>
		</div>
	</div>
	<MkButton primary inline @click="saveMutedWords()"><i class="ti ti-add"></i> {{ i18n.ts.add }}</MkButton>
	<!-- <div>

	</div>
	<MkButton primary inline :disabled="!changed" @click="save()"><i class="ti ti-device-floppy"></i> {{ i18n.ts.save }}</MkButton>
	<div>
		<MkTextarea v-model="mutedWords">
			<span>{{ i18n.ts._wordMute.muteWords }}</span>
			<template #caption>{{ i18n.ts._wordMute.muteWordsDescription }}<br>{{ i18n.ts._wordMute.muteWordsDescription2 }}</template>
		</MkTextarea>
	</div>
	<MkButton primary inline :disabled="!changed" @click="save()"><i class="ti ti-device-floppy"></i> {{ i18n.ts.save }}</MkButton> -->
</div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import MkTextarea from '@/components/MkTextarea.vue';
import MkButton from '@/components/MkButton.vue';
import * as os from '@/os.js';
import { i18n } from '@/i18n.js';

const props = defineProps<{
	muted: (string[] | string)[];
}>();

const emit = defineEmits<{
	(ev: 'save', value: (string[] | string)[]): void;
}>();

const render = (mutedWords) => mutedWords.map(x => {
	if (Array.isArray(x)) {
		return x.join(' ');
	} else {
		return x;
	}
}).join('\n');

const mutedWords = ref(props.muted);
const changed = ref(false);

watch(mutedWords, () => {
	changed.value = true;
});

async function save() {
	const parseMutes = (mutes) => {
		// split into lines, remove empty lines and unnecessary whitespace
		let lines = mutes.trim().split('\n').map(line => line.trim()).filter(line => line !== '');

		// check each line if it is a RegExp or not
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const regexp = line.match(/^\/(.+)\/(.*)$/);
			if (regexp) {
				// check that the RegExp is valid
				try {
					new RegExp(regexp[1], regexp[2]);
					// note that regex lines will not be split by spaces!
				} catch (err: any) {
					// invalid syntax: do not save, do not reset changed flag
					os.alert({
						type: 'error',
						title: i18n.ts.regexpError,
						text: i18n.t('regexpErrorDescription', { tab: 'word mute', line: i + 1 }) + '\n' + err.toString(),
					});
					// re-throw error so these invalid settings are not saved
					throw err;
				}
			} else {
				lines[i] = line.split(' ');
			}
		}

		return lines;
	};

	let parsed;
	try {
		parsed = parseMutes(mutedWords.value);
	} catch (err) {
		// already displayed error message in parseMutes
		return;
	}

	emit('save', parsed);

	changed.value = false;
}
</script>

<style lang="scss" module>


</style>
