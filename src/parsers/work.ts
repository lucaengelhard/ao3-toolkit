import { AsyncResult, Err, Ok, Result } from "@joyful/result";

interface WorkInfo {
  title: string;
}

export async function getWorkInfo(
  workID: number
): Promise<Result<WorkInfo, string>> {
  return new Ok({ title: "placeholder" });
}

export async function fetchWorkHTML(workID: number) {
  const res = await fetch(`https://archiveofourown.org/works/${workID}`);

  if (res.status !== 200)
    return new Err(`Error while fetching work with ID: ${workID}: ${res.text}`);
}
