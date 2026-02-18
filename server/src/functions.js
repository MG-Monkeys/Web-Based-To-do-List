import Tag from './models/Tag.js';
import Time from './models/Time.js';
import Post from './models/Post.js';

// Get

async function getPosts() {
    const url = "http://localhost:5500/list";
    try {
    const response = await fetch(url);
        if (!response.ok) {      
            throw new Error(`Response status: ${response.status}`);
        }
    let data = await response.json();
    console.log(data);
    }
    catch (error) {
        console.error("Error fecthing posts:", error)
    }
}

async function getPostsbyTag(tag) {
    const url = "http://localhost:5500/list";
    try {
    const response = await fetch(url);
        if (!response.ok) {      
            throw new Error(`Response status: ${response.status}`);
        }
    let data = await response.json();
    console.log(data);
    }
    catch (error) {
        console.error("Error fecthing posts:", error)
    }
}

async function getTags() {
    const url = "http://localhost:5500/tags";
    try {
    const response = await fetch(url);
        if (!response.ok) {      
            throw new Error(`Response status: ${response.status}`);
        }
    let data = await response.json();
    console.log(data);
    }
    catch (error) {
        console.error("Error fecthing posts:", error)
    }
}

// Post

async function makePost(title, description, tags, due, reoccurance, isDone, creatorId, groupId) {
    const newTime = await makePostTime(due);
    const tagArr = tags.split(',').map(tag => tag.trim()) ?? [];
    let newTagArr = [];
    for (let i = 0; i < tagArr.length; i++) {
        newTagArr.push(await makeTag(tagArr[i]));
    };
console.log(newTagArr);
    try {
        const response = await fetch("http://localhost:5500/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            
            body: JSON.stringify({ 
                title: title,
                description: description,
                tags: await newTagArr,
                time: newTime,
                reoccurance: reoccurance,
                isDone: isDone,
                creatorId: creatorId,
                groupId: groupId
             }),
        });
    }
    catch (error){
        console.error("Error creating post: ", error);
    }

}

export default makePost;

async function makePostTime(due) {
    let now = await new Date();

    const time = new Time({
        createdAt: now,
        editedAt: now,
        dueDate: due,
        completedAt: now
    });

    return time;
}

async function makeTag(name) {

    const tagInDb = await Tag.find({ tagName: name });
    if(tagInDb.length > 0) {
        console.log("Tag is already in database");
        return tagInDb[0]._id;
    }
    else {
        try {
            const response = await fetch("http://localhost:5500/addTag", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    tagName: name,
                }),
            });
            const tagInDb = await Tag.find({ tagName: name });
            return tagInDb[0]._id;
        }
        catch (error){
            console.error("Error creating tag: ", error);
        }
    }
}