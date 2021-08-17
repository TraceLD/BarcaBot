import stringUtils from "../../utils/string-utils";

test("Should sanitise a non-sanitised string", () => {
  expect(stringUtils.sanitiseAccents("Carles Aleñá")).toBe("Carles Alena");
});

test("Should leave an already sanitised string the same", () => {
  expect(stringUtils.sanitiseAccents("Carles Alena")).toBe("Carles Alena");
});
