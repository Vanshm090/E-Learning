const userRole = localStorage.getItem("userRole");
const createCourse = document.getElementById("create-course");
if (userRole == "ADMIN") {
  createCourse.style.display = "inline";
} else {
  createCourse.style.display = "None";
}
