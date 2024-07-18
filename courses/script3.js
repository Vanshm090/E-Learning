document.addEventListener("DOMContentLoaded", () => {
    const createCourseButton = document.getElementById("create-course");
    const formContainer = document.getElementById("form-container");
    const submitCourseButton = document.getElementById("submit-course");

    createCourseButton.addEventListener("click", () => {
        formContainer.style.display = "block";
    });

    submitCourseButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const numberOfLectures = document.getElementById("numberOfLectures").value;
        const category = document.getElementById("category").value;
        const createdBy = document.getElementById("createdBy").value;
        const thumbnail = document.getElementById("thumbnail").files[0];

        if (!title || !description || !numberOfLectures || !category || !createdBy || !thumbnail) {
            alert("All fields are required");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("numberOfLectures", numberOfLectures);
        formData.append("category", category);
        formData.append("createdBy", createdBy);
        formData.append("thumbnail", thumbnail);

        try {
            const response = await fetch("http://localhost:5001/api/v1/courses", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', response.status, errorData);
                throw new Error(errorData.message || 'Unknown error');
            }

            const data = await response.json();
            console.log('Course created successfully:', data);
            alert("Course created successfully!");
            formContainer.style.display = "none";
            formContainer.reset();
            // Optionally, refresh the course list to show the new course
        } catch (error) {
            console.error('An error occurred while submitting the form:', error);
            alert('An error occurred while submitting the form. Please try again later.');
        }
    });
});
