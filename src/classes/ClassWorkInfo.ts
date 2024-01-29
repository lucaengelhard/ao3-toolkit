import {
  ArchiveWarning,
  Category,
  ChapterInformation,
  Character,
  Collection,
  Fandom,
  Rating,
  Relationship,
  SeriesInfo,
  Tag,
} from "../interfaces/InterfaceWorkInfo";
import User from "./ClassUser";

/**
 * Class that contains information about a single work.
 * @param options - can be an object with information about the work or a number that is the id of the work
 * @param options.title - string containing the title of the work
 * @param options.id - number that is the id of the work
 * @param options.author - Arry of {@link User} objects containing the name(s) of the author(s) and url(s) to the profile(s)
 * @param options.fandom - Array of {@link Fandom } objects associated with the work
 * @param options.stats - {@link WorkStats} Object containing information about the work like length, number of chapters, etc.
 * @param options.relationships - Array of {@link Relationship} objects associated with the work
 * @param options.characters - Array of {@link Character} objects associated with the work
 * @param options.rating - {@link Rating} Object detailing the Rating of the work
 * @param options.archiveWarnings - Array of {@link ArchiveWarning} objects detailing the Archvie Warnings associated with the work
 * @param options.tags - Array of {@link Tag} objects associated with the work
 * @param options.language - string containing the language code of the work (checked against {@link LanguageCodes} enum)
 * @param options.series - Array of {@link SeriesInfo} objects detailing what Series the work is part of and where in the Series it is positioned
 * @param options.collections - either an Array of {@link Collection} objects detailing what collections the work is part of or a the number of collections the work belongs to.
 * @param options.summary - string containing the summary of the work
 */

export default class WorkInfo {
  title?: string;
  id?: number;
  authors?: User[];
  fandom?: Fandom[];
  stats?: WorkStats;
  relationships?: Relationship[];
  characters?: Character[];
  rating?: Rating;
  archiveWarnings?: ArchiveWarning[];
  categories?: Category[];
  tags?: Tag[];
  language?: string;
  series?: SeriesInfo[];
  collections?: Collection[];
  summary?: string;
  constructor(
    options?:
      | {
          title?: string;
          id?: number;
          authors?: User[];
          fandom?: Fandom[];
          stats?: WorkStats;
          relationships?: Relationship[];
          characters?: Character[];
          rating?: Rating;
          archiveWarnings?: ArchiveWarning[];
          categories?: Category[];
          tags?: Tag[];
          language?: string;
          series?: SeriesInfo[];
          collections?: Collection[];
          summary?: string;
        }
      | number
  ) {
    if (options) {
      if (typeof options !== "number") {
        this.title = options.title;
        this.id = options.id;
        this.authors = options.authors;
        this.fandom = options.fandom;
        this.stats = options.stats;
        this.relationships = options.relationships;
        this.characters = options.characters;
        this.rating = options.rating;
        this.archiveWarnings = options.archiveWarnings;
        this.categories = options.categories;
        this.tags = options.tags;
        this.language = options.language;
        this.series = options.series;
        this.collections = options.collections;
        this.summary = options.summary;
      } else {
        this.id = options;
      }
    }
  }
}

/**
 * Class to define statistics of the individual work
 * @param input.words - number of words in the work
 * @param input.chapters - {@link ChapterInformation} detailing the number of written chapters and the maximum amount of chapters
 * @param input.kudos - number of kudos the work has
 * @param input.hits - number of hits the work has
 * @param input.bookmarks - number of bookmarks the work has
 * @param input.finished - optional parameter to indicate that the work is finished. If this is undefined, the constructor of the class checks the chapter object if the work is finished
 */
export class WorkStats {
  words: number;
  chapters: ChapterInformation;
  kudos: number;
  hits: number;
  bookmarks: number;
  finished: boolean;
  constructor(input: {
    words: number;
    chapters: ChapterInformation;
    kudos: number;
    hits: number;
    bookmarks: number;
    finished?: boolean;
  }) {
    this.words = input.words;
    this.chapters = input.chapters;
    this.kudos = input.kudos;
    this.hits = input.hits;
    this.bookmarks = input.bookmarks;
    if (!input.finished) {
      this.finished =
        this.chapters.chaptersWritten == this.chapters.chaptersMax;
    } else {
      this.finished = input.finished;
    }
  }
}
