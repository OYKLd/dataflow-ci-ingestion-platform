import { createSourceAction } from "../actions/create-source.action";

export function CreateSourceForm() {
  return (
    <form
        action={createSourceAction}
        className="space-y-4 max-w-lg"
      >
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

        {/* Nouveau champ */}
        <div>
          <label className="block mb-1">
            Schema
          </label>

          <textarea
            name="schema"
            rows={20}
            className="border p-2 w-full font-mono"
            placeholder={`{
        "columns": []
      }`}
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