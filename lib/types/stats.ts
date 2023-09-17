export type UserInventoryStat = {
  date: string;
  time: string;
  value: number;
};

export type UserInventoryStats = {
  total_items_history?: UserInventoryStat[];
  total_items_price_history?: UserInventoryStat[];
  total_items_amount_history?: UserInventoryStat[];
};
