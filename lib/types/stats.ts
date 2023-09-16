export type UserInventoryStat = {
  date: string;
  time: string;
  value: number;
};

export type UserInventoryStats = {
  totalItemsChangeOvertime: UserInventoryStat[];
  totalPriceChangeOvertime: UserInventoryStat[];
  totalAmountChangeOvertime: UserInventoryStat[];
};
