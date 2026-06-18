export type Application = {
  id: number;
  name: string;
  repo_url: string;
  domain: string;
  port: number;
  path?: string;
  install_command: string;
  build_command: string;
  start_command: string;
  env_content: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

export type ApplicationFormValues = {
  name: string;
  repo_url: string;
  domain: string;
  port: number;
  install_command: string;
  build_command: string;
  start_command: string;
  env_content: string;
  status?: string;
};

export type ApplicationStatusResponse = {
  application_id: number;
  status: {
    status: string;
    pm2_running: boolean;
    port_open: boolean;
    port: number;
    url: string;
  };
};

export type ApplicationLogsResponse = {
  application_id: number;
  logs: string;
};