import TemplateParser from "../../lib/parser/template";

const root = root => ({ root });
const div = (...children) => expect.objectContaining({ type: "element", name: "div", children });
const p = (...children) => expect.objectContaining({ type: "element", name: "p", children });
const text = text => expect.objectContaining({ type: "text", text });

describe("ScriptParser", () => {
  test("a single tag", async () => {
    const html = `<template><div>contents</div></template>`;
    const expectedJson = root(div(text("contents")));
    expect(new TemplateParser().parse(html)).toEqual(expectedJson);
  });

  test("a tag containing a tag", async () => {
    const html = `<template><div id="div"><p id="p">contents</p></div></template>`;
    const expectedJson = root(div(p(text("contents"))));
    expect(new TemplateParser().parse(html)).toEqual(expectedJson);
  });

  test("a tag containing a tag with the same tagname", async () => {
    const html = `<template><div><div>contents</div></div></template>`;
    const expectedJson = root(div(div(text("contents"))));
    expect(new TemplateParser().parse(html)).toEqual(expectedJson);
  });

  test("mixed tags and text", async () => {
    const html = `<template><div><div>a</div>b<div>c</div>d</div></template>`;
    const expectedJson = root(div(div(text("a")), text("b"), div(text("c")), text("d")));
    expect(new TemplateParser().parse(html)).toEqual(expectedJson);
  });

  test("deeply nested tags", async () => {
    const html = `<template><div><div><div><div>a</div></div></div></div></template>`;
    const expectedJson = root(div(div(div(div(text("a"))))));
    expect(new TemplateParser().parse(html)).toEqual(expectedJson);
  });

  test("deeply nested mixed tags", async () => {
    const html = `<template><div><p><div><p>a</p></div></p></div></template>`;
    const expectedJson = root(div(p(div(p(text("a"))))));
    expect(new TemplateParser().parse(html)).toEqual(expectedJson);
  });

  test("a single tag with attributes", async () => {
    const html = `<template><div id="app" class="loaded">contents</div></template>`;
    const expectedJson = root(
      expect.objectContaining({
        name: "div",
        children: [text("contents")],
        attrs: { id: "app", class: "loaded" }
      })
    );
    expect(new TemplateParser().parse(html)).toEqual(expectedJson);
  });
});
