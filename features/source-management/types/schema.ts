export type ColumnDefinition = {
  name: string;
  type:
    | "string"
    | "date"
    | "integer"
    | "enum";

  required: boolean;

  pattern?: string;

  allowed_values?: string[];

  min?: number;

  max?: number;
};

export type SourceSchema = {
  columns: ColumnDefinition[];
};