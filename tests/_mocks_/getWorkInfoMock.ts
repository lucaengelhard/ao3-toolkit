import fs from "fs";

export const mockWorkInfoResponse = {
  status: 200,
  data: fs.readFileSync("./tests/_mocks_/getWorkInfoMock.html", "utf-8"),
};

export const mockWorkInfo = {
  title: "In The Forest Of Dean",
  id: undefined,
  authors: [
    {
      username: "T3Tohru",
      userLink: "https://archiveofourown.org/users/T3Tohru/pseuds/T3Tohru",
      logindata: undefined,
      pseuds: undefined,
    },
  ],
  fandom: [
    {
      fandomName: "Harry Potter - J. K. Rowling",
      fandomLink:
        "https://archiveofourown.org/tags/Harry%20Potter%20-%20J*d*%20K*d*%20Rowling/works",
    },
  ],
  stats: {
    words: 961329,
    chapters: { chaptersWritten: 87, chaptersMax: 87 },
    kudos: 6993,
    hits: 549840,
    bookmarks: 2083,
    finished: true,
  },
  relationships: [
    {
      relationshipName: "Hermione Granger/Harry Potter",
      relationshipLink:
        "https://archiveofourown.org/tags/Hermione%20Granger*s*Harry%20Potter/works",
    },
    {
      relationshipName: "Susan Bones/Ginny Weasley",
      relationshipLink:
        "https://archiveofourown.org/tags/Susan%20Bones*s*Ginny%20Weasley/works",
    },
  ],
  characters: [
    {
      characterName: "Hermione Granger",
      characterLink:
        "https://archiveofourown.org/tags/Hermione%20Granger/works",
    },
    {
      characterName: "Harry Potter",
      characterLink: "https://archiveofourown.org/tags/Harry%20Potter/works",
    },
    {
      characterName: "Ron Weasley",
      characterLink: "https://archiveofourown.org/tags/Ron%20Weasley/works",
    },
    {
      characterName: "Ginny Weasley",
      characterLink: "https://archiveofourown.org/tags/Ginny%20Weasley/works",
    },
    {
      characterName: "Arthur Weasley",
      characterLink: "https://archiveofourown.org/tags/Arthur%20Weasley/works",
    },
    {
      characterName: "Molly Weasley",
      characterLink: "https://archiveofourown.org/tags/Molly%20Weasley/works",
    },
    {
      characterName: "Susan Bones",
      characterLink: "https://archiveofourown.org/tags/Susan%20Bones/works",
    },
    {
      characterName: "Luna Lovegood",
      characterLink: "https://archiveofourown.org/tags/Luna%20Lovegood/works",
    },
    {
      characterName: "Fred Weasley",
      characterLink: "https://archiveofourown.org/tags/Fred%20Weasley/works",
    },
    {
      characterName: "George Weasley",
      characterLink: "https://archiveofourown.org/tags/George%20Weasley/works",
    },
    {
      characterName: "Severus Snape",
      characterLink: "https://archiveofourown.org/tags/Severus%20Snape/works",
    },
    {
      characterName: "Kingsley Shacklebolt",
      characterLink:
        "https://archiveofourown.org/tags/Kingsley%20Shacklebolt/works",
    },
    {
      characterName: "Portrait Phineas Nigellus Black",
      characterLink:
        "https://archiveofourown.org/tags/Portrait%20Phineas%20Nigellus%20Black/works",
    },
    {
      characterName: "Bill Weasley",
      characterLink: "https://archiveofourown.org/tags/Bill%20Weasley/works",
    },
    {
      characterName: "Remus Lupin",
      characterLink: "https://archiveofourown.org/tags/Remus%20Lupin/works",
    },
    {
      characterName: "Original Characters",
      characterLink:
        "https://archiveofourown.org/tags/Original%20Characters/works",
    },
    {
      characterName: "Fleur Delacour",
      characterLink: "https://archiveofourown.org/tags/Fleur%20Delacour/works",
    },
  ],
  rating: {
    ratingName: "Explicit",
    ratingLink: "https://archiveofourown.org/tags/Explicit/works",
  },
  archiveWarnings: [
    {
      warningName: "Creator Chose Not To Use Archive Warnings",
      warningLink:
        "https://archiveofourown.org/tags/Choose%20Not%20To%20Use%20Archive%20Warnings/works",
    },
  ],
  categories: [
    {
      categoryName: "F/M",
      categoryLink: "https://archiveofourown.org/tags/F*s*M/works",
    },
    {
      categoryName: "F/F",
      categoryLink: "https://archiveofourown.org/tags/F*s*F/works",
    },
  ],
  tags: [
    {
      tagName: "Canon Related",
      tagLink: "https://archiveofourown.org/tags/Canon%20Related/works",
    },
    {
      tagName: "Violence",
      tagLink: "https://archiveofourown.org/tags/Violence/works",
    },
    {
      tagName: "Dark",
      tagLink: "https://archiveofourown.org/tags/Dark/works",
    },
    {
      tagName: "My First Work in This Fandom",
      tagLink:
        "https://archiveofourown.org/tags/My%20First%20Work%20in%20This%20Fandom/works",
    },
    {
      tagName: "Horcrux Hunting",
      tagLink: "https://archiveofourown.org/tags/Horcrux%20Hunting/works",
    },
    {
      tagName: "Book 7: Harry Potter and the Deathly Hallows",
      tagLink:
        "https://archiveofourown.org/tags/Book%207:%20Harry%20Potter%20and%20the%20Deathly%20Hallows/works",
    },
    {
      tagName: "Battle of Hogwarts",
      tagLink: "https://archiveofourown.org/tags/Battle%20of%20Hogwarts/works",
    },
    {
      tagName: "Werewolves",
      tagLink: "https://archiveofourown.org/tags/Werewolves/works",
    },
    {
      tagName: "Family Drama",
      tagLink: "https://archiveofourown.org/tags/Family%20Drama/works",
    },
    {
      tagName: "Coming Out",
      tagLink: "https://archiveofourown.org/tags/Coming%20Out/works",
    },
    {
      tagName: "Some Humor",
      tagLink: "https://archiveofourown.org/tags/Some%20Humor/works",
    },
    {
      tagName: "Character Death",
      tagLink: "https://archiveofourown.org/tags/Character%20Death/works",
    },
    {
      tagName: "Blood and Injury",
      tagLink: "https://archiveofourown.org/tags/Blood%20and%20Injury/works",
    },
    {
      tagName: "Interrogation",
      tagLink: "https://archiveofourown.org/tags/Interrogation/works",
    },
    {
      tagName: "Implied/Referenced Rape/Non-con",
      tagLink:
        "https://archiveofourown.org/tags/Implied*s*Referenced%20Rape*s*Non-con/works",
    },
    {
      tagName: "POV Multiple",
      tagLink: "https://archiveofourown.org/tags/POV%20Multiple/works",
    },
    {
      tagName: "Dark Magic",
      tagLink: "https://archiveofourown.org/tags/Dark%20Magic/works",
    },
    {
      tagName: "Not Epilogue Compliant",
      tagLink:
        "https://archiveofourown.org/tags/Not%20Epilogue%20Compliant/works",
    },
    {
      tagName: "Serious Injuries",
      tagLink: "https://archiveofourown.org/tags/Serious%20Injuries/works",
    },
    {
      tagName: "Serious",
      tagLink: "https://archiveofourown.org/tags/Serious/works",
    },
    {
      tagName: "Strong Hermione Granger",
      tagLink:
        "https://archiveofourown.org/tags/Strong%20Hermione%20Granger/works",
    },
    {
      tagName: "Strong Harry Potter",
      tagLink: "https://archiveofourown.org/tags/Strong%20Harry%20Potter/works",
    },
    {
      tagName: "Hermione Granger-centric",
      tagLink:
        "https://archiveofourown.org/tags/Hermione%20Granger-centric/works",
    },
    {
      tagName: "Permanently broken Golden Trio",
      tagLink:
        "https://archiveofourown.org/tags/Permanently%20broken%20Golden%20Trio/works",
    },
    {
      tagName: "Wandless Magic (Harry Potter)",
      tagLink:
        "https://archiveofourown.org/tags/Wandless%20Magic%20(Harry%20Potter)/works",
    },
    {
      tagName: "Canon LGBTQ Character",
      tagLink:
        "https://archiveofourown.org/tags/Canon%20LGBTQ%20Character/works",
    },
    {
      tagName: "Original Character(s)",
      tagLink: "https://archiveofourown.org/tags/Original%20Character(s)/works",
    },
    {
      tagName: "Dark Magic Has Consequences",
      tagLink:
        "https://archiveofourown.org/tags/Dark%20Magic%20Has%20Consequences/works",
    },
    {
      tagName: "T3Tohru's Relationship Kitchen Sink Challenge",
      tagLink:
        "https://archiveofourown.org/tags/T3Tohru's%20Relationship%20Kitchen%20Sink%20Challenge/works",
    },
  ],
  language: "English",
  series: [
    {
      seriesName: "In The Forest Of Dean Universe",
      seriesLink: "https://archiveofourown.org/series/2605207",
      seriesPart: 1,
    },
  ],
  collections: [
    {
      collectionName: "Harry Potter Fic",
      collectionLink:
        "https://archiveofourown.org/collections/Harry_Potter_Fic",
    },
    {
      collectionName: "Top 10%",
      collectionLink: "https://archiveofourown.org/collections/Top_Ten_Percent",
    },
    {
      collectionName: "The Best There Is",
      collectionLink:
        "https://archiveofourown.org/collections/The_Best_There_Is",
    },
    {
      collectionName: "Unforgettable best fics",
      collectionLink:
        "https://archiveofourown.org/collections/UnforgettableHPfics",
    },
    {
      collectionName: "Harry and Hermione Fics to save!",
      collectionLink:
        "https://archiveofourown.org/collections/HHRficCollection",
    },
    {
      collectionName: "Pensieve",
      collectionLink: "https://archiveofourown.org/collections/Pensieve",
    },
    {
      collectionName: "The town whispers of witchcraft",
      collectionLink:
        "https://archiveofourown.org/collections/Justice_Doesnt_Live_Here_Anymore",
    },
    {
      collectionName: "T3Tohru's Relationship Kitchen Sink Challenge",
      collectionLink:
        "https://archiveofourown.org/collections/T3Tohru_Relationship_Kitchen_Sink_Challenge",
    },
    {
      collectionName: "Harmony Must Read Completed Stories",
      collectionLink:
        "https://archiveofourown.org/collections/HarmonyMustReadStories",
    },
    {
      collectionName: "HP/HG smut",
      collectionLink: "https://archiveofourown.org/collections/HPandHGSmut",
    },
    {
      collectionName: "my heart is here",
      collectionLink: "https://archiveofourown.org/collections/myheartishere",
    },
    {
      collectionName: "Best of the Best HP Fics",
      collectionLink: "https://archiveofourown.org/collections/HPCollection394",
    },
    {
      collectionName: "HPTB",
      collectionLink: "https://archiveofourown.org/collections/HPTB",
    },
    {
      collectionName: "Fics I need to read ASAP",
      collectionLink:
        "https://archiveofourown.org/collections/Fics_I_need_to_read_ASAP",
    },
    {
      collectionName:
        "i suffer in eternity knowing these are better than canon",
      collectionLink:
        "https://archiveofourown.org/collections/changed_my_life_002",
    },
    {
      collectionName: "Better Potter than the books",
      collectionLink: "https://archiveofourown.org/collections/BestPotterOnWeb",
    },
    {
      collectionName: "Drown me in this fic I'll die happy",
      collectionLink:
        "https://archiveofourown.org/collections/DrownMeInThisIllDieHappy",
    },
    {
      collectionName: "finish that i like",
      collectionLink: "https://archiveofourown.org/collections/yerminadas",
    },
    {
      collectionName:
        "loveyrground's BOAThouse Bookshelf: Best of All Time\n" +
        "                    Fics",
      collectionLink:
        "https://archiveofourown.org/collections/bmwboathousebookshelf",
    },
  ],
  summary:
    "\n" +
    "                      A complete rewrite of Book Seven with a darker and more\n" +
    "                      dangerous outlook on war.\n" +
    "                    \n" +
    "\n" +
    "                      Mostly Hermione-centric. Mostly follows canon but provides\n" +
    "                      a different look at how the relationships in HP could have\n" +
    "                      formed had Hermione realized that she and Ron did not fit\n" +
    "                      well together and that Harry, her best friend, was really\n" +
    "                      what she was looking for the whole time. The story of what\n" +
    "                      could have happened between Harry and Hermione in the\n" +
    "                      Deathly Hallows after Ron leaves.\n" +
    "                    \n" +
    "\n" +
    "                      Features added subplots, alt POVs, OC characters, and a\n" +
    "                      gritty and realistic view of the war. HHR is the main\n" +
    "                      pairing, but this fic is about more than just their\n" +
    "                      relationship. It is a fully developed story about the war\n" +
    "                      following Hermione and her allies through the fight.\n" +
    "                    \n" +
    "\n" +
    "                      ‘So why are you still here?’ Harry asked Ron.‘Search\n" +
    "                      me,’ said Ron.‘Go home then,’ said Harry.‘Yeah,\n" +
    "                      maybe I will!’ shouted Ron, and he took several steps\n" +
    "                      towards Harry, who did not back away.\n" +
    "                    \n" +
    "\n" +
    "                      **This fic contains mature content, explicit language, and\n" +
    "                      is dark in nature. PLEASE READ THE TAGS. If you are\n" +
    "                      looking for nothing but fluff, you will not find it here.*\n" +
    "                    \n" +
    "COMPLETE\n" +
    "A Horcrux, a tent, and an explosion of emotion.",
};
