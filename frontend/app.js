const $ = (s) => document.querySelector(s);
async function loadDashboard() {
  try {
    const response = await fetch("/api/dashboard");
    const data = await response.json();
    $("#metrics").innerHTML = data.metrics
      .map(
        (m) =>
          `<div class="metric"><small>${m.label}</small><strong>${m.value}</strong><span class="${m.tone}">${m.change}</span></div>`,
      )
      .join("");
  } catch {
    $("#metrics").innerHTML =
      '<div class="metric">Unable to load dashboard data. Please retry.</div>';
  }
}
function openCase() {
  $("#dashboard").classList.add("hidden");
  $("#case-view").classList.remove("hidden");
  window.scrollTo(0, 0);
  location.hash = "cases/AC-2026-004182";
}
function closeCase() {
  $("#case-view").classList.add("hidden");
  $("#dashboard").classList.remove("hidden");
  location.hash = "dashboard";
}
async function decide(decision) {
  const note = $("#review-note").value.trim();
  if (!note) {
    showToast("Add a reviewer note before recording a decision.");
    return;
  }
  try {
    const response = await fetch("/api/cases/AC-2026-004182/decision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, note }),
    });
    if (!response.ok) throw new Error();
    const data = await response.json();
    $("#conclusion-text").innerHTML =
      `<strong>${data.status.replace("_", " ")}</strong> — ${note}`;
    $("#trail").insertAdjacentHTML(
      "afterbegin",
      `<div><i></i><p><strong>Reviewer decision recorded: ${data.status.replace("_", " ")}</strong><small>Alex Rivera · just now</small></p></div>`,
    );
    showToast(data.message);
  } catch {
    showToast("The decision could not be recorded. Please try again.");
  }
}
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3200);
}
loadDashboard();

const workspaceData = {
  cases: [
    "AUDIT CASES",
    "Audit case management",
    "Prioritise, investigate and document decisions for exceptions requiring review.",
    `<div class="panel table-panel"><div class="table-toolbar"><strong>42 open cases</strong><input placeholder="Search cases"></div><div class="data-table"><div class="thead"><span>Case</span><span>Risk</span><span>Vendor / amount</span><span>Control outcome</span><span>Owner</span><span></span></div>${[
      [
        "AC-2026-004182",
        "HIGH",
        "Orion Strategic Supplies · $148,500",
        "MISSING_APPROVAL",
        "Unassigned",
      ],
      [
        "AC-2026-004176",
        "MED",
        "Northline Logistics · $72,400",
        "MISSING_EVIDENCE",
        "Priya Shah",
      ],
      [
        "AC-2026-004155",
        "HIGH",
        "Apex Data Systems · $108,000",
        "POLICY_VIOLATION",
        "Marcus Bell",
      ],
    ]
      .map(
        (r) =>
          `<div><strong>${r[0]}</strong><span class="risk ${r[1] === "HIGH" ? "high" : "medium"}">${r[1]}</span><span>${r[2]}</span><span>${r[3]}</span><span>${r[4]}</span><button onclick="openCase()">Review</button></div>`,
      )
      .join("")}</div></div>`,
  ],
  transactions: [
    "TRANSACTIONS",
    "Transaction monitoring",
    "Review transactions mapped into the canonical audit schema.",
    `<div class="panel table-panel"><div class="table-toolbar"><strong>128,426 reviewed transactions</strong><button class="secondary" onclick="showCreateCase()">Create case</button></div><div class="data-table"><div class="thead"><span>Transaction</span><span>Date</span><span>Vendor</span><span>Amount</span><span>Risk score</span><span></span></div>${[
      [
        "TXN-2026-004182",
        "08 Sep 2026",
        "Orion Strategic Supplies",
        "$148,500",
        "91%",
      ],
      [
        "TXN-2026-004176",
        "08 Sep 2026",
        "Northline Logistics",
        "$72,400",
        "67%",
      ],
      [
        "TXN-2026-004155",
        "07 Sep 2026",
        "Apex Data Systems",
        "$108,000",
        "84%",
      ],
    ]
      .map(
        (r) =>
          `<div><strong>${r[0]}</strong><span>${r[1]}</span><span>${r[2]}</span><span>${r[3]}</span><span class="score-chip">${r[4]}</span><button onclick="openCase()">Investigate</button></div>`,
      )
      .join("")}</div></div>`,
  ],
  controls: [
    "CONTROL LIBRARY",
    "Control performance",
    "Compare control requirements with the evidence and activity observed.",
    `<div class="control-grid">${[
      [
        "Dual approval for material payments",
        "Payments above $100,000 require two independent approvals.",
        "MISSING_APPROVAL",
        "12 open exceptions",
      ],
      [
        "Invoice-to-PO matching",
        "Invoice amount and vendor must match an approved purchase order.",
        "PASS",
        "96.8% operating effectively",
      ],
      [
        "Duplicate payment prevention",
        "Payment references must be unique.",
        "DUPLICATE_TRANSACTION",
        "3 open exceptions",
      ],
    ]
      .map(
        (r) =>
          `<article class="panel control-summary"><p class="eyebrow">FINANCE CONTROL</p><h2>${r[0]}</h2><p>${r[1]}</p><div><span class="status ${r[2] === "PASS" ? "pass" : "review"}">${r[2]}</span><small>${r[3]}</small></div><button class="link" onclick="openCase()">Review exceptions →</button></article>`,
      )
      .join("")}</div>`,
  ],
  evidence: [
    "EVIDENCE REVIEW",
    "Evidence workspace",
    "Inspect evidence status and verification results for each audit case.",
    `<div class="panel table-panel"><div class="table-toolbar"><strong>Evidence for AC-2026-004182</strong><button class="secondary" onclick="showToast('Upload connects to secure document storage during production integration.')">Upload evidence</button></div><div class="evidence-files">${[
      ["INV-88419.pdf", "Invoice", "FOUND"],
      ["PO-220188.pdf", "Purchase Order", "FOUND"],
      ["Approval workflow record", "Approval — Level 1", "FOUND"],
      ["Not located", "Approval — Level 2", "MISSING"],
      ["Payment-9981.pdf", "Bank Confirmation", "FOUND"],
    ]
      .map(
        (r) =>
          `<div><span class="file-icon">▤</span><div><strong>${r[0]}</strong><small>${r[1]}</small></div><span class="status ${r[2] === "FOUND" ? "pass" : "review"}">${r[2]}</span><button onclick="showToast('${r[0]} is a synthetic demo document.')">Inspect</button></div>`,
      )
      .join("")}</div></div>`,
  ],
  models: [
    "MODEL REGISTRY",
    "Model operations",
    "Track model and preprocessing versions without coupling model internals to the UI.",
    `<div class="model-grid">${[
      [
        "Transaction anomaly detection",
        "Demo transaction anomaly",
        "1.4.0",
        "1.1.0",
      ],
      ["Evidence verification", "Demo evidence verifier", "1.2.0", "1.0.0"],
      ["Control classification", "Demo control classifier", "2.0.0", "1.0.0"],
      ["Audit conclusion", "Demo conclusion composer", "1.0.0", "n/a"],
    ]
      .map(
        (r) =>
          `<article class="panel model-card"><span class="status pass">OPERATIONAL</span><p class="eyebrow">${r[0]}</p><h2>${r[1]}</h2><dl><div><dt>Model version</dt><dd>${r[2]}</dd></div><div><dt>Preprocessing</dt><dd>${r[3]}</dd></div><div><dt>Last execution</dt><dd>09 Sep, 09:42</dd></div></dl><button class="link" onclick="showToast('Configuration is managed in config/model_registry/demo.json.')">View configuration →</button></article>`,
      )
      .join("")}</div>`,
  ],
  reports: [
    "REPORTING",
    "Audit reporting",
    "Generate traceable reports for control owners, management and internal audit.",
    `<div class="report-grid">${[
      [
        "Monthly continuous audit summary",
        "Exception trends, case status and model execution summary",
        "PDF",
      ],
      [
        "Control exception register",
        "Open and resolved control exceptions with reviewer decisions",
        "XLSX",
      ],
      [
        "Evidence gap report",
        "Missing documents and approvals by process",
        "XLSX",
      ],
    ]
      .map(
        (r) =>
          `<article class="panel report-card"><span class="file-icon">▧</span><h2>${r[0]}</h2><p>${r[1]}</p><div><span>${r[2]}</span><button class="primary" onclick="showToast('Report generation connects to the reporting service in production.')">Generate report</button></div></article>`,
      )
      .join("")}</div>`,
  ],
};
function showPage(page) {
  let workspace = document.querySelector("#workspace");
  if (!workspace) {
    workspace = document.createElement("section");
    workspace.id = "workspace";
    workspace.className = "view";
    document.querySelector("main").append(workspace);
  }
  const info = workspaceData[page];
  $("#dashboard").classList.add("hidden");
  $("#case-view").classList.add("hidden");
  workspace.classList.remove("hidden");
  workspace.innerHTML = `<div class="page-title"><div><p class="eyebrow">${info[0]}</p><h1>${info[1]}</h1><p>${info[2]}</p></div>${page === "cases" ? '<button class="primary" onclick="showCreateCase()">+ Create audit case</button>' : ""}</div>${info[3]}`;
  document
    .querySelectorAll(".sidebar nav a")
    .forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === "#" + page),
    );
  location.hash = page;
  window.scrollTo(0, 0);
}
function showCreateCase() {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "modal";
  modal.innerHTML = `<div class="modal-card"><div class="modal-head"><div><p class="eyebrow">NEW AUDIT CASE</p><h2>Create a review case</h2></div><button onclick="closeModal()">×</button></div><p>Use a transaction identifier to start a traceable manual review.</p><label>Transaction ID<input id="new-txn" placeholder="e.g. TXN-2026-004182"></label><label>Review reason<select><option>Potential control exception</option><option>Manual auditor referral</option><option>Evidence follow-up</option></select></label><label>Reviewer note<textarea id="new-note" placeholder="Why does this transaction require review?"></textarea></label><div class="modal-actions"><button class="secondary" onclick="closeModal()">Cancel</button><button class="primary" onclick="createCase()">Create case</button></div></div>`;
  document.body.append(modal);
}
function closeModal() {
  document.querySelector("#modal")?.remove();
}
function createCase() {
  const id = $("#new-txn").value.trim(),
    note = $("#new-note").value.trim();
  if (!id || !note) {
    showToast("Enter a transaction ID and reviewer note.");
    return;
  }
  closeModal();
  showToast(
    `Case created for ${id}. It is queued for configured model processing.`,
  );
  showPage("cases");
}
document.querySelectorAll(".sidebar nav a").forEach((a) =>
  a.addEventListener("click", (event) => {
    event.preventDefault();
    showPage(a.getAttribute("href").slice(1));
  }),
);
document
  .querySelectorAll(".primary,.link,.queue-item button")
  .forEach((button) => {
    if (button.textContent.includes("Create audit case"))
      button.onclick = showCreateCase;
    if (button.textContent.includes("View controls"))
      button.onclick = () => showPage("controls");
    if (button.textContent.includes("View registry"))
      button.onclick = () => showPage("models");
    if (button.textContent.includes("View all"))
      button.onclick = () => showPage("cases");
    if (button.textContent.includes("Inspect documents"))
      button.onclick = () => showPage("evidence");
    if (button.textContent.includes("Full history"))
      button.onclick = () =>
        showToast("The complete audit history is visible in this demo case.");
  });
document.head.insertAdjacentHTML(
  "beforeend",
  `<style>.table-panel{padding:0;overflow:hidden}.table-toolbar{padding:18px 20px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e7eaf1}.table-toolbar input{border:1px solid #e7eaf1;border-radius:5px;padding:8px 10px;font:12px inherit}.data-table>div{display:grid;grid-template-columns:1.1fr .7fr 1.6fr 1.25fr 1fr .7fr;align-items:center;gap:10px;padding:13px 20px;border-bottom:1px solid #e7eaf1;font-size:12px}.data-table .thead{font-size:10px;color:#788399;font-weight:700;letter-spacing:.4px;background:#fafbfc}.data-table button,.evidence-files button{background:#fff;border:1px solid #cfd5e5;border-radius:5px;padding:6px 9px;color:#4055ac;font-size:11px;font-weight:600;cursor:pointer}.score-chip{color:#b42c43;font-weight:700}.control-grid,.model-grid,.report-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.control-summary,.model-card,.report-card{display:grid;gap:14px;align-content:start}.control-summary h2,.model-card h2,.report-card h2{line-height:1.4}.control-summary p:not(.eyebrow),.report-card p{color:#637089;font-size:12px;line-height:1.55;margin:0}.control-summary>div,.report-card>div{display:flex;align-items:center;justify-content:space-between;gap:9px}.control-summary small{color:#7c879a;font-size:11px}.pass{color:#177b5a;background:#eaf8f1}.model-card dl{margin:0;border-top:1px solid #e7eaf1}.model-card dl div{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid #e7eaf1;font-size:11px}.model-card dt{color:#788398}.model-card dd{margin:0;color:#34405d;font-weight:600}.evidence-files>div{display:grid;grid-template-columns:34px 1fr 90px 70px;align-items:center;gap:10px;padding:13px 20px;border-bottom:1px solid #e7eaf1}.evidence-files strong,.evidence-files small{display:block;font-size:12px}.evidence-files small{color:#7c8797;font-size:10px;margin-top:3px}.file-icon{color:#5264b8;font-size:21px}.report-card>div span{font-size:10px;font-weight:700;color:#7d879b}.modal{position:fixed;inset:0;background:#10182f88;display:grid;place-items:center;z-index:10;padding:20px}.modal-card{background:white;border-radius:9px;width:min(500px,100%);padding:22px;box-shadow:0 18px 60px #0c153455}.modal-head{display:flex;justify-content:space-between}.modal-head h2{margin:0;font-size:18px}.modal-head button{background:none;border:0;font-size:23px;color:#69748a;cursor:pointer}.modal-card>p{font-size:12px;color:#667188;line-height:1.5}.modal-card label{display:grid;gap:6px;font-size:11px;font-weight:700;margin:13px 0}.modal-card input,.modal-card select,.modal-card textarea{font:12px 'DM Sans',Arial;border:1px solid #d9dfeb;border-radius:5px;padding:9px;width:100%}.modal-card textarea{resize:vertical;min-height:70px}.modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:18px}@media(max-width:900px){.control-grid,.model-grid,.report-grid{grid-template-columns:1fr 1fr}.data-table{overflow:auto}.data-table>div{min-width:800px}}@media(max-width:560px){.control-grid,.model-grid,.report-grid{grid-template-columns:1fr}.evidence-files>div{grid-template-columns:28px 1fr 70px}.evidence-files button{display:none}}</style>`,
);
