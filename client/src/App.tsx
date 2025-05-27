import { Button } from "@mui/material";
import { type FormEvent, type ChangeEvent } from "react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [fileChosen, setFileChosen] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [success, setSuccess] = useState({ status: false, message: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // setStatus("uploading");
    setLoading(true);
    if (fileChosen) {
      const form = event.currentTarget;
      const formData = new FormData(form);

      // make an id for this user
      let userId = localStorage.getItem("userId");
      if (!userId) {
        userId = uuidv4();
        localStorage.setItem("userId", userId);
      }

      // add this to the formData
      formData.set("userId", userId);

      // send file to API for doing stuff with it
      try {
        const res = await fetch("/api/fileUpload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          // setStatus("success");
          const data = await res.json();
          setSuccess({ status: true, message: JSON.stringify(data) });
        } else {
          console.log("error with response");
          // setStatus("failure");
        }
        //
        // setLoading(false);
      } catch {
        // setStatus("failure");
      }

      formReset(form);
    } else {
      console.error(`No file chosen`);
      // setStatus("idle");
    }
    setLoading(false);
  }

  function formReset(form: HTMLFormElement) {
    setFileChosen(false);
    form.reset();
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setFileChosen(true);
      const file = event.target.files[0];
      setFileName(file.name);
    } else {
      setFileChosen(false);
    }
    // setStatus("idle");
  }

  return success.status ? (
    <div>{success.message}</div>
  ) : (
    <form action="/api/fileUpload" method="POST" onSubmit={handleSubmit}>
      <Button
        type="submit"
        variant="contained"
        loading={loading}
        loadingIndicator="Uploading..."
      >
        {/* {status === "idle" ? `Submit File` : `File failed to upload`} */}
        Upload File
      </Button>

      <Button
        component="label"
        variant="outlined"
        sx={{ maxWidth: "300px", overflow: "hidden" }}
        disabled={loading}
      >
        {fileChosen ? `File Chosen: ${fileName}` : "Choose File"}
        <input
          type="file"
          name="file"
          accept=".md"
          hidden
          onChange={handleChange}
        />
      </Button>
    </form>
  );
}

export default App;
