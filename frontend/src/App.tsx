import { useState } from "react";
import { Toaster, toast } from "sonner";
import './App.css'
import { uploadFile } from "./services/upload";
import { Person } from "./interfaces";
import { Search } from "./steps/Search";

enum APP_STATUS {
  IDLE,
  ERROR,
  READY_UPLOAD,
  UPLOADING,
  READY_USAGE
}

const BUTTON_TEXT = {
  [APP_STATUS.READY_UPLOAD]: 'Upload file',
  [APP_STATUS.UPLOADING]: 'Uploading...',
}

export const App = () => {
  const [appStatus, setAppStatus] = useState<APP_STATUS>(APP_STATUS.IDLE)
  const [data, setData] = useState<Person[]>([])
  const [file, setFile] = useState<File | null>(null)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files ?? [];

    if (file) {
      setFile(file);
      setAppStatus(APP_STATUS.READY_UPLOAD);
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (appStatus !== APP_STATUS.READY_UPLOAD || !file) {
      return
    }

    setAppStatus(APP_STATUS.UPLOADING);

    const [err, newData] = await uploadFile(file);
    console.log({ err, data });

    if (err) {
      setAppStatus(APP_STATUS.ERROR);
      toast.error(err.message);
      return
    }

    setAppStatus(APP_STATUS.READY_USAGE);
    if (newData) setData(newData);
    toast.success('File uploaded successfully')
  }

  const showButton = appStatus === APP_STATUS.READY_UPLOAD || appStatus === APP_STATUS.UPLOADING;
  const showInput = appStatus !== APP_STATUS.READY_USAGE;

  return (
    <>
      <Toaster />
      <h3>Upload CSV && Search</h3>
      {
        showInput && (
          <form onSubmit={handleSubmit}>
            <label>
              <input
                disabled={appStatus === APP_STATUS.UPLOADING}
                onChange={handleInputChange}
                name="file"
                type="file"
                accept=".csv"
                data-test="input-file"
              />
            </label>

            {
              showButton && (
                <button data-test="submit-file-button">
                  {BUTTON_TEXT[appStatus]}
                </button>
              )
            }
          </form>
        )
      }

      {
        appStatus === APP_STATUS.READY_USAGE && (
          <Search initialData={data} />
        )
      }
    </>
  )
}
