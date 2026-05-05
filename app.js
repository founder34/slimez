const taskCards = Array.from(document.querySelectorAll(".task-card"));
const progressLabel = document.querySelector("#progressLabel");
const progressPercent = document.querySelector("#progressPercent");
const progressFill = document.querySelector("#progressFill");
const whitelistForm = document.querySelector("#whitelistForm");
const submissionCard = document.querySelector("#submissionCard");

let completedTasks = 0;

function textNode(value) {
  return document.createTextNode(String(value || ""));
}

function setProgress(count) {
  const total = taskCards.length || 4;
  const percent = Math.round((count / total) * 100);

  if (progressLabel) {
    progressLabel.textContent = `${count} of ${total} tasks complete`;
  }

  if (progressPercent) {
    progressPercent.textContent = `${percent}%`;
  }

  if (progressFill) {
    progressFill.style.width = `${percent}%`;
  }
}

function unlockTask(index) {
  const card = taskCards[index];

  if (!card) {
    return;
  }

  card.classList.remove("locked");
  card.classList.add("active");
  const firstField = card.querySelector("input");

  if (firstField) {
    firstField.focus();
  }
}

function toggleProof(proofToggle) {
  const isConfirmed = proofToggle.dataset.confirmed === "true";
  proofToggle.dataset.confirmed = String(!isConfirmed);
  proofToggle.setAttribute("aria-pressed", String(!isConfirmed));
  proofToggle.textContent = isConfirmed ? "Mark liked + reposted" : "Liked + reposted confirmed";

  const taskError = proofToggle.closest(".task-card").querySelector(".task-error");

  if (taskError) {
    taskError.classList.remove("visible");
  }
}

function completeTask(card) {
  if (!card || card.classList.contains("locked")) {
    return;
  }

  const taskIndex = Number(card.dataset.task);
  const field = card.querySelector("input");
  const proofToggle = card.querySelector(".proof-toggle");
  const taskError = card.querySelector(".task-error");

  if (proofToggle && proofToggle.dataset.confirmed !== "true") {
    if (taskError) {
      taskError.classList.add("visible");
    }

    proofToggle.focus();
    return;
  }

  if (field && !field.checkValidity()) {
    field.reportValidity();
    return;
  }

  if (card.classList.contains("complete")) {
    return;
  }

  card.classList.remove("active");
  card.classList.add("complete");
  completedTasks = Math.max(completedTasks, taskIndex + 1);
  setProgress(completedTasks);
  unlockTask(taskIndex + 1);
}

document.addEventListener("click", (event) => {
  const proofToggle = event.target.closest(".proof-toggle");

  if (proofToggle) {
    toggleProof(proofToggle);
  }

  const nextButton = event.target.closest(".task-next");

  if (!nextButton) {
    return;
  }

  const card = nextButton.closest(".task-card");

  if (card) {
    completeTask(card);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") {
    return;
  }

  const proofToggle = event.target.closest(".proof-toggle");

  if (proofToggle) {
    event.preventDefault();
    toggleProof(proofToggle);
    return;
  }

  const card = event.target.closest(".task-card.active");

  if (card && event.target.tagName === "INPUT") {
    event.preventDefault();

    if (Number(card.dataset.task) === taskCards.length - 1 && whitelistForm) {
      whitelistForm.requestSubmit();
    } else {
      completeTask(card);
    }
  }
});

if (whitelistForm) {
  whitelistForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const finalCard = taskCards[taskCards.length - 1];
    completeTask(finalCard);

    if (completedTasks !== taskCards.length) {
      return;
    }

    const data = new FormData(whitelistForm);
    const username = data.get("username");
    const commentLink = data.get("commentLink");
    const wallet = data.get("wallet");

    // Update tweet button link
    const tweetText = encodeURIComponent(`I just submitted my application in Slimez dungeon! 🧪⚔️\n\nComplete yours here: https://slimezz.xyz`);
    const tweetBtn = document.getElementById("tweetBtn");
    if (tweetBtn) {
      tweetBtn.href = `https://twitter.com/intent/tweet?text=${tweetText}`;
    }

    // Show Success Modal
    const modal = document.getElementById("successModal");
    if (modal) {
      modal.classList.add("active");
    }

    submissionCard.replaceChildren();

    const image = document.createElement("img");
    image.src = "LOGO.jpg";
    image.alt = "Slimez mascot";

    const content = document.createElement("div");
    const title = document.createElement("h2");
    title.textContent = "Whitelist Entry Submitted";

    const userLine = document.createElement("p");
    const usernameStrong = document.createElement("strong");
    usernameStrong.append(textNode(username));
    userLine.append(usernameStrong, textNode(" completed all tasks."));

    const commentLine = document.createElement("p");
    commentLine.className = "summary-line";
    commentLine.append(textNode(`Comment: ${commentLink}`));

    const walletLine = document.createElement("p");
    walletLine.className = "summary-line";
    walletLine.append(textNode(`Wallet: ${wallet}`));

    content.append(title, userLine, commentLine, walletLine);
    submissionCard.append(image, content);
  });
}

document.querySelectorAll(".tilt-card, .jewel-card, .feature").forEach((element) => {
  element.addEventListener("pointermove", (event) => {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -10;
    const rotateY = ((x / rect.width) - 0.5) * 10;

    element.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  element.addEventListener("pointerleave", () => {
    element.style.transform = "";
  });
});

setProgress(completedTasks);
