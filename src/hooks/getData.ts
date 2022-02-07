// import axios from 'axios'
import { Ref, ref } from "vue";
import http from '../utils/http'

interface ReTest {
  httpObj: object;
  httpArr: any;
}

export default function (): ReTest {
  const httpObj: Ref = ref(null);
  const httpArr: Ref = ref(null);

  // axios
  //   .get("http://127.0.0.1:5500/vue3/data/testData/obj.json")
  //   .then((res) => {
  //     httpObj.value = res.data;
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  http.get("obj.json")
  .then((res) => {
    httpObj.value = res;
  })
  .catch((err) => {
    console.log(err);
  });

  http.get("arr.json")
  .then((res) => {
    httpArr.value = res;
    console.log(res,'????????--httpArr')
  })
  .catch((err) => {
    console.log(err);
  });

  return {
    httpObj,
    httpArr
  }
}