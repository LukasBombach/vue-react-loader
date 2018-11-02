import TemplateParser from "../../lib/parser/template";

const root = root => ({ root });
const div = (...children) => expect.objectContaining({ tagName: "div", children });
const p = (...children) => expect.objectContaining({ tagName: "p", children });

describe("ScriptParser", () => {
  test("a single tag", async () => {
    const html = `<template><div>contents</div></template>`;
    const expectedJson = root(div("contents"));
    expect(new TemplateParser().parse(html)).toEqual(expectedJson);
  });

  test("a tag containing a tag", async () => {
    const html = `<template><div id="div"><p id="p">contents</p></div></template>`;
    const expectedJson = root(div(p("contents")));
    expect(new TemplateParser().parse(html)).toEqual(expectedJson);
  });

  test("a tag containing a tag with the same tagname", async () => {
    const html = `<template><div><div>contents</div></div></template>`;
    const expectedJson = root(div(div("contents")));
    expect(new TemplateParser().parse(html)).toEqual(expectedJson);
  });

  test("mixed tags and text", async () => {
    const html = `<template><div><div>a</div>b<div>c</div>d</div></template>`;
    const expectedJson = root(div(div("a"), "b", div("c"), "d"));
    expect(new TemplateParser().parse(html)).toEqual(expectedJson);
  });

  test("deeply nested tags", async () => {
    const html = `<template><div><div><div><div>a</div></div></div></div></template>`;
    const expectedJson = root(div(div(div(div("a")))));
    expect(new TemplateParser().parse(html)).toEqual(expectedJson);
  });

  test("deeply nested mixed tags", async () => {
    const html = `<template><div><p><div><p>a</p></div></p></div></template>`;
    const expectedJson = root(div(p(div(p("a")))));
    expect(new TemplateParser().parse(html)).toEqual(expectedJson);
  });

  test("a single tag with attributes", async () => {
    const html = `<template><div id="app" class="loaded">contents</div></template>`;
    const expectedJson = root(
      expect.objectContaining({
        tagName: "div",
        children: ["contents"],
        attrs: { id: "app", class: "loaded" }
      })
    );
    expect(new TemplateParser().parse(html)).toEqual(expectedJson);
  });
});
