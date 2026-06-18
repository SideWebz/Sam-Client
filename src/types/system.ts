export type SystemItem = {
  installed: boolean;
  path: string;
  message: string;
};

export type SystemResponse = {
  system: Record<string, SystemItem>;
};