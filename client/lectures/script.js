document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const courseId = localStorage.getItem("currentCourseId");

  if (!token) {
    window.location.href = "http://127.0.0.1:5500/client/login/login.html";
    return;
  }

  if (!courseId) {
    console.error("No course ID found");
    return;
  }

  try {
    // Fetch course details to get the course name
    const courseResponse = await fetch(
      `http://localhost:5001/api/v1/courses/${courseId}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (courseResponse.ok) {
      const courseData = await courseResponse.json();
      document.getElementById("course-name").textContent = courseData.data.name;
    } else {
      console.error("Error fetching course:", courseResponse.statusText);
    }

    // Fetch lectures for the course
    const lecturesResponse = await fetch(
      `http://localhost:5001/api/v1/courses/${courseId}/lectures`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (lecturesResponse.ok) {
      const data = await lecturesResponse.json();

      if (data.success) {
        const lectures = data.data;
        const lecturesList = document.getElementById("lectures-list");
        lecturesList.innerHTML = "";

        // Populate lectures
        lectures.forEach((lecture) => {
          const lectureItem = document.createElement("div");
          lectureItem.classList.add("lecture-item");

          const lectureTitle = document.createElement("h3");
          lectureTitle.textContent = lecture.title;

          const lectureAvatar = document.createElement("video");
          lectureAvatar.src = lecture.avatar;
          lectureAvatar.controls = true;
          lectureAvatar.classList.add("small-video");
          lectureAvatar.onclick = function () {
            lectureAvatar.classList.toggle("small-video");
            lectureAvatar.classList.toggle("large-video");
          };

          lectureItem.appendChild(lectureTitle);
          lectureItem.appendChild(lectureAvatar);
          lecturesList.appendChild(lectureItem);
        });
      } else {
        console.error("Error: Lectures not found");
      }
    } else {
      console.error("Error fetching lectures:", lecturesResponse.statusText);
    }
  } catch (error) {
    console.error("Error fetching lectures:", error);
  }
});
