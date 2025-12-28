export interface ProgressItem {
  id: string;
  title: string;
  status: string;
  value: string;
}

export interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  primaryLink: string;
  primaryLinkText: string;
  secondaryLink?: string;
  secondaryLinkText?: string;
  hintText?: string;
  icon?: string;
}

export interface Resource {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  link: string;
  linkText: string;
  icon?: string;
}

export interface SecondaryService {
  id: string;
  title: string;
  description: string;
}

