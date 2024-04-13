export type Root = {
  set_size: number;
  set_data: Array<{
    title: string;
    data: Array<{
      title: string;
      score: number;
    }>;
  }>;
};
