/*
 * jQuery Highlight plugin
 *
 * Based on highlight v3 by Johann Burkard
 * http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
 *
 * Code a little bit refactored and cleaned (in my humble opinion).
 * Most important changes:
 *  - highlights whole words only, case sensitive
 *  - element tag and class names can be specified in options
 *
 * Usage:
 *   // wrap every occurrance of word 'lorem' in content
 *   // with <span class='highlight'> (default options)
 *   $('#content').highlight('lorem');
 *
 *   // can search for and highlight more words at once
 *   // so you can save some time on traversing DOM
 *   $('#content').highlight(['lorem', 'ipsum']);
 *   $('#content').highlight('lorem ipsum');
 *
 *   // wrap every occurrance of word 'ipsun' in content
 *   // with <em class='important'>
 *   $('#content').highlight('ipsum', { element: 'em', className: 'important' });
 *
 *   // remove default highlight
 *   $('#content').removeHighlight();
 *
 *   // remove custom highlight
 *   $('#content').removeHighlight({ element: 'em', className: 'important' });
 *
 *
 * Copyright (c) 2009 Bartek Szopka
 *
 * Licensed under MIT license.
 *
 */

jQuery.extend({
	highlight: function(node, re, nodeName, className) {
		if (node.nodeType === 3) {
			var match = node.data.match(re);
			if (match) {
				var highlight = document.createElement(nodeName || 'span');
				highlight.className = className || 'highlight';
				var wordNode = node.splitText(match.index);
				wordNode.splitText(match[0].length);
				var wordClone = wordNode.cloneNode(true);
				highlight.appendChild(wordClone);
				wordNode.parentNode.replaceChild(highlight, wordNode);
				return 1; //skip added node in parent
			}
		} else if ((node.nodeType === 1 && node.childNodes) // only element nodes that have children
				&& !/(script|style)/i.test(node.tagName) // ignore script and style nodes
				&& !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
			for (var i = 0; i < node.childNodes.length; ++i) {
				i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
			}
		}
		return 0;
	}
});

jQuery.fn.removeHighlight = function(options) {
	var settings = { className: 'highlight', element: 'span' };
	jQuery.extend(settings, options);

	return this.find(settings.element + "." + settings.className).each(function() {
		var parent = this.parentNode;
		parent.replaceChild(this.firstChild, this);
		parent.normalize();
	}).end();
};

jQuery.fn.highlight = function(words, options) {
	var settings = { className: 'highlight', element: 'span', ignoreCase: false, wordsOnly: false };
	jQuery.extend(settings, options);
	
	if (words.constructor === String) { words = words.split(/\s+/); }

	var flag = settings.ignoreCase ? "i" : "";
	var pattern = "(" + words.join("|") + ")";
	if (settings.wordsOnly) {
		pattern = "\\b" + pattern + "\\b";
	}
	var re = new RegExp(pattern, flag);
	
	return this.each(function(){ jQuery.highlight(this, re, settings.element, settings.className );});
};

