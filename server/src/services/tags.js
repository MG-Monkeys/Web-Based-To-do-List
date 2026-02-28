import Tag from '.././models/Tag.js';

// GET // TAGS - get all tags
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

// GET // TAGS - get a tag by its id
async function getTagId(name) {
    const tagInDb = await Tag.find({ tagName: name });
    if(tagInDb.length > 0) {
        return tagInDb[0]._id;
    }
    else {
        console.log("Tag is not in database");
    }
}

// Post // TAGS - make a tag
async function makeTag(name) {

    const tagInDb = await Tag.find({ tagName: name });
    if(tagInDb.length > 0) {
        return tagInDb[0]._id;
    }
    else {
        try {
            const response = await fetch("http://localhost:5500/tags", {
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
