const openModalButton = document.getElementById("openModal");
const closeModalButton = document.getElementById("closeModal");
const planModal = document.getElementById("planModal");

const toggleModal = (shouldOpen) => {
  if (shouldOpen) {
    planModal.classList.add("show");
    planModal.setAttribute("aria-hidden", "false");
  } else {
    planModal.classList.remove("show");
    planModal.setAttribute("aria-hidden", "true");
  }
};

openModalButton?.addEventListener("click", () => toggleModal(true));
closeModalButton?.addEventListener("click", () => toggleModal(false));

planModal?.addEventListener("click", (event) => {
  if (event.target === planModal) {
    toggleModal(false);
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    toggleModal(false);
  }
});
