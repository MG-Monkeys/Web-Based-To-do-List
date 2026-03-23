// TASKS

// GET // Tasks = get all tasks
async function getTasks() {
    const url = "http://localhost:5500/tasks";
    try {
    const response = await fetch(url);
        if (!response.ok) {      
            throw new Error(`Response status: ${response.status}`);
        }
    return await response.json();
    }
    catch (error) {
        console.error("Error fetching tasks:", error)
    }
}

// GET // Tasks - get tasks by a specific tag
async function getTasksbyTag(tag) {
    const url = `http://localhost:5500/tasks/tag//${await getTagId(tag)}`;
    try {
    const response = await fetch(url);
        if (!response.ok) {      
            throw new Error(`Response status: ${response.status}`);
        }
    return await response.json();
    }
    catch (error) {
        console.error("Error fetching tasks by tag:", error)
    }
}

// GET // Tasks - get tasks by date
async function getTasksbyDate(date) {
    const url = `http://localhost:5500/tasks/due//${date}`;
    try {
    const response = await fetch(url);
        if (!response.ok) {      
            throw new Error(`Response status: ${response.status}`);
        }
    return await response.json();
    }
    catch (error) {
        console.error("Error fetching tasks by date:", error)
    }
}

// POST / Tasks - creates tasks
async function makeTask(data) {
    const {title, description, tags, due, creatorId, groupId} = data;
    const newTime = new Date();
    const tagArr = tags.split(',').map(tag => tag.trim()) ?? [];
    let newTagArr = [];
    for (let i = 0; i < tagArr.length; i++) {
        newTagArr.push(await makeTag(tagArr[i]));
    };
    try {
        const response = await fetch("http://localhost:5500/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            
            body: JSON.stringify({ 
                title: title,
                description: description,
                tags: newTagArr, 
                startDate: newTime,
                endDate: due,
                editedAt: newTime,
                completedAt: null,
                assignedTo: creatorId, 
                groupId: groupId, 
             }),
        });
        if (!response.ok) {      
            throw new Error(`Response status: ${response.status}`);
        }
    }
    catch (error){
        console.error("Error creating task: ", error);
    }

}

// UPDATE / Tasks - updates tasks
async function updateTask(id, data) {
    const {title, description, tags, status, due, editedAt, completedAt, groupId} = data;
    const newTime = new Date();
    const tagArr = tags.split(',').map(tag => tag.trim()) ?? [];
    let newTagArr = [];
    for (let i = 0; i < tagArr.length; i++) {
        newTagArr.push(await makeTag(tagArr[i]));
    };
    try {
        const response = await fetch(`http://localhost:5500/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            
            body: JSON.stringify({ 
                title: title,
                description: description,
                tags: newTagArr, 
                status: status,
                endDate: due,
                editedAt: editedAt,
                completedAt: completedAt,
                groupId: groupId, 
             }),
        });
        if (!response.ok) {      
            throw new Error(`Response status: ${response.status}`);
        }
    }
    catch (error){
        console.error("Error editing task: ", error);
    }

}

// DELETE / tasks
async function deleteTask(id) {
    try {
        const response = await fetch(`http://localhost:5500/tasks/${id}`);
        if (!response.ok) {      
            throw new Error(`Response status: ${response.status}`);
        }
    }
    catch (error){
        console.error("Error deleting task: ", error);
    }
}

export { getTasksbyDate };