const postController = {};
const Post = require("../models/post.model");

postController.getAllPosts = async (req, res) => {
  try {
    const result = await Post.find();
    res.status(200).send({
      message: "Getting all posts from server",
      posts: result,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};
postController.addPost = async (req, res) => {
  try {
    const body = req.body;
    const post = new Post(body);
    const result = await post.save();
    res.status(200).send({
      message: "Post added successfully",
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};
postController.updatePost = async (req, res) => {
  if (!req.params._id) {
    res.status(500).send({
      message: "ID missing",
    });
  }
  try {
    const _id = req.params._id;
    let updates = req.body;
    runUpdate(_id, updates, res);
  } catch (error) {
    return res.status(500).send(error);
  }
};
async function runUpdate(_id, updates, res) {
  try {
    const result = await Post.updateOne(
      {
        _id: _id,
      },
      {
        $set: updates,
      },
      {
        upsert: true,
        runValidators: true,
      }
    );
    res.status(200).send({
      code: 200,
      message: "Updated Successfully",
    });
  } catch (error) {
    return res.status(500).send(error);
  }
}
postController.deletePost = async (req, res) => {
  if (!req.params._id) {
    res.status(500).send({
      message: "Required city missing",
    });
  }
  try {
    const _id = req.params._id;
    const result = await Post.findOneAndDelete({
      _id: _id,
    });
    res.status(200).send({
      code: 200,
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};
module.exports = postController;
