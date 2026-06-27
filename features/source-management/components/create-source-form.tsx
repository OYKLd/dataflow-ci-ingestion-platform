import { createSourceAction } from "../actions/create-source.action";

export function CreateSourceForm() {
  return (
    <form
      action={createSourceAction}
      className="space-y-4 max-w-lg"
    >
      {/* NAME */}
      <div>
        <label className="block mb-1">
          Source Name
        </label>

        <input
          name="name"
          required
          className="w-full border rounded p-2"
          placeholder="Ventes Orange CI"
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="block mb-1">
          Description
        </label>

        <textarea
          name="description"
          className="w-full border rounded p-2"
          placeholder="Weekly sales data"
        />
      </div>

      {/* JSON MANUEL */}
      <div>
        <label className="block mb-1">
          Schema (écriture manuelle JSON)
        </label>

        <textarea
          name="schemaText"
          rows={12}
          className="border p-2 w-full font-mono"
          placeholder={`{
  "columns": []
}`}
        />
      </div>

      {/* FILE UPLOAD */}
      <div>
        <label className="block mb-1">
          Ou importer un fichier JSON
        </label>

        <input
          type="file"
          name="schemaFile"
          accept="application/json,.json"
          className="w-full border p-2"
        />
      </div>

      <button
        type="submit"
        className="border px-4 py-2 rounded"
      >
        Create Source
      </button>
    </form>
  );
}