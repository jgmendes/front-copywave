export interface IndicatorInterface {
  messages: IndicatorMessagesInterface;
  shippings: number;
}

export interface IndicatorMessagesInterface {
  details: IndicatorMessagesDetailsInterface[];
  total: number;
}

interface IndicatorMessagesDetailsInterface {
  status: string;
  quantity: number;
  description: string;
}

export interface ChartByMonthInterface {
  messages: {
    month: string;
    quantity: number;
  }[];
}
