/**
 * WorkConten is an object containing of the {@link Notes} at the beginning and the end of the work and an array of {@link Chapter}s
 */
export type WorkContent = {
  notes: Notes;
  chapters: Chapter[];
};

export type Notes = {
  preNote: string;
  endNote: string;
};

export type Chapter = {
  chapterTitle?: string;
  chapterSummary?: string;
  chapterNotes?: string;
  chapterContent?: string | null;
};
