"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Fanfiction_title, _Fanfiction_id, _Fanfiction_author, _Fanfiction_fandom, _Fanfiction_words, _Fanfiction_chapters, _Fanfiction_relationships, _Fanfiction_characters, _Fanfiction_tags, _Fanfiction_language, _Fanfiction_timesVisited, _Fanfiction_lastVisit, _Fanfiction_content;
class Fanfiction {
    constructor(title, id, author, fandom, words, chapters, relationships, characters, tags, language, timesVisited, lastVisit, content) {
        _Fanfiction_title.set(this, void 0);
        _Fanfiction_id.set(this, void 0);
        _Fanfiction_author.set(this, void 0);
        _Fanfiction_fandom.set(this, void 0);
        _Fanfiction_words.set(this, void 0);
        _Fanfiction_chapters.set(this, void 0);
        _Fanfiction_relationships.set(this, void 0);
        _Fanfiction_characters.set(this, void 0);
        _Fanfiction_tags.set(this, void 0);
        _Fanfiction_language.set(this, void 0);
        _Fanfiction_timesVisited.set(this, void 0);
        _Fanfiction_lastVisit.set(this, void 0);
        _Fanfiction_content.set(this, void 0);
        __classPrivateFieldSet(this, _Fanfiction_title, title, "f");
        __classPrivateFieldSet(this, _Fanfiction_id, id, "f");
        __classPrivateFieldSet(this, _Fanfiction_author, author, "f");
        __classPrivateFieldSet(this, _Fanfiction_fandom, fandom, "f");
        __classPrivateFieldSet(this, _Fanfiction_words, words, "f");
        __classPrivateFieldSet(this, _Fanfiction_chapters, chapters, "f");
        __classPrivateFieldSet(this, _Fanfiction_relationships, relationships, "f");
        __classPrivateFieldSet(this, _Fanfiction_characters, characters, "f");
        __classPrivateFieldSet(this, _Fanfiction_tags, tags, "f");
        __classPrivateFieldSet(this, _Fanfiction_language, language, "f");
        __classPrivateFieldSet(this, _Fanfiction_timesVisited, timesVisited, "f");
        __classPrivateFieldSet(this, _Fanfiction_lastVisit, lastVisit, "f");
        __classPrivateFieldSet(this, _Fanfiction_content, content, "f");
    }
    get title() {
        return __classPrivateFieldGet(this, _Fanfiction_title, "f");
    }
    get id() {
        return __classPrivateFieldGet(this, _Fanfiction_id, "f");
    }
    get author() {
        return __classPrivateFieldGet(this, _Fanfiction_author, "f");
    }
    get fandom() {
        return __classPrivateFieldGet(this, _Fanfiction_fandom, "f");
    }
    get words() {
        return __classPrivateFieldGet(this, _Fanfiction_words, "f");
    }
    get chapters() {
        return __classPrivateFieldGet(this, _Fanfiction_chapters, "f");
    }
    get relationships() {
        return __classPrivateFieldGet(this, _Fanfiction_relationships, "f");
    }
    get characters() {
        return __classPrivateFieldGet(this, _Fanfiction_characters, "f");
    }
    get tags() {
        return __classPrivateFieldGet(this, _Fanfiction_tags, "f");
    }
    get language() {
        return __classPrivateFieldGet(this, _Fanfiction_language, "f");
    }
    get timesVisited() {
        return __classPrivateFieldGet(this, _Fanfiction_timesVisited, "f");
    }
    get lastVisit() {
        return __classPrivateFieldGet(this, _Fanfiction_lastVisit, "f");
    }
    get content() {
        return __classPrivateFieldGet(this, _Fanfiction_content, "f");
    }
    get ratio() {
        return __classPrivateFieldGet(this, _Fanfiction_chapters, "f") / __classPrivateFieldGet(this, _Fanfiction_timesVisited, "f");
    }
}
_Fanfiction_title = new WeakMap(), _Fanfiction_id = new WeakMap(), _Fanfiction_author = new WeakMap(), _Fanfiction_fandom = new WeakMap(), _Fanfiction_words = new WeakMap(), _Fanfiction_chapters = new WeakMap(), _Fanfiction_relationships = new WeakMap(), _Fanfiction_characters = new WeakMap(), _Fanfiction_tags = new WeakMap(), _Fanfiction_language = new WeakMap(), _Fanfiction_timesVisited = new WeakMap(), _Fanfiction_lastVisit = new WeakMap(), _Fanfiction_content = new WeakMap();
const fic1 = new Fanfiction("titel", 1234, "Luca", ["Harry Potter", "other Fandom"], 13000, 10, ["Hermione Ganger/Harry Potter"], ["Harry Potter", "Hermione Granger"], ["test"], "English", 3, "", "");
console.log(fic1.ratio);
