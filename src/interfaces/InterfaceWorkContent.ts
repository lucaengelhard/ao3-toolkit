//TODO: Write Docs (https://www.notion.so/Write-Docs-5a4f9a187ce74604b27f079919a8f47a)
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
