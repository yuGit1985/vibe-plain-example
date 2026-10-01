const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

class ElementStub {
  constructor() {
    this.attributes = {};
    this.classList = {
      add() {},
      remove() {},
      toggle() {}
    };
    this.hidden = false;
    this.innerHTML = "";
    this.listeners = {};
    this.textContent = "";
    this.type = "";
    this.value = "";
  }

  addEventListener(type, listener) {
    this.listeners[type] = listener;
  }

  focus() {
    this.focused = true;
  }

  querySelector() {
    return new ElementStub();
  }

  reset() {
    this.wasReset = true;
  }

  scrollIntoView() {}

  select() {
    this.selected = true;
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }
}

function createStorage(initialValues = {}) {
  const values = new Map(Object.entries(initialValues));
  return {
    getItem: key => values.get(key) ?? null,
    removeItem: key => values.delete(key),
    setItem: (key, value) => values.set(key, String(value))
  };
}

function loadApp(initialSession = {}) {
  const elements = new Map();
  const element = selector => {
    if (!elements.has(selector)) elements.set(selector, new ElementStub());
    return elements.get(selector);
  };
  const document = {
    addEventListener() {},
    body: element("body"),
    querySelector: element
  };
  const sessionStorage = createStorage(initialSession);
  const context = {
    document,
    localStorage: createStorage(),
    sessionStorage,
    window: {
      clearTimeout() {},
      innerWidth: 1024,
      setTimeout() {}
    }
  };

  const source = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
  vm.runInNewContext(source, context);
  return { element, sessionStorage };
}

test("login, password visibility, and logout flow", () => {
  const { element, sessionStorage } = loadApp();
  const authScreen = element("#authScreen");
  const appShell = element("#appShell");
  const form = element("#loginForm");
  const email = element("#emailInput");
  const password = element("#passwordInput");
  const error = element("#loginError");

  assert.equal(authScreen.hidden, false);
  assert.equal(appShell.hidden, true);

  email.value = "wrong@example.com";
  password.value = "wrong";
  form.listeners.submit({ preventDefault() {} });
  assert.match(error.textContent, /正しくありません/);
  assert.equal(sessionStorage.getItem("tsumugu-authenticated"), null);

  element("#passwordToggle").listeners.click();
  assert.equal(password.type, "text");
  assert.equal(element("#passwordToggle").attributes["aria-pressed"], "true");

  email.value = "ADMIN@TSUMUGU.JP";
  password.value = "customer2026";
  form.listeners.submit({ preventDefault() {} });
  assert.equal(authScreen.hidden, true);
  assert.equal(appShell.hidden, false);
  assert.equal(sessionStorage.getItem("tsumugu-authenticated"), "true");

  element("#logoutButton").listeners.click();
  assert.equal(authScreen.hidden, false);
  assert.equal(appShell.hidden, true);
  assert.equal(sessionStorage.getItem("tsumugu-authenticated"), null);
});

test("restores an authenticated tab session", () => {
  const { element } = loadApp({ "tsumugu-authenticated": "true" });

  assert.equal(element("#authScreen").hidden, true);
  assert.equal(element("#appShell").hidden, false);
});
