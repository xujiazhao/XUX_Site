const checklist = document.querySelector(".checklist");
const checkboxes = [...checklist.querySelectorAll('input[type="checkbox"]')];
const progress = document.querySelector("[data-progress]");

function updateProgress() {
  const count = checkboxes.filter((checkbox) => checkbox.checked).length;
  document.querySelector("#check-count").textContent = count;
  document.querySelector("#check-total").textContent = checkboxes.length;
}

progress.hidden = false;
checklist.addEventListener("change", updateProgress);
window.addEventListener("pageshow", updateProgress);
updateProgress();

const revealItems = [...document.querySelectorAll("[data-reveal-item]")];
const revealControls = document.querySelector("[data-reveal-controls]");
const revealNext = document.querySelector("#reveal-next");
const revealStatus = document.querySelector("#reveal-status");
const revealCues = ["先讲问题", "再讲原因", "最后讲方案"];
let currentStep = 0;

function updateReveal() {
  revealItems.forEach((item, index) => {
    const pending = index > currentStep;
    item.classList.toggle("is-pending", pending);
    item.classList.toggle("is-current", index === currentStep);
    item.setAttribute("aria-hidden", String(pending));
  });
  revealStatus.textContent = `${currentStep + 1} / ${revealItems.length} · ${revealCues[currentStep]}`;
  revealNext.textContent = currentStep === revealItems.length - 1 ? "重新演示" : "下一步";
}

revealNext.addEventListener("click", () => {
  currentStep = (currentStep + 1) % revealItems.length;
  updateReveal();
});
updateReveal();
revealControls.hidden = false;
