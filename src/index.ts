import LoginSession from "./classes/ClassLoginSession";
import User from "./classes/ClassUser";
import Work from "./classes/ClassWork";
import WorkInfo, { WorkStats } from "./classes/ClassWorkInfo";
import WorkList from "./classes/ClassWorkList";
import WorkUserData from "./classes/ClassWorkUserData";
import { axiosDefaults } from "./config/axiosDefaults";
import { LanguageCodes } from "./config/LanguageCodes";

import { Login } from "./types/TypesUserData";
import { Notes, Chapter, WorkContent } from "./types/TypesWorkContent";
import {
  Fandom,
  Relationship,
  Character,
  Rating,
  ArchiveWarning,
  Category,
  Tag,
  SeriesInfo,
  Collection,
  ChapterInformation,
} from "./types/TypesWorkInfo";
import { Listtype, PageSpan } from "./types/TypesWorkList";
import { WorkHistory, WorkBookmark } from "./types/TypesWorkUsersData";
import getWorkContent from "./utils/getWorkContent";
import getWorkInfo, {
  getArchiveWarnings,
  getAuthor,
  getCategories,
  getCharacter,
  getCollections,
  getFandom,
  getLanguage,
  getRating,
  getRelationship,
  getSeries,
  getSummary,
  getTags,
  getTitle,
  getWorkStats,
} from "./utils/getWorkInfo";
import getWorkList from "./utils/getWorkList";
import { getParsableInfodata, getPageNumber } from "./utils/helpers";
import "dotenv/config";

export {
  LoginSession,
  User,
  Work,
  WorkInfo,
  WorkStats,
  WorkList,
  WorkUserData,
  axiosDefaults,
  LanguageCodes,
  Listtype,
  Login,
  WorkContent,
  Notes,
  Chapter,
  Fandom,
  Relationship,
  Character,
  Rating,
  ArchiveWarning,
  Category,
  Tag,
  SeriesInfo,
  Collection,
  ChapterInformation,
  PageSpan,
  WorkHistory,
  WorkBookmark,
  getWorkContent,
  getWorkInfo,
  getTitle,
  getAuthor,
  getFandom,
  getRelationship,
  getCharacter,
  getRating,
  getArchiveWarnings,
  getCategories,
  getTags,
  getLanguage,
  getSeries,
  getCollections,
  getSummary,
  getWorkStats,
  getWorkList,
  getParsableInfodata,
  getPageNumber,
};
