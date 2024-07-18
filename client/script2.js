const Course  = document.getElementById("courses")
Course.addEventListener("click",(even)=>{

    const token = localStorage.getItem("token")
    if(!token){
        alert("Please Login First")
        even.preventDefault();
    }
})