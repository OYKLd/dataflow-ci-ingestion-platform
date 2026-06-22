export interface SchemaColumn {
  name: string;
  type: string;
  required: boolean;
}

export interface SourceSchema {
  columns: SchemaColumn[];
}