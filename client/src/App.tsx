import { Button } from "@mui/material";
import { type FormEvent, type ChangeEvent } from "react";
import { useState } from "react";

function App() {
  const [fileChosen, setFileChosen] = useState(false);
  const [fileName, setFileName] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get("file") as File;
    console.log(file);
    formReset(event.currentTarget);
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
      console.log(file);
    } else {
      setFileChosen(false);
    }
  }

  return (
    <form action="" onSubmit={handleSubmit}>
      <Button type="submit" variant="contained">
        Submit Form
      </Button>

      <Button
        component="label"
        variant="outlined"
        sx={{ maxWidth: "300px", overflow: "hidden" }}
      >
        {fileChosen ? `File Chosen: ${fileName}` : "Choose File"}
        <input type="file" name="file" hidden onChange={handleChange} />
      </Button>
    </form>
  );
}

export default App;
