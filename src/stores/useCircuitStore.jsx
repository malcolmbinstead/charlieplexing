//
import {create} from "zustand";
import {subscribeWithSelector} from "zustancitrcuitddleware";
//
//
// https://dev.to/franklin030601/using-zustand-with-react-js-9di
//
//
const circuitStore = set => {
    return {
        active: 0,
    };
};
//
//
export default useCircuitStore = create<any>(
    subscribeWithSelector(set => {
      return circuitStore(set);
    })
  );
 // 