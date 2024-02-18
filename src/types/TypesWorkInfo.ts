export type Fandom = {
  fandomName: string;
  fandomLink: string | undefined;
};

export type Relationship = {
  relationshipName: string;
  relationshipLink: string | undefined;
};

export type Character = {
  characterName: string;
  characterLink: string | undefined;
};

export type Rating = {
  ratingName: string;
  ratingLink: string | undefined;
};

export type ArchiveWarning = {
  warningName: string;
  warningLink: string | undefined;
};

export type Category = {
  categoryName: string;
  categoryLink: string | undefined;
};

export type Tag = {
  tagName: string;
  tagLink: string | undefined;
};

export type SeriesInfo = {
  seriesName: string;
  seriesLink: string | undefined;
  seriesPart: number;
};

export type Collection = {
  collectionName: string;
  collectionLink: string | undefined;
};

export type ChapterInformation = {
  chaptersWritten: number;
  chaptersMax: number;
};
