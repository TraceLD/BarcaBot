import { sanitiseAccents } from "../../utils/string-utils";

test("Should sanitise a non-sanitised string", () => {
  expect(sanitiseAccents("Carles Aleñá")).toBe("Carles Alena");
});

test("Should leave an already sanitised string the same", () => {
  expect(sanitiseAccents("Carles Alena")).toBe("Carles Alena");
});
