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
    this.checked = false;
    this.dataset = {};
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

  matches() {
    return false;
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
  const localStorage = createStorage();
  element("#emailModal").hidden = true;
  element("#customerModal").hidden = true;
  element("#deleteModal").hidden = true;
  const context = {
    document,
    localStorage,
    sessionStorage,
    URLSearchParams,
    window: {
      clearTimeout() {},
      innerWidth: 1024,
      location: { href: "" },
      setTimeout() {}
    }
  };

  const source = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
  vm.runInNewContext(source, context);
  return { element, localStorage, sessionStorage, window: context.window };
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

test("creates an email for the selected customer", () => {
  const { element, window } = loadApp({ "tsumugu-authenticated": "true" });
  const modal = element("#emailModal");
  const form = element("#emailForm");
  const subject = element("#emailSubject");
  const body = element("#emailBody");

  element("#detailPanel").listeners.click({
    preventDefault() {},
    target: { closest: () => ({}) }
  });

  assert.equal(modal.hidden, false);
  assert.equal(element("#emailRecipient").value, "m.tanaka@urban-design.jp");
  assert.match(body.value, /田中 美咲 様/);
  assert.equal(subject.focused, true);

  form.listeners.submit({ preventDefault() {} });
  assert.match(element("#emailError").textContent, /件名と本文/);
  assert.equal(window.location.href, "");

  subject.value = "次回のお打ち合わせについて";
  body.value = "田中 美咲 様\n\n日程をご確認ください。";
  form.listeners.submit({ preventDefault() {} });

  assert.match(window.location.href, /^mailto:m\.tanaka%40urban-design\.jp\?/);
  assert.match(window.location.href, /subject=/);
  assert.match(window.location.href, /body=/);
  assert.equal(modal.hidden, true);
});

test("edits the selected customer and persists the changes", () => {
  const { element, localStorage } = loadApp({ "tsumugu-authenticated": "true" });
  const detail = element("#detailPanel");

  detail.listeners.click({
    preventDefault() {},
    target: { closest: selector => selector.includes("edit-customer") ? {} : null }
  });

  assert.equal(element("#customerModal").hidden, false);
  assert.equal(element("#customerName").value, "田中 美咲");
  assert.equal(element("#customerName").focused, true);

  element("#customerName").value = "田中 美咲子";
  element("#customerCompany").value = "株式会社アーバンデザイン東京";
  element("#customerEmail").value = "misako@example.jp";
  element("#customerRank").value = "ゴールド";
  element("#customerActive").checked = false;
  element("#customerForm").listeners.submit({ preventDefault() {} });

  assert.equal(element("#customerModal").hidden, true);
  assert.match(detail.innerHTML, /田中 美咲子/);
  assert.match(detail.innerHTML, /misako@example\.jp/);
  const savedCustomers = JSON.parse(localStorage.getItem("tsumugu-customers"));
  assert.equal(savedCustomers[0].name, "田中 美咲子");
  assert.equal(savedCustomers[0].active, false);
});

test("requires confirmation before deleting a customer", () => {
  const { element, localStorage } = loadApp({ "tsumugu-authenticated": "true" });
  const detail = element("#detailPanel");

  detail.listeners.click({
    preventDefault() {},
    target: { closest: selector => selector.includes("delete-customer") ? {} : null }
  });

  assert.equal(element("#deleteModal").hidden, false);
  assert.equal(element("#deleteCustomerName").textContent, "田中 美咲");

  element("#deleteConfirmButton").listeners.click();

  assert.equal(element("#deleteModal").hidden, true);
  assert.equal(element("#navCount").textContent, 11);
  assert.match(detail.innerHTML, /鈴木 一郎/);
  const savedCustomers = JSON.parse(localStorage.getItem("tsumugu-customers"));
  assert.equal(savedCustomers.length, 11);
  assert.equal(savedCustomers.some(customer => customer.id === 1), false);
});
