export function linkToAbsolute(link: string | undefined) {
  //Checks if Link is absolute, if not returns absolute link

  if (typeof link == "undefined") {
    return link;
  }

  var regex = new RegExp("^(?:[a-z+]+:)?//", "i");
  if (!regex.test(link)) {
    return `https://archiveofourown.org${link}`;
  }
  return link;
}
