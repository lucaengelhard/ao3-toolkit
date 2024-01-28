import * as getWorkInfo from "../utils/getWorkInfo";

const workID = 19865440;

test("gets the title of the selected work", async () => {
  await expect(getWorkInfo.getTitle(workID)).resolves.toEqual({
    title: "In The Forest Of Dean",
  });
});

test("get Author(s) of the selected work", async () => {
  await expect(getWorkInfo.getAuthor(workID)).resolves.toEqual({
    author: [
      {
        username: "T3Tohru",
        userLink: "https://archiveofourown.org/users/T3Tohru/pseuds/T3Tohru",
      },
    ],
  });
});
