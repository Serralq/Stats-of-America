export type Root = {
  set_data: Array<{
    title: string;
    data: Array<{
      title: string;
      score: number;
    }>;
  }>;
};
