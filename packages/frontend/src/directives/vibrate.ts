/*
 * SPDX-FileCopyrightText: noridev and other cherrypick contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { Directive } from 'vue';
import { vibrate } from '@/scripts/vibrate.js';

export default {
	mounted(el, binding) {
		const pattern = (binding.value as VibratePattern) ?? 20;
		el.addEventListener('mousedown', () => {
			vibrate(pattern);
		});
	},
} as Directive;
