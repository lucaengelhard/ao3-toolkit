import LoginSession from "./classes/ClassLoginSession.ts";
import User from "./classes/ClassUser.ts";
import Work from "./classes/ClassWork.ts";
import WorkInfo, { WorkStats } from "./classes/ClassWorkInfo.ts";
import WorkList from "./classes/ClassWorkList.ts";
import WorkUserData from "./classes/ClassWorkUserData.ts";
import { axiosDefaults } from "./config/axiosDefaults.ts";
import { LanguageCodes } from "./config/LanguageCodes.ts";

import type { Login } from "./types/TypesUserData.ts";
import type { Notes, Chapter, WorkContent } from "./types/TypesWorkContent.ts";
import type {
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
} from "./types/TypesWorkInfo.ts";
import type { Listtype, PageSpan } from "./types/TypesWorkList.ts";
import type { WorkHistory, WorkBookmark } from "./types/TypesWorkUsersData.ts";
import getWorkContent from "./utils/getWorkContent.ts";
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
} from "./utils/getWorkInfo.ts";
import getWorkList from "./utils/getWorkList.ts";
import { getParsableInfodata, getPageNumber } from "./utils/helpers.ts";
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
export type {
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
};
