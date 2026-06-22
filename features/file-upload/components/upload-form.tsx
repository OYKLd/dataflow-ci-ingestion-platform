import {
  uploadFileAction,
} from "../actions/upload-file.action";

export function UploadForm({
  sourceId,
}: {
  sourceId: string;
}) {
  return (
    <form
      action={uploadFileAction.bind(
        null,
        sourceId
      )}
      className="border rounded p-4 mt-8"
    >
      <input
        type="file"
        name="file"
        accept=".csv,.xlsx"
      />

      <button
        type="submit"
        className="border px-4 py-2 ml-4"
      >
        Upload
      </button>
    </form>
  );
}