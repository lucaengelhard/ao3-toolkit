import LoginSession from "./classes/ClassLoginSession";
import User from "./classes/ClassUser";
import Work from "./classes/ClassWork";
import WorkInfo, { WorkStats } from "./classes/ClassWorkInfo";
import WorkList from "./classes/ClassWorkList";
import WorkUserData from "./classes/ClassWorkUserData";
import { axiosDefaults } from "./config/axiosDefaults";
import { LanguageCodes } from "./enums/EnumLanguageCodes";
import { Listtype } from "./enums/EnumWorkLists";
import { Login } from "./interfaces/InterfaceUserData";
import WorkContent, { Notes, Chapter } from "./interfaces/InterfaceWorkContent";
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
} from "./interfaces/InterfaceWorkInfo";
import { PageSpan } from "./interfaces/InterfaceWorkList";
import { WorkHistory, WorkBookmark } from "./interfaces/InterfaceWorkUsersData";
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

//TODO: Create Object
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
