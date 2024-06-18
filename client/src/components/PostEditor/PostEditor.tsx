import { Button, DialogActions, TextField } from "@mui/material";
import "./styles.css";
import { MouseEvent, useEffect, useState } from "react";
import { PostData, UserData } from "../../types";
import { makeApiCall } from "../../apiUtils";

interface IPostEditorProps {
  closeEditor: () => void;
  loadingPosts: () => void;
  user: UserData;
  newPost: boolean;
  posts: PostData[];
  id: number;
}

// PostEditor component handles creation and editing of posts
export const PostEditor: React.FC<IPostEditorProps> = ({ closeEditor, loadingPosts, user, newPost, posts, id }) => {
  const [inputImg, setInputImg] = useState<string>("");
  const [inputContent, setInputContent] = useState<string>("");
  const [buttonLabel, setButtonLabel] = useState("Send");
  const [error, setError] = useState<string>("");

  // useEffect hook to prefill form fields if editing an existing post
  useEffect(() => {
    if (!newPost) {
      setButtonLabel("Edit");

      prefillFormFields();
    }
  }, [newPost, id, posts]);

  // Handler for input change, resets error message on input
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(e.target.value);

      setError("");
    };

  // Validates input fields, ensures either image URL or content is provided
  const validateInput = (): boolean => {
    if (!inputImg.trim() && !inputContent.trim()) {
      setError("Either image URL or content must be provided.");

      return false;
    }
    return true;
  };

  // Handles form submission, sends data to the server and closes the editor
  const sendDataAndClose = async (e: MouseEvent) => {
    e.preventDefault();

    if (!validateInput()) {
      return;
    }

    setButtonLabel("Sending...");

    const data: PostData = createPostData();

    const { url, method } = getRequestDetails();

    try {
      const response = await makeApiCall<PostData[]>(url, method, data);

      if (response) {
        closeEditor();

        loadingPosts();
      } else {
        setButtonLabel("Send");

        console.error("Failed to send data");
      }
    } catch (error) {
      handleError(error);
    }
  };

  // Prefills the form fields with data from the post to be edited
  const prefillFormFields = () => {
    const post = posts.find(p => p.id === id);

    if (post) {
      setInputImg(post.imageUrl || "");

      setInputContent(post.content);
    }
  };

  // Creates a PostData object with current input values
  const createPostData = (): PostData => {
    return {
      imageUrl: inputImg,
      content: inputContent,
      userId: user.id,
      date: new Date().toISOString()
    };
  };

  // Display new post or edit post acording to action add or edit
  const getRequestDetails = () => {
    return {
      url: newPost ? 'posts/add' : `posts/edit/${id}`,
      method: newPost ? 'POST' : 'PATCH'
    };
  };

  // Handles errors during data submission
  const handleError = (error: any) => {
    setButtonLabel("Send");
    
    console.error("Error:", error);
  };

  return (
    <div className="post-editor-content">
      <h3>{newPost ? "New post" : "Edit post"}</h3>
      <TextField
        fullWidth
        label="Image URL"
        variant="filled"
        value={inputImg}
        onChange={handleInputChange(setInputImg)}
      />
      <TextField
        fullWidth
        label="Content"
        multiline
        rows={4}
        variant="filled"
        value={inputContent}
        onChange={handleInputChange(setInputContent)}
      />
      {error && <p className="error-message">{error}</p>}
      <DialogActions>
        <Button onClick={closeEditor}>Cancel</Button>
        <Button
          onClick={sendDataAndClose}
          autoFocus
          disabled={!inputImg.trim() && !inputContent.trim()}
        >
          {buttonLabel}
        </Button>
      </DialogActions>
    </div>
  );
};
