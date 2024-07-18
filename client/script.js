document.addEventListener("DOMContentLoaded", async (event) => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch(
        "http://localhost:5001/api/v1/users/token-verify",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        document.getElementById("signup").style.display = "none";
        document.getElementById("login").style.display = "none";
        document.getElementById("profile").style.display = "block";
        document.getElementById("logout").style.display = "block";
      } else {
        localStorage.removeItem("token");
        document.getElementById("signup").style.display = "block";
        document.getElementById("login").style.display = "block";
        document.getElementById("profile").style.display = "none";
        document.getElementById("logout").style.display = "none";
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      localStorage.removeItem("token");
      document.getElementById("signup").style.display = "block";
      document.getElementById("login").style.display = "block";
      document.getElementById("profile").style.display = "none";
      document.getElementById("logout").style.display = "none";
    }
  } else {
    document.getElementById("signup").style.display = "block";
    document.getElementById("login").style.display = "block";
    document.getElementById("profile").style.display = "none";
    document.getElementById("logout").style.display = "none";
  }
});

//logout flow
document.getElementById("logout").addEventListener("click", logoutUser);
async function logoutUser() {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch(
        "http://localhost:5001/api/v1/users/logout",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        localStorage.removeItem("token");
        window.location.reload();
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }
}
