import { type FormEvent, type ChangeEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { UploadCloud, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "./Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const apiEndpoint = import.meta.env.VITE_API_URL as string;

interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface SuccessData {
  filesStored: number;
  chunksCreated: number;
  estimatedTokens: number;
}

interface FailureData {
  error: string;
}

function FileUploadControls() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0) {
      setError("Please select at least one file to upload.");
      return;
    }

    setLoading(true);
    setSuccessData(null);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem("userId", userId);
    }
    formData.set("userId", userId);


    try {
      const res = await fetch(`${apiEndpoint}/api/fileUpload`, {
        method: "POST",
        body: formData,
      });

      const responseData: APIResponse<SuccessData | FailureData> = await res.json();

      if (res.ok && responseData.success) {
        setSuccessData(responseData.data as SuccessData);
      } else {
        setError(responseData.message || "An unknown error occurred during upload.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "A network error occurred. Please try again.");
    } finally {
      setLoading(false);
      form.reset();
      setSelectedFiles(null);
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      const maxFiles = 30;
      const maxFileSize = 5 * 1024 * 1024;

      if (event.target.files.length > maxFiles) {
        setError(`You can only upload up to ${maxFiles} files at a time.`);
        event.target.value = "";
        setSelectedFiles(null);
        setSuccessData(null);
        return;
      }

      for (const file of Array.from(event.target.files)) {
        if (file.size > maxFileSize) {
          setError(
            `File "${file.name}" (${(file.size / 1024 / 1024).toFixed(2)} MB) exceeds the ${maxFileSize} MB size limit.`
          );
          event.target.value = "";
          setSelectedFiles(null);
          setSuccessData(null);
          return;
        }
      }

      setSelectedFiles(event.target.files);
      setError(null);
      setSuccessData(null);
    } else {
      setSelectedFiles(null);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Upload Markdown Files</CardTitle>
          <CardDescription>
            Select one or more .md files to process and store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="file" className="text-sm font-medium">
                Choose Markdown File(s)
              </Label>
              <Input
                type="file"
                id="file"
                name="file"
                accept=".md"
                onChange={handleChange}
                disabled={loading}
                multiple
                className="file:mr-4 file:py-0.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {selectedFiles && selectedFiles.length > 0 && (
                <div className="mt-2 text-sm text-muted-foreground">
                  <p>Selected files:</p>
                  <ul className="list-disc list-inside">
                    {Array.from(selectedFiles).map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="mr-2 h-4 w-4" />
              )}
              Upload File(s)
            </Button>
          </form>
        </CardContent>

        {(successData || error) && (
          <CardFooter className="flex flex-col items-start space-y-4">
            {successData && (
              <Alert variant="default" className="w-full bg-green-50 border-green-300">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <AlertTitle className="text-green-700">Upload Successful!</AlertTitle>
                <AlertDescription className="text-green-600">
                  Files stored: {successData.filesStored}
                </AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive" className="w-full">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Upload Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

function FileUpload() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FileUploadControls />
    </div>
  );
}

export default FileUpload;