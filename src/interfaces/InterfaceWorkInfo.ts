import User from "../classes/ClassUser";

export interface Title {
  title: string;
}

export interface Authors {
  author: User[];
}

export interface Fandom {
  fandomName: string;
  fandomLink: string | undefined;
}

export interface Relationship {
  relationshipName: string;
  relationshipLink: string | undefined;
}

export interface Character {
  characterName: string;
  characterLink: string | undefined;
}

export interface Rating {
  rating: {
    ratingName: string;
    ratingLink: string | undefined;
  };
}

export interface ArchiveWarning {
  warningName: string;
  warningLink: string | undefined;
}

export interface Category {
  categoryName: string;
  categoryLink: string | undefined;
}

export interface Tag {
  tagName: string;
  tagLink: string | undefined;
}

export interface Language {
  language: string;
}

export interface Summary {
  summary: string;
}

export interface SeriesInfo {
  seriesName: string;
  seriesLink: string | undefined;
  seriesPart: number;
}

export interface Collection {
  collectionName: string;
  collectionLink: string | undefined;
}

export interface ChapterInformation {
  chaptersWritten: number;
  chaptersMax: number;
}
