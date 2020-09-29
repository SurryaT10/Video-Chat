let posts = [];

const newQuestion = (details, userId) => {
    posts.push({
        ...details,
        userId,
        users: []
    });
};

const getQuestion = (id) => {
    const post = posts.filter(post => post.id === id);
    return post[0];
}

const getQuestions = (id) => {
    const allPosts = posts.filter(post => post.userId === id);
    return allPosts;
}

const setQuestion = (updatedPost) => {
    posts = posts.map(post => {
        if (post.id === updatedPost.id)
            return updatedPost;
        return post;
    });
}

const deleteQuestion = (id) => {
    posts = posts.filter(post => id !== post.id);
}

module.exports = {
    newQuestion,
    getQuestion,
    getQuestions,
    setQuestion,
    deleteQuestion
}