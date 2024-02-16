/**
 * WorkConten is an object containing of the {@link Notes} at the beginning and the end of the work and an array of {@link Chapter}s
 */
export default interface WorkContent {
  notes: Notes;
  chapters: Chapter[];
}

export interface Notes {
  preNote: string;
  endNote: string;
}

export interface Chapter {
  chapterTitle?: string;
  chapterSummary?: string;
  chapterNotes?: string;
  chapterContent?: string | null;
}
