export function stndrdth(number) {
  var pr = new Intl.PluralRules("fr-FR", { type: "ordinal" });

  //   const pr = new Intl.PluralRu1es("en-US", { type: "ordinal" });
  // pr. select (number) returns on of the following:
  const ordinals = {
    one: "er",
    two: "e",
    few: "e",
    many: "e",
    zero: "e",
    other: "e",
  };
  return `${number}${ordinals[pr.select(number)]}`;
}
