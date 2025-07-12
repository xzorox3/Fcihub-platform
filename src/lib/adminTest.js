// Development utility to test admin functionality
// You can run this in browser console or create a button to trigger it

function setAdminForTesting() {
  // Set fake auth token and admin role for testing using cookies
  document.cookie = "authToken=test-admin-token; path=/; max-age=604800"; // 7 days
  document.cookie = "userRole=admin; path=/; max-age=604800";
  document.cookie =
    'user={"id":1,"name":"Test Admin","email":"admin@test.com","role":"admin"}; path=/; max-age=604800';

  // Reload page to see changes
  window.location.reload();
}

function clearAdminTesting() {
  // Remove cookies by setting them to expire in the past
  document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.reload();
}

// Call setAdminForTesting() in console to become admin
// Call clearAdminTesting() to logout

console.log("Admin testing functions loaded:");
console.log("- setAdminForTesting() - to become admin");
console.log("- clearAdminTesting() - to logout");
