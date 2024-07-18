document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "http://127.0.0.1:5500/client/login/login.html";
    return;
  }
  const userRole = localStorage.getItem("userRole");

  try {
    const response = await fetch("http://localhost:5001/api/v1/courses", {
      method: "GET",
      credentials: "include",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && Array.isArray(data.courses)) {
        const coursesContainer = document.getElementById("courses-list");
        data.courses.forEach((course) => {
          const courseElement = document.createElement("div");
          courseElement.className = "course";
          courseElement.id = course._id; // Set the element ID to the course ID
          const displayDeleteButton = userRole === "ADMIN" ? "inline" : "none";
          courseElement.innerHTML = `
                      <img src="${course.thumbnail}" alt="${course.title}" >
                      <h2><Strong>${course.title}</Strong></h2>
                      <p>${course.description}</p>
                      <p><strong>Category</strong>: ${course.category}</p>
                      <p> <strong>Created by:</strong> ${course.createdBy}</p>
                      <button class="Continue-button"   data-course-id="${course._id}">Continue</button>
                      <button class="delete-button"  style="display: ${displayDeleteButton}"" data-course-id="${course._id}">Delete</button>
                  `;

          coursesContainer.appendChild(courseElement);
        });
        // Attach event listeners to delete buttons
        attachDeleteEventListeners();
        attachContinueEventListeners();
        setTimeout(()=>{
          alert('Courses Fetched SUCCESSFULy');
        },600)
      } else {
        console.error("Error: No courses found");
      }
    } else {
      console.error("Error fetching courses:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
});

function attachDeleteEventListeners() {
  const deleteButtons = document.querySelectorAll(".delete-button");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const courseId = event.target.getAttribute("data-course-id");
      console.log(`Clicked delete for course ID: ${courseId}`);
      await deleteCourse(courseId);
    });
  });
  console.log("Event listeners attached to delete buttons.");
}
function attachContinueEventListeners() {
  const continueButtons = document.querySelectorAll(".Continue-button");
  continueButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const courseId = event.target.getAttribute("data-course-id");
      localStorage.setItem("currentCourseId", courseId);
      window.location.href =
        "http://127.0.0.1:5500/client/lectures/lectures.html";
    });
  });
  console.log("Event listeners attached to continue buttons.");
}

async function deleteCourse(courseId) {
  const token = localStorage.getItem("token");
  console.log(`Attempting to delete course with ID: ${courseId}`);
  try {
    const response = await fetch(
      `http://localhost:5001/api/v1/courses/${courseId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      console.log(`Course with ID ${courseId} deleted successfully.`);
      const courseElement = document.getElementById(courseId);
      if (courseElement) {
        courseElement.remove();
        console.log(`Course element with ID ${courseId} removed from the DOM.`);
      } else {
        console.error(
          `Course element with ID ${courseId} not found in the DOM.`
        );
      }
    } else {
      console.error("Error deleting course:", response.statusText);
    }
  } catch (error) {
    console.error("Error deleting course:", error);
  }
}
