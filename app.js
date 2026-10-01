const customers = [
  { id: 1, name: "田中 美咲", kana: "たなか みさき", company: "株式会社アーバンデザイン", role: "代表取締役", email: "m.tanaka@urban-design.jp", phone: "03-6821-1940", address: "東京都渋谷区神宮前 4-12-8", initials: "田中", color: "#7ca193", tags: ["重要顧客", "デザイン"], updated: "今日 10:32", active: true, notes: [{ text: "秋のブランドリニューアルについて、次回の打ち合わせで方向性を確認。参考資料を事前に共有する。", date: "2026年10月1日  佐藤 健一" }, { text: "展示会でご挨拶。新規店舗の内装プロジェクトを検討中とのこと。", date: "2026年9月18日  佐藤 健一" }] },
  { id: 2, name: "鈴木 一郎", kana: "すずき いちろう", company: "鈴木商事株式会社", role: "営業部長", email: "i.suzuki@suzuki-shoji.co.jp", phone: "045-910-2281", address: "神奈川県横浜市中区山下町 82", initials: "鈴木", color: "#b28e74", tags: ["商社"], updated: "昨日", active: true, notes: [{ text: "契約更新の見積書を送付。来週中に社内承認予定。", date: "2026年9月30日  佐藤 健一" }] },
  { id: 3, name: "佐々木 優子", kana: "ささき ゆうこ", company: "合同会社みらい企画", role: "プロジェクトマネージャー", email: "yuko@mirai-kikaku.jp", phone: "06-7734-3092", address: "大阪府大阪市北区梅田 2-4-9", initials: "佐々", color: "#798ba5", tags: ["企画", "継続案件"], updated: "9月29日", active: true, notes: [{ text: "新サービスのローンチは11月中旬を予定。制作スケジュールを再調整する。", date: "2026年9月29日  佐藤 健一" }] },
  { id: 4, name: "高橋 健太", kana: "たかはし けんた", company: "株式会社ノースフィールド", role: "取締役", email: "takahashi@northfield.jp", phone: "011-825-6670", address: "北海道札幌市中央区北3条西 5", initials: "高橋", color: "#7d987c", tags: ["重要顧客"], updated: "9月26日", active: true, notes: [] },
  { id: 5, name: "山本 明日香", kana: "やまもと あすか", company: "アトリエ ソラ", role: "オーナー", email: "asuka@atelier-sora.com", phone: "092-451-8083", address: "福岡県福岡市博多区博多駅前 1-7", initials: "山本", color: "#b88789", tags: ["クリエイティブ"], updated: "9月22日", active: false, notes: [{ text: "春のカタログ制作について相談あり。年明けに再度ご連絡する。", date: "2026年9月22日  佐藤 健一" }] },
  { id: 6, name: "伊藤 直樹", kana: "いとう なおき", company: "東西テクノロジー株式会社", role: "事業開発部 マネージャー", email: "n.ito@tozai-tech.jp", phone: "03-5501-4438", address: "東京都港区芝浦 3-10-6", initials: "伊藤", color: "#8c85a2", tags: ["IT", "新規"], updated: "9月18日", active: true, notes: [] },
  { id: 7, name: "渡辺 由美", kana: "わたなべ ゆみ", company: "株式会社リーフアンドコー", role: "マーケティング責任者", email: "yumi@leafandco.jp", phone: "052-711-0921", address: "愛知県名古屋市中区栄 3-2-1", initials: "渡辺", color: "#a38f6e", tags: ["小売"], updated: "9月15日", active: true, notes: [] },
  { id: 8, name: "中村 拓也", kana: "なかむら たくや", company: "中村建築設計事務所", role: "代表", email: "takuya@nakamura-arch.jp", phone: "075-384-1172", address: "京都府京都市中京区烏丸通 21", initials: "中村", color: "#718f98", tags: ["建築"], updated: "9月12日", active: false, notes: [] },
  { id: 9, name: "小林 彩", kana: "こばやし あや", company: "株式会社ハルカ", role: "広報室長", email: "aya.kobayashi@haruka.jp", phone: "078-388-4100", address: "兵庫県神戸市中央区海岸通 7", initials: "小林", color: "#b27f76", tags: ["広報"], updated: "9月8日", active: true, notes: [] },
  { id: 10, name: "加藤 和也", kana: "かとう かずや", company: "KATO FOODS", role: "代表取締役", email: "kato@kato-foods.jp", phone: "082-211-9634", address: "広島県広島市中区紙屋町 2-5", initials: "加藤", color: "#8e9c6b", tags: ["食品"], updated: "9月4日", active: true, notes: [] },
  { id: 11, name: "吉田 麻衣", kana: "よしだ まい", company: "株式会社ネスト", role: "商品企画", email: "mai@nest-home.jp", phone: "022-718-3350", address: "宮城県仙台市青葉区一番町 1-3", initials: "吉田", color: "#9a819a", tags: ["住まい"], updated: "8月28日", active: false, notes: [] },
  { id: 12, name: "林 大輔", kana: "はやし だいすけ", company: "オリオン物流株式会社", role: "経営企画部長", email: "hayashi@orion-logi.co.jp", phone: "048-622-7741", address: "埼玉県さいたま市大宮区桜木町 4", initials: "林", color: "#738b80", tags: ["物流"], updated: "8月21日", active: true, notes: [] }
];

const storedNotes = JSON.parse(localStorage.getItem("tsumugu-customer-notes") || "{}");
customers.forEach(customer => {
  if (storedNotes[customer.id]) customer.notes = storedNotes[customer.id];
});

let selectedId = 1;
let activeOnly = false;
let newestFirst = true;

const list = document.querySelector("#customerList");
const detail = document.querySelector("#detailPanel");
const searchInput = document.querySelector("#searchInput");
const resultCount = document.querySelector("#resultCount");
const filterButton = document.querySelector("#filterButton");
const sortButton = document.querySelector("#sortButton");
const toast = document.querySelector("#toast");

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

function filteredCustomers() {
  const query = searchInput.value.trim().toLowerCase();
  let result = customers.filter(customer => {
    const matches = `${customer.name} ${customer.kana} ${customer.company}`.toLowerCase().includes(query);
    return matches && (!activeOnly || customer.active);
  });
  if (!newestFirst) result = [...result].reverse();
  return result;
}

function renderList() {
  const visible = filteredCustomers();
  resultCount.textContent = visible.length;
  if (!visible.length) {
    list.innerHTML = `<div class="empty-state"><strong>顧客が見つかりません</strong>検索条件を変えてお試しください。</div>`;
    return;
  }
  list.innerHTML = visible.map(customer => `
    <button class="customer-row ${customer.id === selectedId ? "active" : ""}" type="button" data-id="${customer.id}">
      <span class="avatar customer-avatar" style="background:${customer.color}">${customer.initials}</span>
      <span class="customer-main">
        <span class="customer-name-line"><span class="customer-name">${customer.name}</span><span class="status-dot ${customer.active ? "" : "quiet"}"></span></span>
        <span class="customer-company">${customer.company}</span>
      </span>
      <span class="customer-date">${customer.updated}</span>
    </button>
  `).join("");
}

function icon(name) {
  const icons = {
    mail: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92Z"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    briefcase: '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/></svg>'
  };
  return icons[name];
}

function renderDetail() {
  const customer = customers.find(item => item.id === selectedId);
  detail.innerHTML = `
    <div class="detail-top">
      <div class="detail-actions">
        <button class="icon-button" type="button" aria-label="メールを送る" title="メールを送る">${icon("mail")}</button>
        <button class="icon-button" type="button" aria-label="その他の操作" title="その他の操作">•••</button>
      </div>
      <div class="detail-identity">
        <div class="avatar detail-avatar" style="background:${customer.color}">${customer.initials}</div>
        <div><h2>${customer.name}</h2><p>${customer.company}</p></div>
      </div>
      <div class="tag-row">${customer.tags.map((tag, i) => `<span class="tag ${i === 0 && tag === "重要顧客" ? "gold" : ""}">${tag}</span>`).join("")}</div>
    </div>
    <div class="detail-body">
      <h3 class="section-title">基本情報</h3>
      <div class="info-grid">
        <div class="info-item"><div class="info-label">${icon("briefcase")}役職</div><div class="info-value">${customer.role}</div></div>
        <div class="info-item"><div class="info-label">${icon("phone")}電話番号</div><div class="info-value"><a href="tel:${customer.phone}">${customer.phone}</a></div></div>
        <div class="info-item full"><div class="info-label">${icon("mail")}メールアドレス</div><div class="info-value"><a href="mailto:${customer.email}">${customer.email}</a></div></div>
        <div class="info-item full"><div class="info-label">${icon("pin")}住所</div><div class="info-value">${customer.address}</div></div>
      </div>
      <div class="divider"></div>
      <div class="memo-heading"><h3 class="section-title">メモ</h3><span class="memo-count">${customer.notes.length}件</span></div>
      <form class="memo-form" id="memoForm">
        <textarea id="memoInput" maxlength="300" placeholder="会話の内容や、次回のアクションを記録…" aria-label="新しいメモ"></textarea>
        <div class="memo-form-footer"><span id="charCount">0 / 300</span><button class="save-button" id="saveButton" type="submit" disabled>メモを追加</button></div>
      </form>
      <div class="memo-list">
        ${customer.notes.length ? customer.notes.map(note => `<article class="memo-item"><div class="memo-content">${escapeHTML(note.text)}</div><div class="memo-meta">${note.date}</div></article>`).join("") : '<p class="no-memos">まだメモはありません。最初のメモを追加しましょう。</p>'}
      </div>
    </div>
  `;

  const memoInput = document.querySelector("#memoInput");
  const saveButton = document.querySelector("#saveButton");
  memoInput.addEventListener("input", () => {
    document.querySelector("#charCount").textContent = `${memoInput.value.length} / 300`;
    saveButton.disabled = !memoInput.value.trim();
  });
  document.querySelector("#memoForm").addEventListener("submit", addMemo);
}

function addMemo(event) {
  event.preventDefault();
  const input = document.querySelector("#memoInput");
  const text = input.value.trim();
  if (!text) return;
  const customer = customers.find(item => item.id === selectedId);
  customer.notes.unshift({
    text,
    date: `${new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long", day: "numeric" }).format(new Date())}  佐藤 健一`
  });
  storedNotes[customer.id] = customer.notes;
  localStorage.setItem("tsumugu-customer-notes", JSON.stringify(storedNotes));
  renderDetail();
  showToast("メモを保存しました");
}

function showToast(message) {
  toast.querySelector("span").textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

list.addEventListener("click", event => {
  const row = event.target.closest(".customer-row");
  if (!row) return;
  selectedId = Number(row.dataset.id);
  renderList();
  renderDetail();
  if (window.innerWidth <= 680) detail.scrollIntoView({ behavior: "smooth", block: "start" });
});

searchInput.addEventListener("input", renderList);
filterButton.addEventListener("click", () => {
  activeOnly = !activeOnly;
  filterButton.classList.toggle("active", activeOnly);
  filterButton.setAttribute("aria-pressed", String(activeOnly));
  renderList();
});
sortButton.addEventListener("click", () => {
  newestFirst = !newestFirst;
  sortButton.innerHTML = `更新順 <span>${newestFirst ? "↓" : "↑"}</span>`;
  renderList();
});
document.addEventListener("keydown", event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
});

const sidebar = document.querySelector(".sidebar");
const scrim = document.querySelector("#scrim");
document.querySelector("#menuButton").addEventListener("click", () => {
  sidebar.classList.add("open");
  scrim.classList.add("show");
});
scrim.addEventListener("click", () => {
  sidebar.classList.remove("open");
  scrim.classList.remove("show");
});

document.querySelector("#addCustomerButton").addEventListener("click", () => showToast("顧客追加はデモ版では利用できません"));

renderList();
renderDetail();
