import Script from "../../lib/parser/script";

function setup() {
  const data = { data1: "data1", data2: "data2" };
  const props = { prop1: "prop1", prop2: "prop2" };
  const components = { comp1: "comp1", comp2: "comp2" };
  const json = { data, props, components };
  const str = JSON.stringify(json);
  const file = `<script>module.exports = ${str};</script>`;
  const parsed = new Script().parse(file);
  return { data, props, components, str, file, parsed };
}

describe("ScriptParser", () => {
  test("loads data", () => {
    const { parsed, data } = setup();
    expect(parsed).toEqual(expect.objectContaining({ data }));
  });

  test("loads props", () => {
    const { parsed, props } = setup();
    expect(parsed).toEqual(expect.objectContaining({ props }));
  });

  test("loads components", () => {
    const { parsed, components } = setup();
    expect(parsed).toEqual(expect.objectContaining({ components }));
  });
});
