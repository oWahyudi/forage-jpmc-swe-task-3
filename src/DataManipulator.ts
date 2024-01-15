import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number|undefined,
}


export class DataManipulator {
  // static generateRow(serverResponds: ServerRespond[]) {
  //   return serverResponds.map((el: any) => {
  //     return {
  //       stock: el.stock,
  //       top_ask_price: el.top_ask && el.top_ask.price || 0,
  //       timestamp: el.timestamp,
  //     };
  //   })
  // }
  static generateRow(serverResponds: ServerRespond[]): Row {
    const priceABC= (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price)/2;
    const priceDEF= (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price)/2;
    const timestamp=serverResponds[0].timestamp > serverResponds[1].timestamp ? serverResponds[0].timestamp : serverResponds[1].timestamp;
    const ratio= priceABC / priceDEF;
    const upper_bound= 1.5 + 0.05;
    const lower_bound= 1.0 - 0.05;
    const trigger_alert= (ratio > upper_bound || ratio < lower_bound)? ratio : undefined;
    return {
            price_abc: priceABC,
            price_def: priceDEF,
            ratio: ratio,
            timestamp: timestamp,
            upper_bound: upper_bound,
            lower_bound: lower_bound,
            trigger_alert: trigger_alert,
          };
  }
}
