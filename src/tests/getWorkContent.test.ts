import getWorkContent from "../utils/getWorkContent";

test("get the content of the work", async () => {
  await expect(getWorkContent(35685640)).resolves.toEqual({
    chapters: [
      {
        chapterTitle: "",
        chapterSummary: "",
        chapterNotes: "",
        chapterContent: `<p>Vi and Caitlyn are gay </p><p>Lol</p><p>The end</p>`,
      },
    ],
    notes: {
      endNote: "Sorry if this got emotional",
      preNote: "See the end of the work for notes",
    },
  });
});
