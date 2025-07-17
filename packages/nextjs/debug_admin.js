// Debug script to test admin dashboard functionality
console.log("Testing admin dashboard buttons...");

// Try to find and click approve button
const approveButtons = document.querySelectorAll('button');
const approveBtn = Array.from(approveButtons).find(btn => btn.textContent.includes('Approve'));
if (approveBtn) {
  console.log("Found approve button, clicking...");
  approveBtn.click();
} else {
  console.log("Approve button not found");
}
