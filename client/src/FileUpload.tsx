import { type FormEvent, type ChangeEvent } from "react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { MailOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "./Navbar";
function FileUploadControls() {
  const [fileChosen, setFileChosen] = useState<boolean>(false);
  // const [fileName, setFileName] = useState<string>("");
  const [success, setSuccess] = useState({ status: false, message: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // setStatus("uploading");
    setLoading(true);
    if (fileChosen) {
      const form = event.currentTarget;
      const formData = new FormData(form);
      console.log(formData);
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
          console.log("Error with response");
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
      // const file = event.target.files[0];
      // setFileName(file.name);
    } else {
      setFileChosen(false);
    }
    // setStatus("idle");
  }

  return success.status ? (
    <div>{success.message}</div>
  ) : (
    <form action="/api/fileUpload" method="POST" onSubmit={handleSubmit}>
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="animate-spin" />}
        <MailOpen /> Upload File
      </Button>

      <Label htmlFor="file">Markdown File</Label>
      <Input
        type="file"
        id="file"
        name="file"
        accept=".md"
        onChange={handleChange}
        disabled={loading}
      />
    </form>
  );
}

function FileUpload() {
  return (
    <div>
      <Navbar />
      <FileUploadControls />
    </div>
  );
}

export default FileUpload;
